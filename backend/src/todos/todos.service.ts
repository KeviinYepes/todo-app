import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, createTodoDto: CreateTodoDto) {
    return this.prisma.todo.create({
      data: {
        name: createTodoDto.name.trim(),
        userId,
      },
      select: this.todoSelect,
    });
  }

  async findAll(userId: string) {
    return this.prisma.todo.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: this.todoSelect,
    });
  }

  async update(userId: string, todoId: string, updateTodoDto: UpdateTodoDto) {
    await this.ensureTodoOwnership(userId, todoId);

    return this.prisma.todo.update({
      where: { id: todoId },
      data: {
        ...(updateTodoDto.name !== undefined
          ? { name: updateTodoDto.name.trim() }
          : {}),
        ...(updateTodoDto.completed !== undefined
          ? { completed: updateTodoDto.completed }
          : {}),
      },
      select: this.todoSelect,
    });
  }

  async remove(userId: string, todoId: string) {
    await this.ensureTodoOwnership(userId, todoId);

    await this.prisma.todo.delete({
      where: { id: todoId },
    });

    return {
      message: 'Todo deleted successfully.',
    };
  }

  private async ensureTodoOwnership(userId: string, todoId: string) {
    const todo = await this.prisma.todo.findFirst({
      where: {
        id: todoId,
        userId,
      },
      select: { id: true },
    });

    if (!todo) {
      throw new NotFoundException('Todo not found.');
    }
  }

  private readonly todoSelect = {
    id: true,
    name: true,
    completed: true,
    createdAt: true,
    userId: true,
  };
}
