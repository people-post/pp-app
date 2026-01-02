import Encoder from "../misc/Encoder.js";

describe("Encoder test", () => {
  test("encode/decode test", () => {
    let en = new Encoder("key");
    let de = new Encoder("key");
    let nde = new Encoder("key1");
    expect(de.decode(en.encode("testlong msg"))).toEqual("testlong msg");
    expect(nde.decode(en.encode("test"))).not.toEqual("test");
  });
});
