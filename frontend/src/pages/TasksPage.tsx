import { useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { TasksPage as TasksBoard } from '../features/tasks/TasksPage';

export function TasksPage() {
  const navigate = useNavigate();
  const {
    tasks,
    email,
    users,
    createTask,
    updateTaskStatus,
    deleteTask,
    logout,
    pendingTaskId,
    tasksPending,
  } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/auth/sign-in');
  };

  return (
    <TasksBoard
      tasks={tasks}
      email={email}
      users={users}
      onCreateTask={createTask}
      onUpdateStatus={updateTaskStatus}
      onDeleteTask={deleteTask}
      onLogout={handleLogout}
      pendingTaskId={pendingTaskId}
      globalPending={tasksPending}
    />
  );
}
