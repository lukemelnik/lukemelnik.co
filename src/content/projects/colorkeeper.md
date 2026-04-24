---
title: "Colorkeeper"
description: "A free, open-source macOS color picker with palette management, broad format output, and local-first JSON storage."
publishDate: 2026-04-17
technologies: ["Swift", "SwiftUI", "AppKit", "XcodeGen", "JSON"]
github: "lukemelnik/colorkeeper"
image: "./colorkeeper-hero.png"
role: "solo"
status: "shipped"
featured: true
draft: false
tags: ["projects"]
---

Colorkeeper is a native macOS color picker and palette manager for designers and developers. I built it as a free, open-source alternative to the paid utilities I kept finding, with a stronger focus on making colors easy to inspect, copy, and export in the formats I actually use.

## Problem

Most color pickers I tried were good at one slice of the job, but not the whole workflow.

- lightweight pickers often had weak palette management
- better library tools often made format conversion awkward
- many of the strongest options were paid

I wanted one app that could pick colors from anywhere, keep them in a usable library, and make common output formats immediately available.

## Solution

Colorkeeper combines quick capture with a fuller workspace.

- a menu bar quick panel and global hotkey for fast picking
- a library window for organizing palettes and editing colors
- built-in output for Hex, RGB, HSL, OKLCH, SwiftUI, and CSS

I also chose document-style storage instead of an opaque database, so palettes stay portable and easier to back up.

## What I built

Colorkeeper includes:

- screen picking, recent history, and manual input
- palette organization, editing, and generation
- contrast checking and export to design and developer formats

The main idea was simple: a picked color should be immediately usable, not just visible as a swatch.

## Technical architecture

Colorkeeper is built with Swift, SwiftUI, and a small set of AppKit/Carbon bridges for system features like the eyedropper and global hotkeys. The project is generated with XcodeGen and sticks to Apple frameworks.

The library is stored as readable JSON:

- `Library/metadata.json` for folders and palette order
- `Library/palettes/<uuid>.json` for one palette per file
- `History/recent-colors.json` for recent picks

Each color keeps canonical numeric values plus explicit color space and alpha, and the app derives display and export formats from that source of truth. I considered SQLite first, but JSON documents felt better for backup, sync, and user ownership.

## Product decisions

- Make it free and open source instead of another paid utility.
- Treat multi-format output as a core feature.
- Keep storage readable and local-first.

## Agent-assisted development

The implementation was largely agent-assisted, but the design was not. I used agents for speed, then corrected a lot of interaction details by hand when the generated UI behavior felt awkward.

## Current status

Colorkeeper is shipped as an open-source macOS app on GitHub. It is not in the App Store.
