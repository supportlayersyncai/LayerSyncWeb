import { describe, expect, it } from "vitest";
import { toCsv } from "./csv";

describe("csv", () => {
  it("quotes and neutralises formulas", () => {
    expect(toCsv([{ name: "=HYPERLINK(\"x\")", note: "a,b", n: 3 }])).toBe('name,note,n\r\n"\'=HYPERLINK(""x"")","a,b",3');
    expect(toCsv([{ a: "-2+3" }])).toBe("a\r\n'-2+3");
    expect(toCsv([])).toBe("");
  });
});
