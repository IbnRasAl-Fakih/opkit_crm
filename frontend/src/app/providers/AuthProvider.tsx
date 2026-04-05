import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { apiRequest, ApiError } from '../../api/client';
import { useToast } from '../../hooks/useToast';
import { getSocketClient } from '../../socket/client';
import { LoginResponse, RegisterResponse } from '../../types/auth';
import {
  TaskCreatedEvent,
  TaskDeletedEvent,
  TaskStatusUpdatedEvent,
} from '../../types/socket';
import { Task, TaskStatus } from '../../types/task';
import { UserOption } from '../../types/user';

type AuthSubmitPayload = {
  mode: 'signin' | 'signup';
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type CreateTaskPayload = {
  title: string;
  description: string;
  assigneeId: string;
};

type AuthContextValue = {
  token: string | null;
  email: string;
  tasks: Task[];
  users: UserOption[];
  authPending: boolean;
  tasksPending: boolean;
  pendingTaskId: string | null;
  error: string | null;
  isAuthenticated: boolean;
  submitAuth: (payload: AuthSubmitPayload) => Promise<void>;
  createTask: (payload: CreateTaskPayload) => Promise<void>;
  updateTaskStatus: (taskId: string, status: TaskStatus) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

const STORAGE_KEY = 'opkit_crm_access_token';
const EMAIL_KEY = 'opkit_crm_email';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { showToast } = useToast();
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [email, setEmail] = useState<string>(() => localStorage.getItem(EMAIL_KEY) || '');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<UserOption[]>([]);
  const [authPending, setAuthPending] = useState(false);
  const [tasksPending, setTasksPending] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    setToken(null);
    setEmail('');
    setTasks([]);
    setUsers([]);
    setError(null);
  }, []);

  const handleApiError = useCallback(
    (err: unknown) => {
      if (err instanceof ApiError && err.status === 401) {
        logout();
        const message = 'Сессия истекла. Войдите снова.';
        setError(message);
        showToast(message, 'error');
        return;
      }

      if (err instanceof Error) {
        setError(err.message);
        showToast(err.message, 'error');
        return;
      }

      const message = 'Произошла ошибка';
      setError(message);
      showToast(message, 'error');
    },
    [logout, showToast],
  );

  const loadTasks = useCallback(
    async (activeToken: string) => {
      try {
        setTasksPending(true);
        setError(null);
        const nextTasks = await apiRequest<Task[]>('/tasks', {
          token: activeToken,
        });
        setTasks(nextTasks);
      } catch (err) {
        handleApiError(err);
      } finally {
        setTasksPending(false);
      }
    },
    [handleApiError],
  );

  const loadUsers = useCallback(
    async (activeToken: string) => {
      try {
        const nextUsers = await apiRequest<UserOption[]>('/users', {
          token: activeToken,
        });
        setUsers(nextUsers);
      } catch (err) {
        handleApiError(err);
      }
    },
    [handleApiError],
  );

  useEffect(() => {
    if (!token) {
      setTasks([]);
      setUsers([]);
      return;
    }

    void loadTasks(token);
    void loadUsers(token);
  }, [token, loadTasks, loadUsers]);

  useEffect(() => {
    const socket = getSocketClient();

    const handleTaskCreated = (event: TaskCreatedEvent) => {
      setTasks((current) => {
        const exists = current.some((task) => task.id === event.id);

        if (exists) {
          return current.map((task) => (task.id === event.id ? event : task));
        }

        return [event, ...current];
      });
    };

    const handleStatusUpdated = (event: TaskStatusUpdatedEvent) => {
      setTasks((current) =>
        current.map((task) =>
          task.id === event.id
            ? {
                ...task,
                status: event.status,
                updatedAt: event.timestamp,
              }
            : task,
        ),
      );
    };

    const handleTaskDeleted = (event: TaskDeletedEvent) => {
      setTasks((current) => current.filter((task) => task.id !== event.id));
    };

    const handleMessage = (message: MessageEvent<string>) => {
      try {
        const payload = JSON.parse(message.data) as {
          event?: string;
          data?: TaskCreatedEvent | TaskStatusUpdatedEvent | TaskDeletedEvent;
        };

        if (!payload.data) {
          return;
        }

        if (payload.event === 'task.created') {
          handleTaskCreated(payload.data as TaskCreatedEvent);
          return;
        }

        if (payload.event === 'task.status.updated') {
          handleStatusUpdated(payload.data as TaskStatusUpdatedEvent);
          return;
        }

        if (payload.event === 'task.deleted') {
          handleTaskDeleted(payload.data as TaskDeletedEvent);
        }
      } catch {
        return;
      }
    };

    socket.addEventListener('message', handleMessage);

    return () => {
      socket.removeEventListener('message', handleMessage);
    };
  }, []);

  const submitAuth = useCallback(
    async (payload: AuthSubmitPayload) => {
      try {
        setAuthPending(true);
        setError(null);

        if (payload.mode === 'signup') {
          if (payload.password !== payload.confirmPassword) {
            throw new Error('Пароли не совпадают');
          }

          await apiRequest<RegisterResponse>('/auth/register', {
            method: 'POST',
            body: {
              email: payload.email.trim(),
              password: payload.password,
            },
          });

          showToast('Аккаунт успешно создан', 'success');
        }

        const loginResponse = await apiRequest<LoginResponse>('/auth/login', {
          method: 'POST',
          body: {
            email: payload.email.trim(),
            password: payload.password,
          },
        });

        localStorage.setItem(STORAGE_KEY, loginResponse.accessToken);
        localStorage.setItem(EMAIL_KEY, payload.email.trim());

        setToken(loginResponse.accessToken);
        setEmail(payload.email.trim());
        showToast('Вход выполнен успешно', 'success');
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
          showToast(err.message, 'error');
        } else {
          const message = 'Не удалось выполнить запрос';
          setError(message);
          showToast(message, 'error');
        }

        throw err;
      } finally {
        setAuthPending(false);
      }
    },
    [showToast],
  );

  const createTask = useCallback(
    async (payload: CreateTaskPayload) => {
      if (!token) {
        return;
      }

      try {
        setTasksPending(true);
        setError(null);
        const createdTask = await apiRequest<Task>('/tasks', {
          method: 'POST',
          token,
          body: {
            title: payload.title,
            description: payload.description || undefined,
            assigneeId: payload.assigneeId,
          },
        });

        setTasks((current) => {
          const withoutCurrent = current.filter((task) => task.id !== createdTask.id);
          return [createdTask, ...withoutCurrent];
        });
        showToast('Задача создана', 'success');
      } catch (err) {
        handleApiError(err);
      } finally {
        setTasksPending(false);
      }
    },
    [handleApiError, showToast, token],
  );

  const updateTaskStatus = useCallback(
    async (taskId: string, status: TaskStatus) => {
      if (!token) {
        return;
      }

      try {
        setPendingTaskId(taskId);
        setError(null);
        const updatedTask = await apiRequest<Task>(`/tasks/${taskId}`, {
          method: 'PATCH',
          token,
          body: { status },
        });

        setTasks((current) =>
          current.map((task) => (task.id === taskId ? updatedTask : task)),
        );
        showToast('Статус задачи обновлен', 'success');
      } catch (err) {
        handleApiError(err);
      } finally {
        setPendingTaskId(null);
      }
    },
    [handleApiError, showToast, token],
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!token) {
        return;
      }

      try {
        setPendingTaskId(taskId);
        setError(null);
        await apiRequest<{ success: boolean }>(`/tasks/${taskId}`, {
          method: 'DELETE',
          token,
        });

        setTasks((current) => current.filter((task) => task.id !== taskId));
        showToast('Задача удалена', 'success');
      } catch (err) {
        handleApiError(err);
      } finally {
        setPendingTaskId(null);
      }
    },
    [handleApiError, showToast, token],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      email,
      tasks,
      users,
      authPending,
      tasksPending,
      pendingTaskId,
      error,
      isAuthenticated: Boolean(token),
      submitAuth,
      createTask,
      updateTaskStatus,
      deleteTask,
      logout,
      clearError: () => setError(null),
    }),
    [
      authPending,
      createTask,
      deleteTask,
      email,
      error,
      logout,
      pendingTaskId,
      submitAuth,
      tasks,
      tasksPending,
      token,
      updateTaskStatus,
      users,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider');
  }

  return context;
}
