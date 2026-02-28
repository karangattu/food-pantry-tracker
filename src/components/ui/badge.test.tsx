import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "@/components/ui/badge";

describe("Badge", () => {
  it("renders children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("applies default variant", () => {
    render(<Badge data-testid="badge">Default</Badge>);
    expect(screen.getByTestId("badge").className).toContain("green");
  });

  it("applies success variant", () => {
    render(<Badge variant="success" data-testid="badge">Success</Badge>);
    expect(screen.getByTestId("badge").className).toContain("green");
  });

  it("applies warning variant", () => {
    render(<Badge variant="warning" data-testid="badge">Warning</Badge>);
    expect(screen.getByTestId("badge").className).toContain("yellow");
  });

  it("applies destructive variant", () => {
    render(<Badge variant="destructive" data-testid="badge">Error</Badge>);
    expect(screen.getByTestId("badge").className).toContain("red");
  });

  it("applies secondary variant", () => {
    render(<Badge variant="secondary" data-testid="badge">Info</Badge>);
    expect(screen.getByTestId("badge").className).toContain("gray");
  });

  it("has rounded-full styling", () => {
    render(<Badge data-testid="badge">Pill</Badge>);
    expect(screen.getByTestId("badge").className).toContain("rounded-full");
  });

  it("merges custom className", () => {
    render(<Badge className="extra" data-testid="badge">Custom</Badge>);
    expect(screen.getByTestId("badge").className).toContain("extra");
  });
});
