import type { NavigateFunction } from "react-router-dom";
import { COOKIE_KEYS, setCookie } from "./cookies";

export const PENDING_SIGNUP_CREDENTIALS_KEY =
  "denteeth_pending_signup_credentials";

export type PendingSignupCredentials = {
  username: string;
  password: string;
  email: string;
};

export type AuthSession = {
  token: string;
  username: string;
  expiration?: string | null;
  email: string;
  roles: string[];
  permissions: string[];
};

export function savePendingSignupCredentials(
  credentials: PendingSignupCredentials,
) {
  sessionStorage.setItem(
    PENDING_SIGNUP_CREDENTIALS_KEY,
    JSON.stringify(credentials),
  );
}

export function getPendingSignupCredentials() {
  const rawCredentials = sessionStorage.getItem(PENDING_SIGNUP_CREDENTIALS_KEY);

  if (!rawCredentials) {
    return null;
  }

  try {
    const credentials = JSON.parse(rawCredentials) as PendingSignupCredentials;

    if (credentials.username && credentials.password && credentials.email) {
      return credentials;
    }
  } catch {
    sessionStorage.removeItem(PENDING_SIGNUP_CREDENTIALS_KEY);
  }

  return null;
}

export function clearPendingSignupCredentials() {
  sessionStorage.removeItem(PENDING_SIGNUP_CREDENTIALS_KEY);
}

export function saveAuthSession(session: AuthSession) {
  setCookie(COOKIE_KEYS.token, session.token);
  setCookie(COOKIE_KEYS.username, session.username);
  setCookie(COOKIE_KEYS.roles, session.roles.join(","));
  setCookie(COOKIE_KEYS.email, session.email);
  setCookie(COOKIE_KEYS.permissions, session.permissions.join(","));

  if (session.expiration) {
    setCookie(COOKIE_KEYS.expiration, session.expiration);
  }
}

export function getHomePathForRoles(roles: string[]) {
  if (roles.includes("ADMIN")) {
    return "/admin/dashboard";
  }

  if (roles.includes("DENTIST")) {
    return "/dentist/dashboard";
  }

  return "/home";
}

export function navigateToHomeForRoles(
  navigate: NavigateFunction,
  roles: string[],
) {
  navigate(getHomePathForRoles(roles));
}
