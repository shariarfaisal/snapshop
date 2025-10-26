import { describe, it, expect } from "vitest";

describe("Basic Test Setup", () => {
  it("should run tests", () => {
    expect(true).toBe(true);
  });

  it("should perform arithmetic", () => {
    expect(1 + 1).toBe(2);
  });

  it("should handle strings", () => {
    const greeting = "Hello, World!";
    expect(greeting).toContain("Hello");
  });
});
