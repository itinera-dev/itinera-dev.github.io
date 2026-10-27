---
title: TypeScript 0.1.0-beta.5 is released
description: The first release of Itinera for TypeScript, a beta on npm, claiming tier 1 of specification 0.1.0.
date: 2026-10-27
---

# TypeScript 0.1.0-beta.5 is released

Itinera has a second language. The first release of Itinera for TypeScript is on npm, as the package `itinera`, under the tag `next`. It implements specification 0.1.0 and claims tier 1, with an asynchronous executor, value conversions and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.16, the same version of the cases that Itinera for Rust 0.1.0-beta.4 passes, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-ts/releases/tag/v0.1.0-beta.5).

## What it brings

The meaning is the one the specification defines, so a workflow means in TypeScript what it means in Rust. The way you write it belongs to TypeScript:

- **Decorators declare everything.** A step, a policy or a workflow is a class, and a decorator above it, or above one of its parameters, says what it is. For a compiler that records no decorator metadata, a builder puts the same workflow together without them.
- **Each concept has a subpath of its own,** such as `itinera/step` or `itinera/workflow`, imported with `import` or `require` alike.
- **Values are checked by type tokens built on Zod,** and your own Zod schemas, or any other Standard Schema validator, serve as tokens too. With value conversions, an object of one of your own classes can enter the data bag and come back as an object.
- **Some mistakes do not compile.** A lifecycle a hook may not return, a policy whose role the workflow does not provide, a rescue step that skips, a service provider that returns no service, and a write through an input adapter's access to the data bag are type errors, caught when the program compiles rather than when it runs.
- **The executor always returns a promise,** and accepts steps, hooks and reporters of either execution mode.

[The changelog](https://github.com/itinera-dev/itinera-ts/blob/v0.1.0-beta.5/CHANGELOG.md) lists everything the release contains.

## Try it

Add it with `npm install itinera@0.1.0-beta.5 reflect-metadata`. [Languages](/languages/#typescript) has the rest: the compiler options it needs, the TypeScript edition of the book and the API reference.
