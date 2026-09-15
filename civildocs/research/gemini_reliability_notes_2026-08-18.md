# Gemini Reliability Notes — 2026-08-18

## Official sources consulted

Google’s current Gemini API model catalog identifies `gemini-3.5-flash` as a stable legacy Flash model for routine high-throughput work and `gemini-3.5-flash-lite` as a stable, faster, cost-efficient model for high-throughput execution. Both are supported Gemini Developer API model identifiers.[1]

Google’s troubleshooting guidance recommends bounded exponential backoff with jitter for transient `429 RESOURCE_EXHAUSTED` and `503 UNAVAILABLE` responses, retrying only transient errors and retaining a finite retry limit.[2]

The production proxy therefore keeps `gemini-3.5-flash` as its primary model, retries transient upstream capacity errors with bounded exponential backoff and jitter, and then attempts stable `gemini-3.5-flash-lite` before returning the existing user-facing capacity state. This is a reliability improvement only; it does not alter billing or expose server-only credentials.

## References

[1]: https://ai.google.dev/gemini-api/docs/models
[2]: https://ai.google.dev/gemini-api/docs/troubleshooting

