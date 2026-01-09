import { useCallback, useEffect, useState } from "react";
import { listTodos } from "../api/todosApi";

// PUBLIC_INTERFACE
export function useTodos() {
  /** Loads todos from the API and provides loading/error/reload states. */
  const [todos, setTodos] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const reload = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await listTodos();
      setTodos(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(err?.message || "Failed to load todos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return {
    todos,
    setTodos,
    isLoading,
    errorMessage,
    reload
  };
}
