import { describe, it, expect } from "vitest";
import { cn } from "@/lib/utils";

describe("utils", () => {
  describe("cn", () => {
    it("merges class names", () => {
      expect(cn("foo", "bar")).toBe("foo bar");
    });

    it("handles conditional classes", () => {
      expect(cn("base", false && "hidden", "extra")).toBe("base extra");
    });

    it("merges conflicting tailwind classes (last wins)", () => {
      const result = cn("px-4", "px-6");
      expect(result).toBe("px-6");
    });

    it("handles undefined and null", () => {
      expect(cn("base", undefined, null, "end")).toBe("base end");
    });

    it("handles empty input", () => {
      expect(cn()).toBe("");
    });

    it("deduplicates tailwind utility classes", () => {
      const result = cn("text-red-500", "text-blue-500");
      expect(result).toBe("text-blue-500");
    });

    it("handles array input via clsx", () => {
      expect(cn(["foo", "bar"])).toBe("foo bar");
    });
  });
});
