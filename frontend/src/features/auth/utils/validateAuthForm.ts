import { AuthMode } from '../../../types/auth';

export type AuthFormErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
};

type ValidateAuthFormInput = {
  mode: AuthMode;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAuthForm({
  mode,
  email,
  password,
  confirmPassword,
  termsAccepted,
}: ValidateAuthFormInput): AuthFormErrors {
  const errors: AuthFormErrors = {};
  const trimmedEmail = email.trim();
  const isSignIn = mode === 'signin';

  if (!trimmedEmail) {
    errors.email = 'Введите email';
  } else if (!emailPattern.test(trimmedEmail)) {
    errors.email = 'Введите корректный email';
  }

  if (!password) {
    errors.password = 'Введите пароль';
  } else if (password.length < 6) {
    errors.password = 'Пароль должен содержать минимум 6 символов';
  }

  if (!isSignIn) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (confirmPassword.length < 6) {
      errors.confirmPassword =
        'Подтверждение должно содержать минимум 6 символов';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    if (!termsAccepted) {
      errors.termsAccepted =
        'Нужно принять условия использования и политику конфиденциальности';
    }
  }

  return errors;
}
