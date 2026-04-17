import { describe, expect, it } from "vitest";

import { formatPercent } from "../../../frontend/src/lib/format";

describe("formatPercent", () => {
  it("formats ratio values into percentages", () => {
    expect(formatPercent(0.91)).toBe("91%");
  });
});

