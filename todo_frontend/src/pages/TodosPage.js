import React, { useMemo, useState } from "react";
import { createTodo, deleteTodo, toggleTodo, updateTodo } from "../api/todosApi";
import { AppHeader } from "../components/AppHeader";
import { TodoComposer } from "../components/TodoComposer";
import { TodoItem } from "../components/TodoItem";
import { useTodos } from "../hooks/useTodos";

// PUBLIC_INTERFACE
export function TodosPage() {
  /** Main page for managing todos (CRUD + completion toggle). */
  const { todos, setTodos, isLoading, errorMessage, reload } = useTodos();
  const [isMutating, setIsMutating] = useState(false);
  const [topError, setTopError] = useState("");

  const counts = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter((t) => Boolean(t.completed)).length;
    return { total, completed, active: total - completed };
  }, [todos]);

  const runMutation = async (fn) => {
    setTopError("");
    setIsMutating(true);
    try {
      await fn();
      return true;
    } catch (err) {
      setTopError(err?.message || "Something went wrong.");
      return false;
    } finally {
      setIsMutating(false);
    }
  };

  const handleCreate = async ({ title }) => {
    return runMutation(async () => {
      const created = await createTodo({ title });
      // Optimistic insert at top; if backend returns full object, prefer it.
      setTodos((prev) => [created, ...prev]);
    });
  };

  const handleToggle = async (todo) => {
    return runMutation(async () => {
      const updated = await toggleTodo(todo.id);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    });
  };

  const handleRename = async (todo, title) => {
    return runMutation(async () => {
      // Backend's PUT requires both fields.
      const updated = await updateTodo(todo.id, { title, completed: Boolean(todo.completed) });
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    });
  };

  const handleDelete = async (todo) => {
    return runMutation(async () => {
      await deleteTodo(todo.id);
      setTodos((prev) => prev.filter((t) => t.id !== todo.id));
    });
  };

  const showEmpty = !isLoading && !errorMessage && todos.length === 0;

  return (
    <div className="appShell">
      <div className="container">
        <AppHeader
          title="Todos"
          subtitle="A clean, responsive todo list with full CRUD and completion tracking."
        />

        <main className="mainCard" aria-busy={isLoading || isMutating}>
          <div className="toolbar">
            <TodoComposer onCreate={handleCreate} isBusy={isMutating} />

            <div className="stats" aria-label="Todo statistics">
              <span className="pill">Total: {counts.total}</span>
              <span className="pill pillSuccess">Active: {counts.active}</span>
              <span className="pill pillMuted">Done: {counts.completed}</span>
              <button
                type="button"
                className="btn btnGhost"
                onClick={reload}
                disabled={isLoading || isMutating}
              >
                Refresh
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="state stateError" role="alert">
              <h2 className="stateTitle">Couldn’t load todos</h2>
              <p className="stateText">{errorMessage}</p>
              <button className="btn btnPrimary" type="button" onClick={reload}>
                Try again
              </button>
            </div>
          ) : null}

          {topError ? (
            <div className="bannerError" role="alert">
              {topError}
            </div>
          ) : null}

          {isLoading ? (
            <div className="state">
              <div className="spinner" aria-hidden="true" />
              <p className="stateText">Loading todos…</p>
            </div>
          ) : null}

          {showEmpty ? (
            <div className="state">
              <h2 className="stateTitle">No todos yet</h2>
              <p className="stateText">Add your first task above to get started.</p>
            </div>
          ) : null}

          {!isLoading && !errorMessage && todos.length > 0 ? (
            <ul className="todoList" aria-label="Todo list">
              {todos.map((t) => (
                <TodoItem
                  key={t.id}
                  todo={t}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onRename={handleRename}
                  disableActions={isMutating}
                />
              ))}
            </ul>
          ) : null}
        </main>

        <footer className="footer">
          <p className="footerText">
            Tip: Press <kbd>Enter</kbd> to save edits, <kbd>Esc</kbd> to cancel.
          </p>
        </footer>
      </div>
    </div>
  );
}
