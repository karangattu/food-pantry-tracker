import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { ExpiryBadge } from "@/components/expiry-badge";

vi.mock("@/lib/expiry-utils", () => ({
  getExpiryStatus: vi.fn((date: string | null) => {
    if (!date) return "none";
    if (date === "2020-01-01") return "expired";
    if (date === "2099-01-01") return "ok";
    return "warning";
  }),
  getExpiryColor: vi.fn((status: string) => {
    const colors: Record<string, string> = {
      expired: "bg-red-100 text-red-800 border-red-200",
      ok: "bg-green-100 text-green-800 border-green-200",
      warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
      none: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return colors[status] || "";
  }),
  getExpiryLabel: vi.fn((date: string | null) => {
    if (!date) return "No expiry date";
    if (date === "2020-01-01") return "Expired 5 days ago";
    if (date === "2099-01-01") return "Expires in 100 days";
    return "Expires in 3 days";
  }),
}));

describe("ExpiryBadge", () => {
  it("renders label for null date", () => {
    render(<ExpiryBadge expirationDate={null} />);
    expect(screen.getByText("No expiry date")).toBeInTheDocument();
  });

  it("renders expired label", () => {
    render(<ExpiryBadge expirationDate="2020-01-01" />);
    expect(screen.getByText("Expired 5 days ago")).toBeInTheDocument();
  });

  it("renders ok label", () => {
    render(<ExpiryBadge expirationDate="2099-01-01" />);
    expect(screen.getByText("Expires in 100 days")).toBeInTheDocument();
  });

  it("applies correct color classes for expired", () => {
    const { container } = render(<ExpiryBadge expirationDate="2020-01-01" />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("red");
  });

  it("applies correct color classes for ok", () => {
    const { container } = render(<ExpiryBadge expirationDate="2099-01-01" />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("green");
  });

  it("applies gray styling for no date", () => {
    const { container } = render(<ExpiryBadge expirationDate={null} />);
    const badge = container.querySelector("span");
    expect(badge?.className).toContain("gray");
  });
});
