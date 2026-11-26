class HttpError extends Error {
  constructor(message, { status = 0, cause } = {}) {
    super(message, cause ? { cause } : undefined);
    this.name = 'HttpError';
    this.status = status;
  }
}

export function buildUrl(base, params = {}) {
  const url = new URL(base);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, String(value));
    }
  });
  return url.toString();
}

export async function getJson(url, { signal, timeout = 15000 } = {}) {
  const controller = new AbortController();
  const relayAbort = () => controller.abort();
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', relayAbort, { once: true });
  }

  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new HttpError(`No pudimos obtener los datos (HTTP ${response.status}).`, {
        status: response.status,
      });
    }
    return await response.json();
  } catch (error) {
    if (error instanceof HttpError) throw error;
    if (timedOut) {
      throw new HttpError('La conexión tardó demasiado. Vuelve a intentarlo.', {
        status: 408,
        cause: error,
      });
    }
    if (signal?.aborted) throw error;
    throw new HttpError('No se pudo conectar con la fuente de datos.', { cause: error });
  } finally {
    clearTimeout(timer);
    if (signal) signal.removeEventListener('abort', relayAbort);
  }
}
