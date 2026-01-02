import ExtUtilities from "../lib/ext/Utilities.js";

describe("Utilities test", () => {
  test("timeDiffString test", () => {
    expect(ExtUtilities.timeDiffString(1000)).toEqual("17 minutes");
  });
});
