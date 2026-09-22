# Data

Apply this only when the change touches a schema, migration, event, time, money, text, identity, personal data, or a backup. `coding-rules` sent you here. Do not reopen the other references.

Code is rewritten in an afternoon. Data is forever, and consumers you don't control are coupled to its shape.

- Schemas, API contracts, and event payloads get more design care than the code that reads them.
- Push invariants into the database: NOT NULL, unique constraints, foreign keys, check constraints. They outlive the language, the framework, and the service boundary.
- Add columns rather than repurposing them. Expand, then contract. Version events.
- A migration ships in its own deploy, before the code that needs it, and is either reversible or explicitly declared not to be. In a pull request the migration commit comes first and is safe to deploy alone.
- Time: store instants in UTC. A future event a human scheduled in local time is not an instant. Store the local time plus the zone identifier, because zone rules change and the user meant that wall-clock time. Never hand-roll date math.
- Money: integer minor units or decimals, rounding defined explicitly, and the currency stored next to the amount. An amount without a currency is a number, not money. Do not introduce a float amount.
- Text: assume any script and any length. Do not validate names, addresses, or phone numbers against a pattern you invented. Normalize Unicode to one form at the boundary before comparing. A length limit names its unit — bytes, code points, or grapheme clusters — and the API, the store, and the UI use that same unit.
- Identity: keep a stable internal ID. Treat every external identifier (email, username, phone, a third party's ID) as a mutable attribute.
- If you store personal data, the way to delete it is part of the change.
- A backup you have not restored is a hope. When you add or change backup or restore, restore into a scratch environment on a schedule and time it. The restore time is the real recovery objective.
