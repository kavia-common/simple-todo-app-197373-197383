/**
 * API client for Todo backend.
 * Uses fetch with JSON and consistent error parsing.
 */

const DEFAULT_BASE_URL = "http://localhost:3001";

function getApiBaseUrl() {
  // CRA exposes env vars at build time. Keep a safe fallback for local dev.
  return (process.env.REACT_APP_API_BASE_URL || DEFAULT_BASE_URL).replace(/\/$/, "");
}

async function parseErrorResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    try {
      const body = await response.json();
      if (body && typeof body === "object") {
        return body.detail || body.message || JSON.stringify(body);
      }
      return "Request failed.";
    } catch {
      return "Request failed.";
    }
  }
  try {
    return await response.text();
  } catch {
    return "Request failed.";
  }
}

async function request(path, options = {}) {
  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    headers: {
      "content-type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const msg = await parseErrorResponse(response);
    const error = new Error(msg || `HTTP ${response.status}`);
    error.status = response.status;
    throw error;
  }

  // 204 No Content
  if (response.status === 204) return null;

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}

// PUBLIC_INTERFACE
export async function listTodos() {
  /** Fetch all todos. Returns array of todos. */
  return request("/todos", { method: "GET" });
}

// PUBLIC_INTERFACE
export async function createTodo({ title }) {
  /** Create a new todo. Expects {title}. Returns created todo. */
  return request("/todos", {
    method: "POST",
    body: JSON.stringify({ title })
  });
}

// PUBLIC_INTERFACE
export async function updateTodo(id, { title }) {
  /** Update todo title. Returns updated todo. */
  return request(`/todos/${encodeURIComponent(id)}`, {
    method: "PUT",
    body: JSON.stringify({ title })
  });
}

// PUBLIC_INTERFACE
export async function toggleTodo(id, completed) {
  /** Toggle completion status. Returns updated todo. */
  return request(`/todos/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ completed })
  });
}

// PUBLIC_INTERFACE
export async function deleteTodo(id) {
  /** Delete a todo. Returns null or backend response. */
  return request(`/todos/${encodeURIComponent(id)}`, { method: "DELETE" });
}

// PUBLIC_INTERFACE
export function getConfiguredApiBaseUrl() {
  /** Returns the resolved base URL currently used by the API client. */
  return getApiBaseUrl();
}
