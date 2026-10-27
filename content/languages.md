---
title: Languages
description: Every language Itinera is implemented in, what each release claims, and how to install it.
---

# Languages

Itinera has one specification and an implementation in each language. Every implementation claims a tier of the specification and a list of capabilities, and it may claim a tier only when every conformance case of that tier, and of the tiers before it, passes. What each one claims comes from its conformance manifest, never from this page alone.

<!-- include: languages-table -->

A **tier** is a level of meaning: tier 1 is a single workflow, with its steps, policies, retries, rescue steps, services and events. A **capability** is a property of an executor or of a language: how a workflow runs, such as a synchronous or an asynchronous executor, or what a language offers beside them, such as test support, which lets an application test its workflows, or value conversions, which let an application's own objects be values. [The roadmap](/roadmap/) lists the tiers, and [the specification](/specification/) says what each means.

<!-- include: languages-details -->

## Planned languages

The JVM comes next, with Kotlin first and support for Java. It follows the same specification and runs the same conformance cases as every other language, so a workflow means the same in each. A new language starts with a proposal, like any other change; [Contribute](/contribute/) says how.
