"use client";

import { useSyncExternalStore } from "react";

const THEME_KEY = "moviez-theme";
const THEME_EVENT = "moviez-theme-change";

function subscribe(onChange: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const syncTheme = () => {
    let preference: string | null = null;
    try { preference = localStorage.getItem(THEME_KEY); } catch { /* Use the current theme when storage is unavailable. */ }
    document.documentElement.classList.toggle("dark", preference === "dark" || (preference !== "light" && media.matches));
    onChange();
  };
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_KEY || event.key === null) syncTheme();
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  media.addEventListener("change", syncTheme);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
    media.removeEventListener("change", syncTheme);
  };
}

function getSnapshot() {
  return document.documentElement.classList.contains("dark");
}

export function useDarkMode() {
  const darkMode = useSyncExternalStore(subscribe, getSnapshot, () => false);
  const toggleTheme = () => {
    const next = !getSnapshot();
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem(THEME_KEY, next ? "dark" : "light"); } catch { /* Use the current theme when storage is unavailable. */ }
    window.dispatchEvent(new Event(THEME_EVENT));
  };
  return { darkMode, toggleTheme };
}
