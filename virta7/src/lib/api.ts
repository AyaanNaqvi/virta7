const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4001/api';
export const API_ORIGIN = API_BASE.replace(/\/api\/?$/, '');

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

export async function apiFetch<T>(
  path: string,
  options: { method?: string; body?: unknown; token?: string | null } = {}
): Promise<T> {
  const { method = 'GET', body, token } = options;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json() : null;

  if (!res.ok) {
    throw new ApiError(res.status, data?.error || `Request failed (${res.status})`);
  }
  return data as T;
}

// Uses XMLHttpRequest (not fetch) specifically because fetch has no
// cross-browser way to report upload progress; onProgress is how the caller
// drives a progress bar for large file uploads.
export function apiUpload<T>(
  path: string,
  {
    formData,
    token,
    onProgress,
  }: { formData: FormData; token?: string | null; onProgress?: (percent: number) => void }
): Promise<T> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_BASE}${path}`);
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`);

    xhr.upload.onprogress = (e) => {
      if (onProgress && e.lengthComputable) {
        onProgress(Math.round((e.loaded / e.total) * 100));
      }
    };

    xhr.onload = () => {
      const isJson = xhr.getResponseHeader('content-type')?.includes('application/json');
      let data: unknown = null;
      try {
        data = isJson ? JSON.parse(xhr.responseText) : null;
      } catch {
        data = null;
      }
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(data as T);
      } else {
        const message = (data as { error?: string } | null)?.error || `Request failed (${xhr.status})`;
        reject(new ApiError(xhr.status, message));
      }
    };

    xhr.onerror = () => reject(new ApiError(0, 'Network error during upload'));
    xhr.ontimeout = () => reject(new ApiError(0, 'Upload timed out'));

    xhr.send(formData);
  });
}
