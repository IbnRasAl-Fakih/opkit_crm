export type CreateTaskFormErrors = {
  title?: string;
  assigneeId?: string;
};

type ValidateCreateTaskFormInput = {
  title: string;
  assigneeId: string;
};

export function validateCreateTaskForm({
  title,
  assigneeId,
}: ValidateCreateTaskFormInput): CreateTaskFormErrors {
  const errors: CreateTaskFormErrors = {};

  if (!title.trim()) {
    errors.title = 'Введите название задачи';
  }

  if (!assigneeId) {
    errors.assigneeId = 'Выберите исполнителя';
  }

  return errors;
}
