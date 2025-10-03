---
applyTo: "src/utils/audit.ts"
---

## Audit Log Requirements
- Always return entries shaped like:

```ts
{
  id: string, // uuid
  action: string, // e.g., "vote_cast"
  actor: string, // user ID
  timestamp: string, // ISO 8601
  details: any
}
