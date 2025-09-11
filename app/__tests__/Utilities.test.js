const MOD = require("lib/Utilities");

describe("Utilities test", () => {
  test("timeDiffString test", () => {
    expect(ext.Utilities.timeDiffString(1000)).toEqual("17 minutes");
  });
});
