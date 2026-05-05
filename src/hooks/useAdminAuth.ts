import { useEffect, useState } from "react";

const KEY = "hertech_admin_session";

let listeners: Array<() => void> = [];
const notify = () => listeners.forEach((l) => l());

export const adminAuth = {
  isLoggedIn: () => typeof window !== "undefined" && localStorage.getItem(KEY) === "1",
  login: (email: string, password: string) => {
    if (!email || password.length < 4) return false;
    localStorage.setItem(KEY, "1");
    notify();
    return true;
  },
  logout: () => { localStorage.removeItem(KEY); notify(); },
};

export function useAdminAuth() {
  const [authed, setAuthed] = useState<boolean>(adminAuth.isLoggedIn());
  useEffect(() => {
    const fn = () => setAuthed(adminAuth.isLoggedIn());
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  }, []);
  return authed;
}
