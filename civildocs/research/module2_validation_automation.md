# Module 2 Automated Production Validation

| Setting | Value |
|---|---|
| Scope | Interim Payment Certificate (Module 2) production validation |
| Callback path | `/api/scheduled/module2-validation` |
| Schedule | Every four hours, UTC (`0 0 */4 * * *`) |
| Project-level callback ID | `khTj9HikJ3mBrT4WwW3F4f` |
| Authentication | Platform-issued cron identity, verified before validation work begins |
| Durable attempt log | `module2_validation_runs` database table |
| First-success state | `module2_validation_state` database table |
| Owner alert | Sends once after the first valid multi-line IPC response reaches the flashcard/PDF-ready contract |

The callback was activated after deployment on 2026-08-16 and recreated once to correct a stale next-execution timestamp. Its next scheduled production attempt is 2026-08-17 00:00 UTC. Its execution history can be inspected, paused, or updated using this callback ID.

