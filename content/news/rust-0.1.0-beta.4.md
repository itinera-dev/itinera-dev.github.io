---
title: Rust 0.1.0-beta.4 is released
description: The fourth beta of Itinera for Rust, with clearer violations and aborts, claiming tier 1 of specification 0.1.0.
date: 2026-10-27
---

# Rust 0.1.0-beta.4 is released

The fourth beta of Itinera for Rust is on crates.io. It implements specification 0.1.0 and claims tier 1, with synchronous and asynchronous executors and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.16, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-rs/releases/tag/v0.1.0-beta.4).

## What changed

This beta follows the newest conformance cases. It breaks code written for 0.1.0-beta.3 in two places, and fixes a third:

- **Two input adapters with one name are a mistake the workflow reports.** Building the workflow reports the violation `duplicate adapter name`, as it reports any other, and an input adapter or service provider that lists one step twice is reported too; `#[workflow]` refuses either when the program compiles, naming the violation.
- **An abort says which input adapter failed.** When a step cannot be built because an input adapter failed, the journey's abort names the adapter and the key of the input it was resolving, as it already named a failed service provider. Code that read the abort's `provider` now reads `supplier`, which holds the adapter with its key, or the provider.
- **Scripted runs name a wrong attempt more clearly.** In a test, a script that names an attempt a step can never have, such as attempt 0, stops the test with a message naming the step and the attempt.

The cases also hold proposal 0113, on value conversions: code an application supplies to turn its objects into values and back. Its cases need the capability `value-conversions`, which Rust does not claim, since Itinera for Rust keeps each value as it is and reads it back by its exact type, calling no conversion.

[The changelog](https://github.com/itinera-dev/itinera-rs/blob/v0.1.0-beta.4/CHANGELOG.md) lists every change.

## Try it

Add it with `cargo add itinera@0.1.0-beta.4`. [Languages](/languages/#rust) has the rest: the book, the API reference and how to turn on the asynchronous executor.
