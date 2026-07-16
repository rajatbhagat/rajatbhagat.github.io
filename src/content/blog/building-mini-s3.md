---
title: 'Building Mini-S3: Learning Object Storage by Reimplementing It'
description: 'Why I built an S3-compatible object storage service from scratch with Spring Boot and PostgreSQL, and what it taught me.'
pubDate: 2026-07-09
category: tech
tags: [java, spring-boot, aws, s3, postgresql]
draft: true
---

I've used AWS S3 for years — uploading artifacts, hosting static assets, wiring it into data pipelines. But using a service and understanding it are different things. So I decided to build my own: [Mini-S3](https://github.com/rajatbhagat/mini-s3), an S3-compatible object storage service in Spring Boot and PostgreSQL, with a [React/Next.js UI](https://github.com/rajatbhagat/mini-s3-ui) on top.

## What it does

Mini-S3 implements the core ideas of object storage:

- **Buckets** — top-level containers with validation rules (naming, empty-bucket deletion checks)
- **Objects** — upload, download, and delete files with their metadata
- **Versioning** — every change to an object keeps its full history
- **Custom metadata** — arbitrary key-value pairs attached to objects at upload time
- **A RESTful API** — clean endpoints that mirror how S3's own API is shaped

The UI adds drag-and-drop uploads, bucket browsing, and metadata views in friendly tables.

## What building it taught me

**Versioning is a data-modeling problem, not a storage problem.** The interesting part isn't storing multiple copies — it's deciding what "the current version" means, how deletes interact with history, and how to keep queries fast when every object is really a chain of versions.

**Metadata design matters more than it looks.** S3's split between system metadata and user metadata seemed arbitrary until I had to implement both and realized they have completely different consistency and validation needs.

**API ergonomics come from constraints.** Reproducing S3-style semantics (like refusing to delete a non-empty bucket) forced me to think about *why* AWS made those choices — usually the answer is protecting users from themselves.

## Managing it like a real project

I ran the build like a work project, with a JIRA board, epics, and 175+ tasks. That sounds like overkill for a personal repo, but it kept the scope honest and made it easy to pick the project back up after breaks.

If you've ever wanted to demystify a cloud service you use daily, I highly recommend reimplementing a toy version. You'll never look at the real thing the same way.
