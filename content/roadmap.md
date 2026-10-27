---
title: Roadmap
description: Itinera's tiers and milestones, in order, with what is available today.
---

# Roadmap

What is planned, in order. Each proposal's status lives in its issue in [the specification's repository]({{spec}}); this page gives the direction. The roadmap itself is kept in [ROADMAP.md]({{spec}}/blob/{{spec-ref}}/ROADMAP.md).

## Tiers

Tiers are levels of meaning, and each includes everything before it.

| Tier | What it adds | Where it stands |
|---|---|---|
| Tier 1: a single workflow | Steps, the data bag, services provided to steps, a local executor, retries, rescue steps, step hooks with their default behaviour, the workflow result, journey IDs and the event model | Specified. <!-- include: implementations --> |
| Tier 2: transfers and switches | Moving a journey to another workflow, with or without its data and execution state, late joining, transfer limits and re-entrancy protection | Planned |
| Tier 3: sub workflows | Running a workflow from within another | Planned |
| Later tiers | Durable runs: pending steps, checkpointing and resuming after a crash | Planned |

Waiting between attempts, back off, is planned too.

## Milestones

1. **Foundations.** The organisation, licences, the process and the core model proposal. Done.
2. **Specification {{spec-version}}.** Tier 1 written into the specification, the conformance case format and the first cases. Written; tagged once a first implementation passes every case.
3. **itinera-rs, tier 1.** Core types, the step, workflow and policy macros, local executors, a conformance runner, and the first release on crates.io. [Languages](/languages/) says where it stands.
4. **Tiers 2 and 3,** specified and implemented in Rust.
5. **Durable runs,** with a store interface and a first store backed by a database.
6. **Studio,** which draws workflows, and the connections between them, from their definitions.
7. **More languages:** TypeScript, which is released, then the JVM, with Kotlin first and support for Java.

[Languages](/languages/) says exactly what each language offers today.
