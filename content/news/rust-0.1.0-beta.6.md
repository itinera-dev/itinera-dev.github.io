---
title: Rust 0.1.0-beta.6 is released
description: The sixth beta of Itinera for Rust, whose journey IDs are strings that are not empty, claiming tier 1 of specification 0.1.0.
date: 2026-10-27
time: 17:15
---

# Rust 0.1.0-beta.6 is released

The sixth beta of Itinera for Rust is on crates.io. It implements specification 0.1.0 and claims tier 1, with synchronous and asynchronous executors and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.18, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-rs/releases/tag/v0.1.0-beta.6).

## What changed

This beta follows two proposals the specification has accepted since the last one, and it breaks code written for 0.1.0-beta.5:

- **A journey ID is a string that is not empty.** You make one with `JourneyId::try_from`, from a `&str` or a `String`, and an empty string is refused. What a journey does is unchanged: only creating an instance whose ID generator produces an empty ID now fails.
- **Custom code can't return what its call can't return.** A step that returns no outcome, or a step hook that returns something that isn't a lifecycle, aborts a journey in the specification; in Rust, as before, such code doesn't compile, and the conformance report now lists this rule as impossible to write, together with an ID generator that returns something that isn't a string.
- **A copy is not a conversion.** itinera clones the data your code receives to keep it read-only, and the specification now says that such a copy is not a value conversion. Nothing a journey does changes because of it.
- **It shares its version with TypeScript's second release.** [Itinera for TypeScript 0.1.0-beta.6](/news/typescript-0.1.0-beta.6/) follows the same two proposals, and both are checked against the same version of the conformance cases.

[The changelog](https://github.com/itinera-dev/itinera-rs/blob/v0.1.0-beta.6/CHANGELOG.md) lists every change.

## Try it

Add it with `cargo add itinera@0.1.0-beta.6`. [Languages](/languages/#rust) has the rest: the book, the API reference and how to turn on the asynchronous executor.
