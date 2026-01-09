import React from "react";
import "./App.css";
import { TodosPage } from "./pages/TodosPage";

// PUBLIC_INTERFACE
function App() {
  /** Application root component. */
  return (
    <div className="App">
      <TodosPage />
    </div>
  );
}

export default App;
