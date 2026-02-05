import { describe, expect, it } from "vitest";
import { moveWithin, reindexByOrder } from "@/lib/board-order";

describe("board-order", () => {
  it("moves items in list", () => {
    expect(moveWithin(["a", "b", "c"], 0, 2)).toEqual(["b", "c", "a"]);
  });

  it("reindexes in sequence", () => {
    expect(reindexByOrder([{ id: "x" }, { id: "y" }])).toEqual([
      { id: "x", order: 0 },
      { id: "y", order: 1 },
    ]);
  });
});
