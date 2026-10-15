---
title: Rust 0.1.0-beta.3 is released
description: The third beta of Itinera for Rust, with a friendlier API, claiming tier 1 of specification 0.1.0.
date: 2026-10-15
---

# Rust 0.1.0-beta.3 is released

The third beta of Itinera for Rust is on crates.io. It implements specification 0.1.0 and claims tier 1, with synchronous and asynchronous executors and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.15, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-rs/releases/tag/v0.1.0-beta.3).

## What changed

This beta makes the API friendlier. What a journey does is unchanged, but the beta breaks code written for 0.1.0-beta.2. The main changes:

- **Fewer marks.** The macros recognise a handle by its type, so a step simply takes `contributor: &mut Contributor`, with no mark and no lifetime. Marks stay only where the type cannot say what is asked for, such as `#[input]`, `#[service]` and `#[role]`.
- **Step hooks say what they decide.** A step policy's hook returns `OnSuccess` or `OnFailure`: it keeps the default, fails the workflow with a reason, or, after a success, finishes it.
- **Input adapters say where a value comes from.** An input adapter returns `Supplied`: the value it supplies, or `FromDataBag`, to read the input from the data bag as usual.
- **A shorter result.** Custom code may return `Result<T>`, with the error type filled in, such as `Result<Outcome>` from a step.

[The changelog](https://github.com/itinera-dev/itinera-rs/blob/v0.1.0-beta.3/CHANGELOG.md) lists every change.

## Try it

Add it with `cargo add itinera@0.1.0-beta.3`. [Languages](/languages/#rust) has the rest: the book, the API reference and how to turn on the asynchronous executor.
