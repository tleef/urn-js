import * as chai from "chai";

import Urn from "./urn";

const expect = chai.expect;

describe("urn", () => {
  describe("#create()", () => {
    it("should create a urn", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
        {
            identifier: () => {
                return "test";
            },
            namespace: "tleef",
          prefix: "urn",
          type: "thing",
        },
      );

      expect(thing.create()).to.equal("urn:tleef:thing:test");
    });

    it("should create blank if no args", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      expect(thing.create()).to.equal(":::");
    });

    it("should use given args first", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
        {
            identifier: () => {
                return "test";
            },
            namespace: "tleef",
          prefix: "urn",
          type: "thing",
        },
      );

      expect(thing.create({
        identifier: "other",
      })).to.equal("urn:tleef:thing:other");
    });
  });

  describe("#parse()", () => {
    it("should parse a urn", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      expect(thing.parse("urn:tleef:thing:test")).to.deep.equal({
          identifier: "test",
          namespace: "tleef",
        prefix: "urn",
        type: "thing",
      });
    });

    it("should throw if not a string", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      // @ts-ignore
      expect(thing.parse.bind(thing, 123)).to.throw("urn must be a string");
    });

    it("should throw if wrong length", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      expect(thing.parse.bind(thing, "urn:tleef:thing")).to.throw("urn is wrong length");
    });
  });

  describe("#validate()", () => {
    it("should validate true if correct length and no validators", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      expect(thing.validate("urn:tleef:thing:test")).to.equal(true);
    });

    it("should validate false if wrong length and no validators", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
      );

      expect(thing.validate("urn:tleef:thing")).to.equal(false);
    });

    it("should validate true if passes all validators", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
        undefined,
        {
            identifier: (id: string) => {
                return id === "test";
            },
            namespace: "tleef",
          prefix: "urn",
          type: /^thing$/,
        },
      );

      expect(thing.validate("urn:tleef:thing:test")).to.equal(true);
    });

    it("should validate false if fails a validator", () => {
      const thing = new Urn(
        [
          "prefix",
          "namespace",
          "type",
          "identifier",
        ],
          undefined,
        {
            identifier: (id) => {
                return id === "test";
            },
            namespace: "tleef",
          prefix: "urn",
          type: /^thing$/,
        },
      );

      expect(thing.validate("urn:tleef:thing:other")).to.equal(false);
    });
  });
});
