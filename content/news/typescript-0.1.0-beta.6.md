---
title: TypeScript 0.1.0-beta.6 is released
description: The second beta of Itinera for TypeScript, which aborts a journey when custom code returns what its call cannot return, claiming tier 1 of specification 0.1.0.
date: 2026-10-27
time: 16:52
---

# TypeScript 0.1.0-beta.6 is released

The second beta of Itinera for TypeScript is on npm, as the package `itinera`, under the tag `next`. It implements specification 0.1.0 and claims tier 1, with an asynchronous executor, value conversions and support for testing workflows. It passes the conformance cases tagged v0.1.0-rc.18, and its conformance report is attached to [its release on GitHub](https://github.com/itinera-dev/itinera-ts/releases/tag/v0.1.0-beta.6).

## What changed

This beta follows two proposals the specification has accepted since the first release, and it breaks code written for 0.1.0-beta.5:

- **Custom code that returns what its call cannot return aborts the journey.** A step whose `run` returns no outcome, a step hook that returns neither `keepDefault()` nor a lifecycle, or an input adapter or service provider that returns what its helpers did not make now aborts the journey with the reason `unexpected result`, and the step is not tried again. A dispatcher factory that returns no dispatcher refuses `run` instead. TypeScript's types already refuse these mistakes, so they do not compile; the checks catch what a cast lets through.
- **A step hook no longer keeps the default by returning nothing.** It returns `keepDefault()` or a lifecycle, and what a workflow hook returns is never read.
- **A copy is not a conversion.** The copy itinera makes to keep the data your code receives read-only is not a value conversion, as the specification now says. Nothing a journey does changes because of it.

[The changelog](https://github.com/itinera-dev/itinera-ts/blob/v0.1.0-beta.6/CHANGELOG.md) lists every change.

## Try it

Add it with `npm install itinera@0.1.0-beta.6 reflect-metadata`. [Languages](/languages/#typescript) has the rest: the compiler options it needs, the TypeScript edition of the book and the API reference.
