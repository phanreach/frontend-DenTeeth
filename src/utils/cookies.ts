import Cookies from "js-cookie";

export const COOKIE_PREFIX = import.meta.env.VITE_APP_NAME || "denteeth";

export const COOKIE_KEYS = {
  token: "token",
  expiration: "expiration",
  role: "role",
  roles: "roles",
  username: "username",
  email: "email",
  permissions: "permissions",
} as const;

export type CookieKey = (typeof COOKIE_KEYS)[keyof typeof COOKIE_KEYS];

const getCookieKey = (key: CookieKey) => `${COOKIE_PREFIX}_${key}`;

export const setCookie = (key: CookieKey, value: string) => {
  Cookies.set(getCookieKey(key), value, {
    secure: true,
    sameSite: "Strict",
  });
};

export const getCookie = (key: CookieKey) => {
  return Cookies.get(getCookieKey(key));
};

export const removeCookie = (key: CookieKey) => {
  Cookies.remove(getCookieKey(key));
};

export const clearAuthCookies = () => {
  Object.values(COOKIE_KEYS).forEach(removeCookie);
};
