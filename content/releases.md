---
title: Releases
description: How every Itinera release proves what it claims, with its conformance report.
---

# Releases

A release of Itinera in any language claims a tier of the specification and a list of capabilities. The release process is built so that a release cannot claim what it has not proven.

## How a release is proven

1. **A release is requested by pushing a version tag** on the main branch. Only maintainers can create release tags.
2. **A release workflow decides whether the tag becomes a release.** It checks that the tag matches the package's version, that the commit is on the main branch, that every proposal the language lists passes its conformance cases, and that every proposal of the tier being claimed is listed. If anything fails, nothing is published, and the run fails where everyone can see it.
3. **Only that workflow can publish,** through the package registry's trusted publishing wherever the registry allows it, with no long-lived publishing token. Publishing by hand simply fails.
4. **A release carries its conformance report** as an asset: the proof of what it claims. The compatibility table of the conformance suite is built from those reports.

Package registries know nothing of git tags, and a published version can never be changed, which is why only the workflow that checked a release may publish it. The full rules are in the "Releases" section of [PROCESS.md]({{spec}}/blob/{{spec-ref}}/PROCESS.md).

## The latest release in each language

<!-- include: languages-table -->

[Languages](/languages/) has each language's details. Releases are also announced in [News](/news/).
