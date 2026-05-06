'use client';

import AddTaskRoundedIcon from '@mui/icons-material/AddTaskRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import RadioButtonUncheckedRoundedIcon from '@mui/icons-material/RadioButtonUncheckedRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';
import {
  apiClient,
  backendApiUrl,
  clearStoredAuthToken,
  getApiErrorMessage,
  getStoredAuthToken,
  storeAuthToken,
} from '@/lib/api-client';

type AuthMode = 'login' | 'register';

type User = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
};

type Todo = {
  id: string;
  name: string;
  completed: boolean;
  createdAt: string;
  userId: string;
};

const initialRegisterForm = {
  name: '',
  email: '',
  password: '',
};

const initialLoginForm = {
  email: '',
  password: '',
};

export default function Home() {
  const [mode, setMode] = useState<AuthMode>('login');
  const [registerForm, setRegisterForm] = useState(initialRegisterForm);
  const [loginForm, setLoginForm] = useState(initialLoginForm);
  const [todoName, setTodoName] = useState('');
  const [editingTodoId, setEditingTodoId] = useState<string | null>(null);
  const [editingTodoName, setEditingTodoName] = useState('');
  const [sessionUser, setSessionUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [loadingTodos, setLoadingTodos] = useState(false);
  const [submittingAuth, setSubmittingAuth] = useState(false);
  const [submittingTodo, setSubmittingTodo] = useState(false);

  useEffect(() => {
    void loadSession();
  }, []);

  async function loadSession() {
    setLoadingSession(true);
    setErrorMessage(null);

    try {
      const token = getStoredAuthToken();

      if (!token) {
        setSessionUser(null);
        setTodos([]);
        return;
      }

      const { data } = await apiClient.get<User>('/auth/me');
      setSessionUser(data);
      await loadTodos();
    } catch (error) {
      clearStoredAuthToken();
      setSessionUser(null);
      setTodos([]);
      setErrorMessage(getApiErrorMessage(error, 'We could not restore your session.'));
    } finally {
      setLoadingSession(false);
    }
  }

  async function loadTodos() {
    setLoadingTodos(true);

    try {
      const { data } = await apiClient.get<Todo[]>('/todos');
      setTodos(data);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'We could not load your todos.'));
    } finally {
      setLoadingTodos(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingAuth(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await apiClient.post('/auth/register', registerForm);
      setRegisterForm(initialRegisterForm);
      setMode('login');
      setStatusMessage(data.message ?? 'Account created. Please log in.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Registration failed.'));
    } finally {
      setSubmittingAuth(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmittingAuth(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await apiClient.post<{
        accessToken: string;
        user: User;
      }>('/auth/login', loginForm);

      storeAuthToken(data.accessToken);
      setSessionUser(data.user);
      setLoginForm(initialLoginForm);
      setMode('login');
      setStatusMessage('Login successful.');
      await loadTodos();
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Login failed.'));
    } finally {
      setSubmittingAuth(false);
    }
  }

  async function handleLogout() {
    setSubmittingAuth(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await apiClient.post('/auth/logout');
    } catch {
      // Logout is stateless; local cleanup is what matters most here.
    } finally {
      clearStoredAuthToken();
      setSessionUser(null);
      setTodos([]);
      setEditingTodoId(null);
      setEditingTodoName('');
      setStatusMessage('Logout successful.');
      setSubmittingAuth(false);
    }
  }

  async function handleCreateTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!todoName.trim()) {
      setErrorMessage('Todo name is required.');
      return;
    }

    setSubmittingTodo(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await apiClient.post<Todo>('/todos', {
        name: todoName,
      });
      setTodos((current) => [data, ...current]);
      setTodoName('');
      setStatusMessage('Todo created successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Todo creation failed.'));
    } finally {
      setSubmittingTodo(false);
    }
  }

  async function handleToggleTodo(todo: Todo) {
    setSubmittingTodo(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await apiClient.patch<Todo>(`/todos/${todo.id}`, {
        completed: !todo.completed,
      });

      setTodos((current) =>
        current.map((item) => (item.id === todo.id ? data : item)),
      );
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Todo update failed.'));
    } finally {
      setSubmittingTodo(false);
    }
  }

  function startEditing(todo: Todo) {
    setEditingTodoId(todo.id);
    setEditingTodoName(todo.name);
  }

  async function handleSaveTodo(todoId: string) {
    if (!editingTodoName.trim()) {
      setErrorMessage('Todo name is required.');
      return;
    }

    setSubmittingTodo(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      const { data } = await apiClient.patch<Todo>(`/todos/${todoId}`, {
        name: editingTodoName,
      });

      setTodos((current) =>
        current.map((item) => (item.id === todoId ? data : item)),
      );
      setEditingTodoId(null);
      setEditingTodoName('');
      setStatusMessage('Todo updated successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Todo update failed.'));
    } finally {
      setSubmittingTodo(false);
    }
  }

  async function handleDeleteTodo(todoId: string) {
    setSubmittingTodo(true);
    setStatusMessage(null);
    setErrorMessage(null);

    try {
      await apiClient.delete(`/todos/${todoId}`);
      setTodos((current) => current.filter((item) => item.id !== todoId));
      setStatusMessage('Todo deleted successfully.');
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, 'Todo deletion failed.'));
    } finally {
      setSubmittingTodo(false);
    }
  }

  const completedCount = todos.filter((todo) => todo.completed).length;
  const isAuthenticated = !!sessionUser;

  return (
    <Box
      sx={{
        minHeight: '100vh',
        px: { xs: 2, md: 4 },
        py: { xs: 3, md: 5 },
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Stack spacing={3} sx={{ width: '100%', maxWidth: 1240 }}>
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            border: '1px solid rgba(15, 23, 42, 0.08)',
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.96), rgba(255,248,240,0.92))',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Stack
            direction={{ xs: 'column', lg: 'row' }}
            spacing={3}
            sx={{ justifyContent: 'space-between' }}
          >
            <Stack spacing={2} sx={{ maxWidth: 760 }}>
              <Chip
                icon={<ShieldRoundedIcon />}
                label="Axios + JWT from localStorage"
                color="primary"
                variant="outlined"
                sx={{ alignSelf: 'flex-start' }}
              />
              <Typography variant="h2" sx={{ fontSize: { xs: 34, md: 54 } }}>
                Your auth and todo workspace in one screen.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {isAuthenticated
                  ? 'Manage your todos with MongoDB-backed CRUD and a JWT carried through axios.'
                  : 'Sign in to reach your todo list, or create an account right from the same form.'}
              </Typography>
              <Chip
                label={`Backend: ${backendApiUrl}`}
                variant="filled"
                sx={{ alignSelf: 'flex-start', backgroundColor: 'rgba(15,118,110,0.08)' }}
              />
            </Stack>

            {isAuthenticated ? (
              <Paper
                elevation={0}
                sx={{
                  width: { xs: '100%', lg: 360 },
                  p: 3,
                  borderRadius: 4,
                  border: '1px solid rgba(15, 23, 42, 0.08)',
                  backgroundColor: 'rgba(255, 253, 248, 0.96)',
                }}
              >
                <Stack spacing={2}>
                  <Typography variant="h6">Session</Typography>
                  <Chip
                    label="Authenticated"
                    color="primary"
                    sx={{ alignSelf: 'flex-start' }}
                  />
                  <Typography variant="h5">
                    {sessionUser.name || sessionUser.email}
                  </Typography>
                  <Typography color="text.secondary">
                    {sessionUser.email}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Joined {new Date(sessionUser.createdAt).toLocaleString()}
                  </Typography>
                  <Button
                    variant="outlined"
                    startIcon={<LogoutRoundedIcon />}
                    onClick={handleLogout}
                    disabled={submittingAuth}
                  >
                    Logout
                  </Button>
                </Stack>
              </Paper>
            ) : null}
          </Stack>
        </Paper>

        {statusMessage ? <Alert severity="success">{statusMessage}</Alert> : null}
        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        {loadingSession ? (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              borderRadius: 4,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 253, 248, 0.94)',
            }}
          >
            <Stack sx={{ alignItems: 'center', py: 6 }}>
              <CircularProgress />
            </Stack>
          </Paper>
        ) : !isAuthenticated ? (
          <Paper
            elevation={0}
            sx={{
              width: '100%',
              maxWidth: 540,
              mx: 'auto',
              borderRadius: 4,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 253, 248, 0.95)',
            }}
          >
            <Box sx={{ p: { xs: 3, md: 4 } }}>
              <Stack spacing={3}>
                <Stack spacing={1}>
                  <Typography variant="h4">
                    {mode === 'login' ? 'Login to continue' : 'Create your account'}
                  </Typography>
                  <Typography color="text.secondary">
                    {mode === 'login'
                      ? 'Use your credentials to access your personal todo list.'
                      : 'Sign up here, then you can jump straight into your workspace.'}
                  </Typography>
                </Stack>

                {mode === 'login' ? (
                  <Stack component="form" spacing={2} onSubmit={handleLogin}>
                    <TextField
                      label="Email"
                      type="email"
                      value={loginForm.email}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={loginForm.password}
                      onChange={(event) =>
                        setLoginForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      required
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      startIcon={<LoginRoundedIcon />}
                      disabled={submittingAuth}
                    >
                      {submittingAuth ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </Stack>
                ) : (
                  <Stack component="form" spacing={2} onSubmit={handleRegister}>
                    <TextField
                      label="Name"
                      value={registerForm.name}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      fullWidth
                    />
                    <TextField
                      label="Email"
                      type="email"
                      value={registerForm.email}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          email: event.target.value,
                        }))
                      }
                      required
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      type="password"
                      value={registerForm.password}
                      onChange={(event) =>
                        setRegisterForm((current) => ({
                          ...current,
                          password: event.target.value,
                        }))
                      }
                      helperText="Use at least 8 characters."
                      required
                      fullWidth
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      color="secondary"
                      startIcon={<PersonAddAlt1RoundedIcon />}
                      disabled={submittingAuth}
                    >
                      {submittingAuth ? 'Creating account...' : 'Create account'}
                    </Button>
                  </Stack>
                )}

                <Divider />

                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography color="text.secondary">
                    {mode === 'login'
                      ? "Don't have an account?"
                      : 'Already have an account?'}
                  </Typography>
                  <Button
                    variant="text"
                    onClick={() =>
                      setMode((current) =>
                        current === 'login' ? 'register' : 'login',
                      )
                    }
                  >
                    {mode === 'login' ? 'Register here' : 'Back to login'}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Paper>
        ) : (
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 4,
              border: '1px solid rgba(15, 23, 42, 0.08)',
              backgroundColor: 'rgba(255, 253, 248, 0.94)',
            }}
          >
            <Stack spacing={3}>
              <Stack
                direction={{ xs: 'column', md: 'row' }}
                spacing={2}
                sx={{ justifyContent: 'space-between' }}
              >
                <Stack spacing={1}>
                  <Typography variant="h5">Todo board</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Create, rename, complete, and delete todos stored in MongoDB.
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <Chip label={`${todos.length} total`} />
                  <Chip label={`${completedCount} completed`} color="primary" variant="outlined" />
                </Stack>
              </Stack>

              <Stack component="form" spacing={2} onSubmit={handleCreateTodo}>
                <TextField
                  label="New todo"
                  placeholder="Ship the todo CRUD flow"
                  value={todoName}
                  onChange={(event) => setTodoName(event.target.value)}
                  disabled={submittingTodo}
                  fullWidth
                />
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<AddTaskRoundedIcon />}
                  disabled={submittingTodo}
                >
                  {submittingTodo ? 'Saving...' : 'Add todo'}
                </Button>
              </Stack>

              <Divider />

              {loadingTodos ? (
                <Stack sx={{ alignItems: 'center', py: 6 }}>
                  <CircularProgress />
                </Stack>
              ) : todos.length === 0 ? (
                <Typography color="text.secondary">
                  No todos yet. Create your first one above.
                </Typography>
              ) : (
                <Stack spacing={2}>
                  {todos.map((todo) => {
                    const isEditing = editingTodoId === todo.id;

                    return (
                      <Paper
                        key={todo.id}
                        elevation={0}
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          border: '1px solid rgba(15, 23, 42, 0.08)',
                          background:
                            todo.completed
                              ? 'linear-gradient(145deg, rgba(15,118,110,0.10), rgba(255,255,255,0.92))'
                              : 'rgba(255,255,255,0.78)',
                        }}
                      >
                        <Stack spacing={2}>
                          <Stack
                            direction={{ xs: 'column', md: 'row' }}
                            spacing={2}
                            sx={{ justifyContent: 'space-between' }}
                          >
                            <Stack spacing={0.75} sx={{ flex: 1 }}>
                              {isEditing ? (
                                <TextField
                                  label="Todo name"
                                  value={editingTodoName}
                                  onChange={(event) =>
                                    setEditingTodoName(event.target.value)
                                  }
                                  fullWidth
                                />
                              ) : (
                                <Typography
                                  variant="h6"
                                  sx={{
                                    textDecoration: todo.completed
                                      ? 'line-through'
                                      : 'none',
                                    color: todo.completed
                                      ? 'text.secondary'
                                      : 'text.primary',
                                  }}
                                >
                                  {todo.name}
                                </Typography>
                              )}
                              <Typography variant="body2" color="text.secondary">
                                Created {new Date(todo.createdAt).toLocaleString()}
                              </Typography>
                            </Stack>

                            <Stack
                              direction="row"
                              spacing={1}
                              sx={{ alignSelf: 'flex-start' }}
                            >
                              <IconButton
                                color={todo.completed ? 'primary' : 'default'}
                                onClick={() => void handleToggleTodo(todo)}
                                disabled={submittingTodo}
                              >
                                {todo.completed ? (
                                  <CheckCircleRoundedIcon />
                                ) : (
                                  <RadioButtonUncheckedRoundedIcon />
                                )}
                              </IconButton>

                              {isEditing ? (
                                <IconButton
                                  color="primary"
                                  onClick={() => void handleSaveTodo(todo.id)}
                                  disabled={submittingTodo}
                                >
                                  <SaveRoundedIcon />
                                </IconButton>
                              ) : (
                                <IconButton
                                  onClick={() => startEditing(todo)}
                                  disabled={submittingTodo}
                                >
                                  <EditRoundedIcon />
                                </IconButton>
                              )}

                              <IconButton
                                color="error"
                                onClick={() => void handleDeleteTodo(todo.id)}
                                disabled={submittingTodo}
                              >
                                <DeleteOutlineRoundedIcon />
                              </IconButton>
                            </Stack>
                          </Stack>
                        </Stack>
                      </Paper>
                    );
                  })}
                </Stack>
              )}
            </Stack>
          </Paper>
        )}
      </Stack>
    </Box>
  );
}
