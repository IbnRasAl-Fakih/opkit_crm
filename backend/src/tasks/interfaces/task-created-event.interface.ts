import { TaskStatus } from '@prisma/client';

export interface TaskCreatedEvent {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  userId: string | null;
  createdAt: string;
  updatedAt: string;
}
