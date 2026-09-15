import { describe, expect, it } from "vitest";
import { applyPilotProfileDefaults, readPilotProfile, savePilotProfile } from "./pilot-profile-utils.js";

function createStorage() {
  const values = new Map();
  return {
    getItem: key => values.get(key) || null,
    setItem: (key, value) => values.set(key, value),
  };
}

describe("pilot profile defaults", () => {
  it("stores a normalized browser-local profile", () => {
    const storage = createStorage();
    savePilotProfile(storage, { companyName: "  CivilDocs Test Contractor  ", contactName: " Jane " });
    expect(readPilotProfile(storage)).toMatchObject({ companyName: "CivilDocs Test Contractor", contactName: "Jane" });
  });

  it("prefills compatible fields without overwriting an in-progress draft", () => {
    const profile = { companyName: "CivilDocs Test Contractor", contactName: "Jane Engineer", location: "Kitwe" };
    expect(applyPilotProfileDefaults("inspection", { contractor: "", inspector: "Project Engineer" }, profile)).toEqual({
      location: "Kitwe",
      contractor: "CivilDocs Test Contractor",
      inspector: "Project Engineer",
    });
  });

  it("maps company and contact defaults appropriately for bid packages", () => {
    const profile = { companyName: "CivilDocs Test Contractor", contactName: "Jane Engineer" };
    expect(applyPilotProfileDefaults("bid", {}, profile)).toMatchObject({
      preparedBy: "CivilDocs Test Contractor",
      contractorRepresentative: "Jane Engineer",
    });
  });
});

