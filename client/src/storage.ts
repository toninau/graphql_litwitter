const storageKey = 'litwitterToken';

const saveToken = (token: string): void => localStorage.setItem(storageKey, token);

const loadToken = (): string | null => localStorage.getItem(storageKey);

const removeToken = (): void => localStorage.removeItem(storageKey);

export default {
  saveToken,
  loadToken,
  removeToken
};