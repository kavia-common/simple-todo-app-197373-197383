import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders todos title", () => {
  render(<App />);
  const title = screen.getByRole("heading", { name: /todos/i });
  expect(title).toBeInTheDocument();
});
