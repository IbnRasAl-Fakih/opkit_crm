import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, TaskStatus } from '@prisma/client';

import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { TasksGateway } from './gateways/tasks.gateway';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly tasksGateway: TasksGateway,
  ) {}

  async findAll() {
    return this.prismaService.task.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(dto: CreateTaskDto) {
    const createdTask = await this.prismaService.task.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: TaskStatus.TODO,
        userId: dto.assigneeId,
      },
    });

    this.tasksGateway.emitTaskCreated({
      id: createdTask.id,
      title: createdTask.title,
      description: createdTask.description,
      status: createdTask.status,
      userId: createdTask.userId,
      createdAt: createdTask.createdAt.toISOString(),
      updatedAt: createdTask.updatedAt.toISOString(),
    });

    return createdTask;
  }

  async update(taskId: string, dto: UpdateTaskDto) {
    const existingTask = await this.ensureTaskExists(taskId);

    const data: Prisma.TaskUpdateInput = {
      ...(dto.title !== undefined ? { title: dto.title } : {}),
      ...(dto.description !== undefined ? { description: dto.description } : {}),
      ...(dto.status !== undefined ? { status: dto.status } : {}),
    };

    const updatedTask = await this.prismaService.task.update({
      where: { id: taskId },
      data,
    });

    if (dto.status !== undefined && existingTask.status !== dto.status) {
      this.tasksGateway.emitTaskStatusUpdated({
        id: updatedTask.id,
        status: updatedTask.status,
        timestamp: new Date().toISOString(),
      });
    }

    return updatedTask;
  }

  async remove(taskId: string) {
    const task = await this.ensureTaskExists(taskId);

    await this.prismaService.task.delete({
      where: { id: taskId },
    });

    this.tasksGateway.emitTaskDeleted({
      id: task.id,
      timestamp: new Date().toISOString(),
    });

    return {
      success: true,
    };
  }

  private async ensureTaskExists(taskId: string) {
    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
      select: {
        id: true,
        status: true,
      },
    });

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }
}
