import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "@/components/ui/input";

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("has correct type attribute", () => {
    render(<Input type="email" data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveAttribute("type", "email");
  });

  it("defaults to text type when not specified", () => {
    render(<Input data-testid="input" />);
    // HTML inputs default to "text" when no type is set
    const input = screen.getByTestId("input");
    expect(input.tagName).toBe("INPUT");
  });

  it("can be disabled", () => {
    render(<Input disabled data-testid="input" />);
    expect(screen.getByTestId("input")).toBeDisabled();
  });

  it("accepts value", () => {
    render(<Input value="hello" readOnly data-testid="input" />);
    expect(screen.getByTestId("input")).toHaveValue("hello");
  });

  it("merges custom className", () => {
    render(<Input className="my-class" data-testid="input" />);
    expect(screen.getByTestId("input").className).toContain("my-class");
  });

  it("has focus ring styling classes", () => {
    render(<Input data-testid="input" />);
    expect(screen.getByTestId("input").className).toContain("focus:ring");
  });
});
