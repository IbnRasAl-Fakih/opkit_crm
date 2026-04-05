import { TaskStatus } from '@prisma/client';

export interface TaskStatusUpdatedEvent {
  id: string;
  status: TaskStatus;
  timestamp: string;
}

