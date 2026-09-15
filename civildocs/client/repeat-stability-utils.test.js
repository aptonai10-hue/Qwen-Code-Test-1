import { describe, expect, it } from "vitest";
import { clearBidRepeatCache, clearRepeatCache, readBidRepeatCache, readRepeatCache, repeatInputKey, writeBidRepeatCache, writeRepeatCache } from "./repeat-stability-utils.js";

function storage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
    removeItem: key => values.delete(key),
  };
}

describe("CD-01 repeat stability cache", () => {
  it("produces the same canonical key regardless of object insertion order", () => {
    expect(repeatInputKey({ projectName: "A", budget: "100" })).toBe(repeatInputKey({ budget: "100", projectName: "A" }));
  });

  it("returns a cloned exact-input response and clears it safely", () => {
    const store = storage();
    const values = { projectName: "Drainage", budget: "500000" };
    const response = { boqItems: [{ itemNo: "1.01", quantity: 12, rate: 100 }] };
    writeBidRepeatCache(values, response, store);
    const cached = readBidRepeatCache({ budget: "500000", projectName: "Drainage" }, store);
    expect(cached).toEqual(response);
    expect(cached).not.toBe(response);
    clearBidRepeatCache(store);
    expect(readBidRepeatCache(values, store)).toBeNull();
  });

  it("does not throw when storage is unavailable", () => {
    const broken = { getItem: () => { throw new Error("blocked"); }, setItem: () => { throw new Error("blocked"); }, removeItem: () => { throw new Error("blocked"); } };
    expect(readBidRepeatCache({}, broken)).toBeNull();
    expect(() => writeBidRepeatCache({}, {}, broken)).not.toThrow();
    expect(() => clearBidRepeatCache(broken)).not.toThrow();
  });

  it("keeps CD-02 exact-input records separate from CD-01 and returns a clone", () => {
    const store = storage();
    const values = { certificateNumber: "Certificate 2", contractSum: "500000", valueThisPeriod: "75000", previousCertified: "200000" };
    const payment = { valuationItems: [{ description: "Concrete drains", previous: 200000, current: 75000 }] };
    writeRepeatCache("payment", values, payment, store);
    writeBidRepeatCache(values, { boqItems: [{ description: "Different module" }] }, store);
    const cached = readRepeatCache("payment", { previousCertified: "200000", certificateNumber: "Certificate 2", contractSum: "500000", valueThisPeriod: "75000" }, store);
    expect(cached).toEqual(payment);
    expect(cached).not.toBe(payment);
    expect(readBidRepeatCache(values, store)).not.toEqual(payment);
    clearRepeatCache("payment", store);
    expect(readRepeatCache("payment", values, store)).toBeNull();
  });
});

