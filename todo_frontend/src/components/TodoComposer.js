import React, { useMemo, useState } from "react";

// PUBLIC_INTERFACE
export function TodoComposer({ onCreate, isBusy }) {
  /** Controlled input to create a todo. Calls onCreate({title}). */
  const [title, setTitle] = useState("");

  const trimmed = useMemo(() => title.trim(), [title]);
  const canSubmit = trimmed.length > 0 && !isBusy;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    const ok = await onCreate({ title: trimmed });
    if (ok) setTitle("");
  };

  return (
    <form className="composer" onSubmit={onSubmit}>
      <label className="srOnly" htmlFor="newTodoTitle">
        New todo title
      </label>
      <input
        id="newTodoTitle"
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task…"
        maxLength={200}
        autoComplete="off"
      />
      <button className="btn btnPrimary" type="submit" disabled={!canSubmit}>
        {isBusy ? "Adding…" : "Add"}
      </button>
    </form>
  );
}
