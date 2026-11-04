---
title: TypeScript 0.1.0-beta.7 is released
description: The third beta of Itinera for TypeScript, checked against the conformance cases that Rust, Kotlin and Java pass, claiming tier 1 of specification 0.1.0.
date: 2026-11-04
time: 13:21
---

# TypeScript 0.1.0-beta.7 is released

The third beta of Itinera for TypeScript is on npm, as the package `itinera`, under the tag `next`. It implements specification 0.1.0 and claims tier 1, with an asynchronous executor, value conversions and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.20, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-ts/releases/tag/v0.1.0-beta.7).

## What changed

This beta breaks no code written for 0.1.0-beta.6, and what a journey does is unchanged:

- **A scripted run asks only for attempts that can happen.** When a step's attempt 1 fails and its rescue step is scripted to fail, or to end in an abnormal termination, the journey fails and the step never runs again. A test no longer has to describe the step's attempt 2.
- **An executor refuses an input adapter of a mode it doesn't accept.** The specification now says so. TypeScript's one executor accepts input adapters of either mode, so nothing changes here.
- **It shares its conformance cases with every other language.** [Rust 0.1.0-beta.7](/news/rust-0.1.0-beta.7/) and [Kotlin and Java 0.1.0-beta.7](/news/kotlin-and-java-0.1.0-beta.7/) pass the same version of the cases.

[The changelog](https://github.com/itinera-dev/itinera-ts/blob/v0.1.0-beta.7/CHANGELOG.md) lists every change.

## Try it

Add it with `npm install itinera@0.1.0-beta.7 reflect-metadata`. [Languages](/languages/#typescript) has the rest: the compiler options it needs, the TypeScript edition of the book and the API reference.
