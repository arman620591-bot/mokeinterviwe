"use client";

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "mockmate_current_user";

export function readCurrentUser() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
}

export function writeCurrentUser(user) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearCurrentUser() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
}

export function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  const refreshUser = useCallback(() => {
    setUser(readCurrentUser());
  }, []);

  useEffect(() => {
    refreshUser();
    setIsReady(true);
  }, [refreshUser]);

  return {
    user,
    isReady,
    refreshUser,
    setUser,
  };
}
