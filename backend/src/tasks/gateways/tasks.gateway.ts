import {
  OnGatewayInit,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Logger, OnModuleDestroy } from '@nestjs/common';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';

import { TaskCreatedEvent } from '../interfaces/task-created-event.interface';
import { TaskDeletedEvent } from '../interfaces/task-deleted-event.interface';
import { TaskStatusUpdatedEvent } from '../interfaces/task-status-updated-event.interface';

@WebSocketGateway()
export class TasksGateway implements OnGatewayInit, OnModuleDestroy {
  private readonly logger = new Logger(TasksGateway.name);
  private readonly server: WebSocketServer;

  constructor() {
    this.server = new WebSocketServer({
      port: 3001,
      path: '/ws',
    });

    this.server.on('listening', () => {
      this.logger.log('WebSocket server listening on ws://localhost:3001/ws');
    });
  }

  afterInit() {
    return;
  }

  onModuleDestroy() {
    this.server.close();
  }

  emitTaskStatusUpdated(event: TaskStatusUpdatedEvent) {
    this.broadcast('task.status.updated', event);
  }

  emitTaskCreated(event: TaskCreatedEvent) {
    this.broadcast('task.created', event);
  }

  emitTaskDeleted(event: TaskDeletedEvent) {
    this.broadcast('task.deleted', event);
  }

  private broadcast(eventName: string, payload: unknown) {
    const message = JSON.stringify({
      event: eventName,
      data: payload,
    });

    this.server.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }
}
