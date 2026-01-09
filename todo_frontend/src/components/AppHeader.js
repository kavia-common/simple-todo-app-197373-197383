import React from "react";
import { getConfiguredApiBaseUrl } from "../api/todosApi";

// PUBLIC_INTERFACE
export function AppHeader({ title, subtitle }) {
  /** Header for the app with title and optional subtitle and API base URL note. */
  const apiBase = getConfiguredApiBaseUrl();

  return (
    <header className="appHeader">
      <div className="appHeader__left">
        <h1 className="appTitle">{title}</h1>
        {subtitle ? <p className="appSubtitle">{subtitle}</p> : null}
      </div>
      <div className="appHeader__right" aria-label="API base URL">
        <span className="pill">API: {apiBase}</span>
      </div>
    </header>
  );
}
