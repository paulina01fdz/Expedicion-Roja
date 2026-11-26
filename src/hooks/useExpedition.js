import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'expedicion-roja:progreso:v1';
export const TOTAL_STOPS = 6;

function readProgress() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useExpedition() {
  const [completed, setCompleted] = useState(readProgress);

  useEffect(() => {
    const sync = (event) => {
      if (event.key === STORAGE_KEY) setCompleted(readProgress());
    };
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  const complete = useCallback((id) => {
    setCompleted((previous) => {
      if (previous.includes(id)) return previous;
      const next = [...previous, id];
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // Modo privado: el progreso se mantiene solo durante la sesión.
      }
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Sin almacenamiento disponible.
    }
    setCompleted([]);
  }, []);

  return {
    completed,
    complete,
    reset,
    isComplete: (id) => completed.includes(id),
    progress: Math.round((completed.length / TOTAL_STOPS) * 100),
  };
}