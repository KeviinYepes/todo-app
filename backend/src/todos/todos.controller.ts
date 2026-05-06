import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/interfaces/auth-request.interface';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodosService } from './todos.service';

@UseGuards(JwtAuthGuard)
@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  create(
    @Req() request: AuthenticatedRequest,
    @Body() createTodoDto: CreateTodoDto,
  ) {
    return this.todosService.create(request.user.sub, createTodoDto);
  }

  @Get()
  findAll(@Req() request: AuthenticatedRequest) {
    return this.todosService.findAll(request.user.sub);
  }

  @Patch(':id')
  update(
    @Req() request: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    return this.todosService.update(request.user.sub, id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Req() request: AuthenticatedRequest, @Param('id') id: string) {
    return this.todosService.remove(request.user.sub, id);
  }
}
