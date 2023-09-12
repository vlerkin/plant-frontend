const TOKEN_ITEM = "token";

export const getToken = (): string | undefined => {
  const tokenFromLC = localStorage.getItem(TOKEN_ITEM);
  return tokenFromLC ? tokenFromLC : undefined;
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_ITEM, token);
};

export const deleteToken = (): void => {
  localStorage.removeItem(TOKEN_ITEM);
};
