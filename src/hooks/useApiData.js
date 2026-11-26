import { useCallback, useEffect, useRef, useState } from 'react';

const cache = new Map();

export function useApiData(key, loader, { enabled = true } = {}) {
  const loaderRef = useRef(loader);
  loaderRef.current = loader;
  const [nonce, setNonce] = useState(0);

  const [state, setState] = useState(() => ({
    data: cache.get(key) ?? null,
    loading: enabled && !cache.has(key),
    error: null,
  }));

  useEffect(() => {
    if (!enabled) return undefined;

    const controller = new AbortController();
    const cached = cache.get(key);
    // No reutilizar datos de otra clave (por ejemplo, al pasar de Marte a exoplanetas).
    setState({ data: cached ?? null, loading: !cached, error: null });

    loaderRef
      .current(controller.signal)
      .then((data) => {
        cache.set(key, data);
        setState({ data, loading: false, error: null });
      })
      .catch((error) => {
        if (controller.signal.aborted) return;
        setState({ data: cache.get(key) ?? null, loading: false, error });
      });

    return () => controller.abort();
  }, [key, enabled, nonce]);

  const refetch = useCallback(() => setNonce((value) => value + 1), []);

  return { ...state, refetch };
}
