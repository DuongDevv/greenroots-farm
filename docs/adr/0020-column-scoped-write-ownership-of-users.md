---
status: Accepted
date: 2026-11-19
deciders: ngxccc
---

# 20. Column-Scoped Write Ownership of the Users Table

## Context

`users` is a single wide table read by every module and written by several unrelated features. Authentication owns credentials and the verification lifecycle, the self-service profile surface owns `fullName` and `phone`, staff management owns `role` and `status` with a last-super-admin invariant, and loyalty will own `rewardPoints`. The table also carries one-row-per-account identity used by orders, sessions, and audit.

Without a rule, two failure modes appear. Either each module writes any column it can reach, so a profile handler can silently change `status` or `rewardPoints`; or all writes are funnelled through one "user service", which then has to own password hashing, token digests, role invariants, audit logging, and profile sanitization in one module. The second option makes every user-touching feature wait on the same service and turns a single row into a god-module.

ADR-0019 already requires the staff surface to enforce the last-super-admin invariant inside a transaction, and ADR-0014 keeps email verification inside authentication. Those requirements belong to different owners, so a single-writer service would have to import all of them.

- **Target modules**: `apps/api/src/modules/auth`, `apps/api/src/modules/users`, `apps/api/src/database/schemas`
- **Issue**: #75
- **Related**: ADR-0011, ADR-0014, ADR-0016, ADR-0019
- **Spec**: `docs/design/self-service-profile-formal-spec.md`

## Decision

Split write ownership of `users` into disjoint column groups. A module may write only its own group.

| Group                    | Columns                                                                                                                            | Owner                                                             |
| :----------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------- |
| Identity and credentials | `email`, `password`, `emailVerified`, `verificationToken`, `verificationExpiresAt`, `resetPasswordToken`, `resetPasswordExpiresAt` | `AuthService`                                                     |
| Profile                  | `fullName`, `phone`                                                                                                                | `ProfileService` (`modules/users`)                                |
| Role and status          | `role`, `status`                                                                                                                   | `StaffService` (`modules/users`, #77)                             |
| Loyalty                  | `rewardPoints`                                                                                                                     | Unassigned; the loyalty feature claims it before its first write  |
| Lifecycle                | `deletedAt`                                                                                                                        | Unassigned; the deletion feature claims it before its first write |
| Timestamps               | `createdAt`, `updatedAt`                                                                                                           | Database defaults and `$onUpdate`                                 |

Rules that follow from the split:

- A cross-group change calls the owning service instead of issuing a direct `UPDATE`. Suspending a user and revoking sessions stays inside the staff owner; verifying an email stays inside authentication.
- Every read uses an explicit projection. `select *`, row spreading, and "return the entity then delete secrets" are forbidden, because the table carries password and token columns.
- Every read and write on `users` filters `deletedAt IS NULL` unless the operation is explicitly about deleted rows.
- A new column requires the owning module to be named in this table before the first write. Extending a group is an amendment to this ADR, not an implicit right.
- Within a group, the owner enforces its own invariants inside one transaction. Cross-group atomicity is not provided.

## Positive Consequences

- Each feature stays atomic: #75 touches only profile columns, #77 only role and status.
- Credential and token columns cannot leak through a profile projection, because the projection is a closed list rather than a filtered entity.
- Reviewers can check a mutation against a short column list instead of re-reading the whole module.
- Authentication does not have to absorb profile, staff, or loyalty behaviour, so it keeps a single responsibility.

## Negative Consequences / Risks

- Two modules can write the same row concurrently. Updates converge per column, but there is no cross-group lost-update protection.
- The rule is a convention enforced by review, not by the type system or the database. A new contributor can violate it without a failing build.
- A feature that genuinely needs two groups in one transaction must go through the owning service, which can create a dependency edge between modules.
- Unassigned groups (`rewardPoints`, `deletedAt`) are a known gap until their features land.

## Explicit Tradeoffs

- **Column ownership over a single writer service**: independent, atomic modules win over one service that serializes every user-touching feature.
- **Explicit projections over a shared row mapper**: leak prevention at the query wins over the convenience of one mapper reused everywhere.
- **Convention over enforcement**: a documented rule and a review checklist win over a repository abstraction that would reintroduce the single-writer coupling.
