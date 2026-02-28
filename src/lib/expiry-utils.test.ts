import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getDaysUntilExpiry,
  getExpiryStatus,
  getExpiryColor,
  getExpiryLabel,
  formatExpirationDate,
} from "@/lib/expiry-utils";

describe("expiry-utils", () => {
  // Use a fixed "today" for deterministic tests
  const fixedNow = new Date("2025-06-15T12:00:00Z");

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(fixedNow);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("getDaysUntilExpiry", () => {
    it("returns 0 for today", () => {
      expect(getDaysUntilExpiry("2025-06-15")).toBe(0);
    });

    it("returns positive number for future date", () => {
      expect(getDaysUntilExpiry("2025-06-20")).toBe(5);
    });

    it("returns negative number for past date", () => {
      expect(getDaysUntilExpiry("2025-06-10")).toBe(-5);
    });

    it("returns 1 for tomorrow", () => {
      expect(getDaysUntilExpiry("2025-06-16")).toBe(1);
    });

    it("returns -1 for yesterday", () => {
      expect(getDaysUntilExpiry("2025-06-14")).toBe(-1);
    });
  });

  describe("getExpiryStatus", () => {
    it('returns "none" for null date', () => {
      expect(getExpiryStatus(null)).toBe("none");
    });

    it('returns "expired" for past date', () => {
      expect(getExpiryStatus("2025-06-10")).toBe("expired");
    });

    it('returns "critical" for today (0 days)', () => {
      expect(getExpiryStatus("2025-06-15")).toBe("critical");
    });

    it('returns "critical" for 1 day out', () => {
      expect(getExpiryStatus("2025-06-16")).toBe("critical");
    });

    it('returns "critical" for 2 days out', () => {
      expect(getExpiryStatus("2025-06-17")).toBe("critical");
    });

    it('returns "warning" for 3 days out', () => {
      expect(getExpiryStatus("2025-06-18")).toBe("warning");
    });

    it('returns "warning" for 7 days out', () => {
      expect(getExpiryStatus("2025-06-22")).toBe("warning");
    });

    it('returns "ok" for 8+ days out', () => {
      expect(getExpiryStatus("2025-06-23")).toBe("ok");
    });

    it('returns "ok" for far future date', () => {
      expect(getExpiryStatus("2026-01-01")).toBe("ok");
    });
  });

  describe("getExpiryColor", () => {
    it("returns red classes for expired", () => {
      const color = getExpiryColor("expired");
      expect(color).toContain("red");
    });

    it("returns orange classes for critical", () => {
      const color = getExpiryColor("critical");
      expect(color).toContain("orange");
    });

    it("returns yellow classes for warning", () => {
      const color = getExpiryColor("warning");
      expect(color).toContain("yellow");
    });

    it("returns green classes for ok", () => {
      const color = getExpiryColor("ok");
      expect(color).toContain("green");
    });

    it("returns gray classes for none", () => {
      const color = getExpiryColor("none");
      expect(color).toContain("gray");
    });
  });

  describe("getExpiryLabel", () => {
    it('returns "No expiry date" for null', () => {
      expect(getExpiryLabel(null)).toBe("No expiry date");
    });

    it('returns "Expires today" for today', () => {
      expect(getExpiryLabel("2025-06-15")).toBe("Expires today");
    });

    it('returns "Expires tomorrow" for tomorrow', () => {
      expect(getExpiryLabel("2025-06-16")).toBe("Expires tomorrow");
    });

    it('returns "Expires in N days" for future dates', () => {
      expect(getExpiryLabel("2025-06-20")).toBe("Expires in 5 days");
    });

    it('returns "Expired 1 day ago" for yesterday (singular)', () => {
      expect(getExpiryLabel("2025-06-14")).toBe("Expired 1 day ago");
    });

    it('returns "Expired N days ago" for past dates (plural)', () => {
      expect(getExpiryLabel("2025-06-10")).toBe("Expired 5 days ago");
    });
  });

  describe("formatExpirationDate", () => {
    it("formats date correctly", () => {
      expect(formatExpirationDate("2025-06-15")).toBe("Jun 15, 2025");
    });

    it("formats another date correctly", () => {
      expect(formatExpirationDate("2025-12-25")).toBe("Dec 25, 2025");
    });

    it("formats January date", () => {
      expect(formatExpirationDate("2026-01-01")).toBe("Jan 1, 2026");
    });
  });
});
