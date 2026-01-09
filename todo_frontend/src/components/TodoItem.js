import React, { useMemo, useState } from "react";

// PUBLIC_INTERFACE
export function TodoItem({
  todo,
  onToggle,
  onDelete,
  onRename,
  disableActions
}) {
  /** Renders a todo row with inline edit and actions. */
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(todo.title || "");
  const [rowError, setRowError] = useState("");

  const trimmed = useMemo(() => draftTitle.trim(), [draftTitle]);
  const canSave = trimmed.length > 0 && !disableActions;

  const startEdit = () => {
    setRowError("");
    setDraftTitle(todo.title || "");
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setRowError("");
    setDraftTitle(todo.title || "");
    setIsEditing(false);
  };

  const saveEdit = async () => {
    if (!canSave) return;
    setRowError("");
    try {
      const ok = await onRename(todo, trimmed);
      if (ok) setIsEditing(false);
    } catch (e) {
      setRowError(e?.message || "Failed to update todo.");
    }
  };

  const onKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      await saveEdit();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
    }
  };

  return (
    <li className={`todoRow ${todo.completed ? "todoRow--done" : ""}`}>
      <div className="todoRow__left">
        <input
          className="checkbox"
          type="checkbox"
          checked={Boolean(todo.completed)}
          onChange={() => onToggle(todo)}
          disabled={disableActions}
          aria-label={`Mark "${todo.title}" as ${todo.completed ? "incomplete" : "complete"}`}
        />
        {!isEditing ? (
          <div className="todoText">
            <span className="todoTitle">{todo.title}</span>
            <span className="todoMeta">
              {todo.completed ? "Completed" : "Active"}
            </span>
          </div>
        ) : (
          <div className="todoEdit">
            <label className="srOnly" htmlFor={`edit-${todo.id}`}>
              Edit todo title
            </label>
            <input
              id={`edit-${todo.id}`}
              className="input inputSmall"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={onKeyDown}
              disabled={disableActions}
              autoFocus
              maxLength={200}
            />
            {rowError ? <div className="inlineError">{rowError}</div> : null}
          </div>
        )}
      </div>

      <div className="todoRow__right">
        {!isEditing ? (
          <>
            <button
              type="button"
              className="btn btnGhost"
              onClick={startEdit}
              disabled={disableActions}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btnDanger"
              onClick={() => onDelete(todo)}
              disabled={disableActions}
            >
              Delete
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="btn btnPrimary"
              onClick={saveEdit}
              disabled={!canSave}
            >
              Save
            </button>
            <button
              type="button"
              className="btn btnGhost"
              onClick={cancelEdit}
              disabled={disableActions}
            >
              Cancel
            </button>
          </>
        )}
      </div>
    </li>
  );
}
