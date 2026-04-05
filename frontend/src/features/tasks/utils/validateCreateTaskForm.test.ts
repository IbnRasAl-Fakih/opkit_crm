import { describe, expect, it } from 'vitest';

import { validateCreateTaskForm } from './validateCreateTaskForm';

describe('validateCreateTaskForm', () => {
  it('returns no errors for a valid payload', () => {
    expect(
      validateCreateTaskForm({
        title: 'Новая задача',
        assigneeId: '3df885fe-17be-4a97-8474-71bd60a9b7f4',
      }),
    ).toEqual({});
  });

  it('requires title and assignee', () => {
    expect(
      validateCreateTaskForm({
        title: '   ',
        assigneeId: '',
      }),
    ).toEqual({
      title: 'Введите название задачи',
      assigneeId: 'Выберите исполнителя',
    });
  });
});
