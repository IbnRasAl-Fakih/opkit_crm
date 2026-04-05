import { Task, TaskStatus } from './task';

export interface TaskStatusUpdatedEvent {
  id: string;
  status: TaskStatus;
  timestamp: string;
}

export type TaskCreatedEvent = Task;

export interface TaskDeletedEvent {
  id: string;
  timestamp: string;
}
