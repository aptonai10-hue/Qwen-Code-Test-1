const endpoint = process.env.CIVILDOCS_PUBLIC_PROXY || "https://civildocs-zuztwkvm.manus.space/api/gemini";
const prompts = [
  ["CD-04", "Create an NCC Grade 2 upgrade portfolio for a Zambian contractor with two completed road projects: Mufulira Township Roads ZMW 125000000.55 in 2025 and Kitwe Industrial Access Road ZMW 88900000 in 2024. Return the exact JSON structure requested by CivilDocs and do not state that NCC eligibility is guaranteed."],
  ["CD-05", "Create a material price escalation clause for a Zambian contract with Cement 850 bags base 185 current 215, Reinforcement steel 18 tonnes base 16800 current 18900, Diesel 12500 litres base 28.5 current 29.75, Aggregate 2400 m3 base 325 current 385, threshold 5%, cap 20%, floor -10%. Return the exact JSON structure requested by CivilDocs."],
  ["CD-06", "Create a site inspection and defect log for a Zambian drainage site in Kitwe with observations for concrete voids, damaged cement bags, blocked drain, missing signage, and unsafe access. Return the exact JSON structure requested by CivilDocs with practical quantities and status/severity values."],
];
const results = [];
for (const [module, prompt] of prompts) {
  const started = Date.now();
  try {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ prompt }) });
    const body = await response.json().catch(() => ({}));
    results.push({ module, status: response.status, ok: response.ok, elapsedMs: Date.now() - started, code: body?.code || null, hasCandidates: Array.isArray(body?.candidates), candidateTextLength: body?.candidates?.[0]?.content?.parts?.map(part => part.text || "").join("").length || 0 });
  } catch (error) {
    results.push({ module, status: 0, ok: false, elapsedMs: Date.now() - started, error: String(error?.message || error) });
  }
}
console.log(JSON.stringify({ endpoint, generatedAt: new Date().toISOString(), results }, null, 2));

