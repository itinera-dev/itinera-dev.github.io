---
title: Rust 0.1.0-beta.5 is released
description: The fifth beta of Itinera for Rust, with a crate page written for the people who use it, claiming tier 1 of specification 0.1.0.
date: 2026-10-27
time: 12:37
---

# Rust 0.1.0-beta.5 is released

The fifth beta of Itinera for Rust is on crates.io. It implements specification 0.1.0 and claims tier 1, with synchronous and asynchronous executors and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.16, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-rs/releases/tag/v0.1.0-beta.5).

## What changed

This beta breaks no code written for 0.1.0-beta.4, and what a journey does is unchanged:

- **The crate has a page written for the people who use it.** Its page on crates.io, and the opening of its documentation on docs.rs, are now its README: a quick start, the parts of a workflow, links to the book and the API reference, its status and its features.
- **It shares its version with TypeScript's first release.** The [first release of Itinera for TypeScript](/news/typescript-0.1.0-beta.5/) is 0.1.0-beta.5 too, and both are checked against the same version of the conformance cases.

[The changelog](https://github.com/itinera-dev/itinera-rs/blob/v0.1.0-beta.5/CHANGELOG.md) lists every change.

## Try it

Add it with `cargo add itinera@0.1.0-beta.5`. [Languages](/languages/#rust) has the rest: the book, the API reference and how to turn on the asynchronous executor.
