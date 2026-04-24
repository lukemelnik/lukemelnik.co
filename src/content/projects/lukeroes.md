---
title: "Luke Roes"
description: "An artist website and direct publishing platform for releases, writing, and Songkeeper-synced music metadata."
publishDate: 2025-01-10
technologies: ["TypeScript", "TanStack Start", "OpenAPI SDK", "SQLite", "Drizzle", "Cloudflare R2", "Litestream", "Docker"]
url: "https://lukeroes.com"
github: "lukemelnik/lukeroes"
image: "./lukeroes-hero.png"
role: "solo"
status: "shipped"
draft: false
tags: ["projects"]
featured: true
---

Luke Roes is my artist website and direct publishing platform. I built it to combine music releases, writing, and direct audience connection in one place, while pulling release data automatically from Songkeeper. The site is live and actively used, and owning the full stack makes it much easier to customize than the Squarespace-style setups I used before while also leaving room to adapt quickly as new AI capabilities become useful.

## Problem

I wanted some of the benefits people use Patreon and Substack for — publishing, direct audience access, and an owned home for ongoing work — without depending on a third-party platform to control the product or the relationship.

I also did not want to manually update an artist site every time I released new music. Release metadata, credits, artwork, and streaming links already existed in Songkeeper, so copying that into a separate website would have been repetitive and easy to let drift.

## Solution

I built a dedicated artist site that acts as the public-facing home for my music, writing, and contact surfaces, while treating Songkeeper as the source of truth for release data.

That gives me two advantages:

- music and release metadata stay in sync automatically
- the publishing workflow stays fully owned, so I can add more automation over time, including around content and mailing-list style workflows

## What I built

The site includes:

- public pages for music, releases, writing, videos, tour dates, contact, and work-with-me
- release pages that pull in richer metadata from Songkeeper instead of behaving like a static discography
- a custom admin for posts, media, comments, and user management
- internal tooling to turn content into downloadable social-media assets in different aspect ratios

The result is more than a marketing site. It is a custom publishing system for the artist side of my work.

## Technical architecture

The project is a TanStack Start monorepo with a generated TypeScript SDK based on the Songkeeper OpenAPI spec.

- **Frontend:** TanStack Start + TanStack Router
- **Data integration:** generated OpenAPI SDK and query hooks for Songkeeper data
- **Database:** SQLite with Drizzle ORM
- **Auth:** Better Auth
- **Media:** sharp-based image processing with Cloudflare R2 storage
- **Email:** React Email + Nodemailer
- **Deployment:** Docker, Traefik, and GitHub Actions
- **Backups:** Litestream continuously replicating SQLite to Cloudflare R2

One of the more interesting technical decisions was simplifying the stack. I started from a more familiar Postgres-and-Redis mindset, then moved toward SQLite to make the app easier to host, back up, and move between environments. That simplification created its own challenge around safe backups, which is what led me to Litestream.

## Product decisions

- Keep the artist site as its own app instead of making it a thin page inside Songkeeper.
- Treat Songkeeper as the source of truth for releases and credits rather than duplicating data entry.
- Use the site as proof that API access to your own release catalog and metadata is a real product advantage in Songkeeper, not just an internal convenience.
- Favor direct publishing infrastructure over third-party audience platforms.
- Use SQLite for portability and lower operational overhead instead of defaulting to Postgres + Redis.
- Add custom admin tooling where it improves the workflow, like formatting social assets for reuse.
- Borrow useful ideas from existing platforms without inheriting their full product shape.

## Current status

The site is live and actively used. It already handles the core publishing workflow, and because I control the whole system, it can keep evolving instead of being locked into a generic portfolio or hosted-site template.
