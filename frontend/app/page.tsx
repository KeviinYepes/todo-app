'use client';

import LoginRoundedIcon from '@mui/icons-material/LoginRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded';
import ShieldRoundedIcon from '@mui/icons-material/ShieldRounded';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';
import { FormEvent, useEffect, useState } from 'react';

type AuthMode = 'login' | 'register';

type SessionUser = {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
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
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loadingSession, setLoadingSession] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void loadSession();
  }, []);

  async function loadSession() {
    setLoadingSession(true);

    try {
      const response = await fetch('/api/auth/session', {
        method: 'GET',
        cache: 'no-store',
      });
      const data = await response.json();
      setSessionUser(data.user ?? null);
    } catch {
      setErrorMessage('We could not check your session right now.');
    } finally {
      setLoadingSession(false);
    }
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Registration failed.');
      }

      setStatusMessage(data.message ?? 'Account created. You can log in now.');
      setRegisterForm(initialRegisterForm);
      setMode('login');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Registration failed.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Login failed.');
      }

      setSessionUser(data.user);
      setStatusMessage(data.message ?? 'Login successful.');
      setLoginForm(initialLoginForm);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleLogout() {
    setSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message ?? 'Logout failed.');
      }

      setSessionUser(null);
      setStatusMessage(data.message ?? 'Logout successful.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Logout failed.');
    } finally {
      setSubmitting(false);
    }
  }

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
      <Stack
        direction={{ xs: 'column', lg: 'row' }}
        spacing={3}
        sx={{ width: '100%', maxWidth: 1180 }}
      >
        <Paper
          elevation={0}
          sx={{
            flex: 1.15,
            p: { xs: 3, md: 5 },
            border: '1px solid rgba(15, 23, 42, 0.08)',
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.95), rgba(255,248,240,0.92))',
            backdropFilter: 'blur(16px)',
          }}
        >
          <Stack spacing={3}>
            <Chip
              icon={<ShieldRoundedIcon />}
              label="JWT auth with secure frontend cookies"
              color="primary"
              variant="outlined"
              sx={{ alignSelf: 'flex-start' }}
            />
            <Stack spacing={1}>
              <Typography variant="h2" sx={{ fontSize: { xs: 36, md: 52 } }}>
                Welcome back to your todo workspace.
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Create an account, sign in, and keep the token off the client by
                letting the frontend store it in an `httpOnly` cookie.
              </Typography>
            </Stack>

            {statusMessage ? <Alert severity="success">{statusMessage}</Alert> : null}
            {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: '1px solid rgba(15, 23, 42, 0.08)',
                overflow: 'hidden',
              }}
            >
              <Tabs
                value={mode}
                onChange={(_, value: AuthMode) => setMode(value)}
                variant="fullWidth"
              >
                <Tab value="login" label="Login" />
                <Tab value="register" label="Register" />
              </Tabs>

              <Box sx={{ p: 3 }}>
                {mode === 'login' ? (
                  <Stack
                    component="form"
                    spacing={2}
                    onSubmit={handleLogin}
                  >
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
                      disabled={submitting}
                    >
                      {submitting ? 'Signing in...' : 'Sign in'}
                    </Button>
                  </Stack>
                ) : (
                  <Stack
                    component="form"
                    spacing={2}
                    onSubmit={handleRegister}
                  >
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
                      disabled={submitting}
                    >
                      {submitting ? 'Creating account...' : 'Create account'}
                    </Button>
                  </Stack>
                )}
              </Box>
            </Paper>
          </Stack>
        </Paper>

        <Paper
          elevation={0}
          sx={{
            flex: 0.85,
            p: { xs: 3, md: 4 },
            border: '1px solid rgba(15, 23, 42, 0.08)',
            backgroundColor: 'rgba(255, 253, 248, 0.92)',
          }}
        >
          <Stack spacing={3} sx={{ height: '100%' }}>
            <Stack spacing={1}>
              <Typography variant="h5">Session state</Typography>
              <Typography variant="body2" color="text.secondary">
                This panel reflects the active authenticated user from the
                frontend cookie-backed session.
              </Typography>
            </Stack>

            {loadingSession ? (
              <Stack
                sx={{
                  flex: 1,
                  minHeight: 240,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress />
              </Stack>
            ) : sessionUser ? (
              <Stack spacing={2.5} sx={{ flex: 1 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 4,
                    background:
                      'linear-gradient(145deg, rgba(15,118,110,0.14), rgba(249,115,22,0.10))',
                  }}
                >
                  <Stack spacing={1.5}>
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
                  </Stack>
                </Paper>

                <Button
                  variant="outlined"
                  size="large"
                  startIcon={<LogoutRoundedIcon />}
                  onClick={handleLogout}
                  disabled={submitting}
                >
                  {submitting ? 'Signing out...' : 'Logout'}
                </Button>
              </Stack>
            ) : (
              <Stack
                spacing={2}
                sx={{ flex: 1, minHeight: 240, justifyContent: 'center' }}
              >
                <Typography variant="h6">No active session</Typography>
                <Typography color="text.secondary">
                  Register a new user or sign in with an existing account to see
                  the session reflected here.
                </Typography>
              </Stack>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
