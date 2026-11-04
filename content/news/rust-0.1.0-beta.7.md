---
title: Rust 0.1.0-beta.7 is released
description: The seventh beta of Itinera for Rust, checked against the conformance cases that Kotlin and Java pass, claiming tier 1 of specification 0.1.0.
date: 2026-11-04
time: 11:53
---

# Rust 0.1.0-beta.7 is released

The seventh beta of Itinera for Rust is on crates.io. It implements specification 0.1.0 and claims tier 1, with synchronous and asynchronous executors and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.20, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-rs/releases/tag/v0.1.0-beta.7).

## What changed

This beta breaks no code written for 0.1.0-beta.6, and what a journey does is unchanged:

- **A scripted run asks only for attempts that can happen.** When a step's attempt 1 fails and its rescue step is scripted to fail, or to end in an abnormal termination, the journey fails and the step never runs again. A test no longer has to describe the step's attempt 2.
- **An input adapter can't be asynchronous.** The specification now says that an executor refuses an input adapter of an execution mode it doesn't accept. In Rust an input adapter is a plain function in both modes, so such an adapter doesn't compile, and the conformance report lists the rule as impossible to write.
- **It shares its conformance cases with Kotlin and Java.** [Itinera for Kotlin and Java 0.1.0-beta.7](/news/kotlin-and-java-0.1.0-beta.7/) passes the same version of the cases.

[The changelog](https://github.com/itinera-dev/itinera-rs/blob/v0.1.0-beta.7/CHANGELOG.md) lists every change.

## Try it

Add it with `cargo add itinera@0.1.0-beta.7`. [Languages](/languages/#rust) has the rest: the book, the API reference and how to turn on the asynchronous executor.
