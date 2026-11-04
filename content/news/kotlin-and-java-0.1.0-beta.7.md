---
title: Kotlin and Java 0.1.0-beta.7 are released
description: The first release of Itinera for Kotlin and for Java, a beta on Maven Central, claiming tier 1 of specification 0.1.0.
date: 2026-11-04
time: 01:24
---

# Kotlin and Java 0.1.0-beta.7 are released

Itinera has two more languages. The first release of itinera-j, Itinera's implementation for the JVM, is on Maven Central under the group `org.itinera-dev`, for Kotlin and for Java at once. It implements specification 0.1.0 and claims tier 1. Kotlin has synchronous and asynchronous executors and support for testing workflows; Java has a synchronous executor and support for testing workflows. Both pass the conformance cases tagged v0.1.0-rc.20, and both conformance reports are attached to [its release on GitHub](https://github.com/itinera-dev/itinera-j/releases/tag/v0.1.0-beta.7).

## What it brings

The meaning is the one the specification defines, so a workflow means in Kotlin and in Java what it means in Rust and in TypeScript. The way you write it belongs to the JVM:

- **One core for both languages.** The core is written in Kotlin and used from Java as naturally as from Kotlin. `itinera-kotlin` adds coroutines for asynchronous workflows and reads Kotlin's data classes as Kotlin declares them, and `itinera-java` adds requests in Java's own forms, such as an optional input that arrives as an `Optional`.
- **Annotations declare everything.** A step, a policy or a workflow is a plain class implementing one of Itinera's interfaces, and an annotation such as `@Step` or `@Workflow` says what it is. A builder puts the same workflow together without them.
- **Values are records and data classes,** read from the data bag with a type token that keeps generics and nullability.
- **Some mistakes do not compile.** A lifecycle a hook may not return, a part of the other execution mode in a workflow, a rescue step that skips, and a write through an input adapter's access to the data bag are caught when the program compiles, by the types or by `itinera-checker`, a plugin for javac and for KSP.
- **One version for every artifact,** which the bill of materials, `itinera-bom`, names once.

[The changelog](https://github.com/itinera-dev/itinera-j/blob/v0.1.0-beta.7/CHANGELOG.md) lists everything the release contains.

## Try it

Add `itinera-kotlin` or `itinera-java` to your build, with `itinera-testing` for your tests. [Languages](/languages/#kotlin) has the Gradle lines and what else each language needs, and links to the Kotlin and Java editions of the book and to the API reference.
