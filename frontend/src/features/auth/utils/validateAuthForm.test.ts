import { describe, expect, it } from 'vitest';

import { validateAuthForm } from './validateAuthForm';

describe('validateAuthForm', () => {
  it('returns no errors for a valid sign-in payload', () => {
    expect(
      validateAuthForm({
        mode: 'signin',
        email: 'user@example.com',
        password: 'secret1',
        confirmPassword: '',
        termsAccepted: false,
      }),
    ).toEqual({});
  });

  it('validates email and password for sign-in', () => {
    expect(
      validateAuthForm({
        mode: 'signin',
        email: 'wrong-email',
        password: '123',
        confirmPassword: '',
        termsAccepted: false,
      }),
    ).toEqual({
      email: 'Введите корректный email',
      password: 'Пароль должен содержать минимум 6 символов',
    });
  });

  it('requires confirmation and accepted terms for sign-up', () => {
    expect(
      validateAuthForm({
        mode: 'signup',
        email: 'user@example.com',
        password: 'secret1',
        confirmPassword: 'secret2',
        termsAccepted: false,
      }),
    ).toEqual({
      confirmPassword: 'Пароли не совпадают',
      termsAccepted:
        'Нужно принять условия использования и политику конфиденциальности',
    });
  });
});
