---
title: "Piovim"
description: "Pi inside Neovim, with live buffers, visual explanations, previewed edits, and collaborative diff review."
publishDate: 2026-05-26
technologies: ["Lua", "TypeScript", "Neovim", "Pi", "Node.js", "Git"]
github: "lukemelnik/piovim.nvim"
image: "./piovim-hero.png"
role: "solo"
status: "shipped"
tags: ["projects"]
---

Piovim is a Neovim plugin that brings [Pi](https://pi.dev) directly into the editor. It gives Pi live access to open buffers, diagnostics, cursor context, visual highlights, previewed edits, and a collaborative diff-review workflow. I built it for my own Neovim-heavy workflow, but it is also useful for Pi users who want the agent and code to share the same workspace.

## Problem

Pi's terminal workflow is powerful, especially for large autonomous edits and repo-wide implementation. But for some tasks, the agent can feel disconnected from the actual editor session.

- It does not automatically know which buffers are open.
- It can miss unsaved editor state.
- The user has to shuttle context back and forth between the agent and Neovim.
- For code explanation, the exact range being discussed matters.
- For review, comments and fixes are more useful when they live next to the diff.

I wanted Pi to see the buffers I already had open, point at code while explaining it, and work with me inside Neovim instead of in a separate context.

## Solution

Piovim runs Pi in RPC mode, opens a side-panel chat with a bottom prompt, and loads a bundled Pi extension that exposes explicit `nvim_*` tools.

Those tools let Pi inspect and interact with live Neovim state:

- read current and open buffers, including unsaved changes
- inspect diagnostics and cursor position
- open files and jump to specific lines
- highlight ranges while explaining code
- preview small in-buffer edits before applying them
- save or safely close buffers through explicit tools
- inspect and annotate an active review diff

The goal is not to replace the terminal agent. Piovim is for moments where Neovim should be the shared workspace: learning, reviewing, small edits, and precise conversations about the code on screen.

## What I built

Piovim combines three main surfaces:

- **Side-panel chat:** a Neovim-native chat panel with a prompt buffer, slash commands, model selection, thinking-level controls, abort/clear flows, and optional tmux-aware navigation.
- **Live editor tools:** a bundled Pi extension that gives Pi controlled access to buffers, diagnostics, highlights, previewed edits, saves, and safe buffer closing.
- **Collaborative review diff:** a side-by-side diff viewer with file navigation, hunk navigation, comments, quickfix export, refreshes, and Pi-visible annotations.

The review workflow supports working tree diffs, staged changes, branch comparisons, GitHub PRs through `gh`, recent commits, commit ranges, patch files, and custom `git diff` arguments. While a review is open, Piovim can watch the source and refresh when the underlying Git or patch-file state changes.

## Technical architecture

Piovim is a Lua Neovim plugin with a bundled TypeScript Pi extension.

- **Plugin:** Lua modules for setup, panel UI, RPC lifecycle, context collection, buffer operations, edit previews, review diff rendering, health checks, and persistent state.
- **Pi extension:** TypeScript tools registered with Pi through `@mariozechner/pi-coding-agent`.
- **Bridge:** a localhost TCP bridge with a per-session token connects the Pi extension process back to Neovim.
- **Review state:** annotations are stored outside the repo at `stdpath("state")/piovim/reviews/` and pruned after 30 days.
- **Testing:** headless Neovim scripts cover smoke behavior, edit safety, review-diff parsing, source handling, large-file safeguards, and inactive review context.

The explicit bridge matters because live editor state is not the same as disk state. Pi uses normal file tools for unopened files, but it uses `nvim_*` tools when the current Neovim session matters.

## Product decisions

### Keep the scope editor-native

Piovim is intentionally scoped to collaborative editor moments. Large autonomous edits still belong in Pi's terminal workflow. Piovim focuses on the places where visual context, open buffers, and immediate feedback matter more than autonomy.

### Make editor access explicit

Every editor action goes through a named `nvim_*` tool. That boundary makes it clear when Pi is reading live Neovim state instead of files on disk, and it gives the plugin room to enforce safety checks around modified buffers and plugin-owned buffers.

### Preview before applying

`nvim_edit_buffer` shows an in-place diff preview before applying changes. The edits are undoable and remain unsaved until explicitly saved, which keeps small agent edits from feeling like hidden file writes.

### Avoid heavy dependencies

Piovim does not require plenary.nvim, Telescope, nui.nvim, diffview.nvim, or Treesitter. The diff-review flow is inspired by diffview.nvim, but Piovim owns the review state so Pi can inspect the active comparison, add annotations, and resolve notes.

### Treat review as a shared workspace

A large part of the project became the review flow: source selection, refresh watching, persistent annotations, quickfix export, comment re-anchoring, and large-file safeguards. The important product idea is that both the human and the agent can work from the same diff and the same comments.

## Current status

Piovim is shipped and public, but still experimental. I expect fast iteration and occasional breaking changes while the workflow settles. For now, installing from `main` or pinning a commit is the expected path rather than relying on release tags.

## What I learned

Piovim was a good way to experiment with Pi's RPC mode and an alternate shape for agent interfaces. Instead of treating Pi as the primary interface, the plugin embeds it inside another program and lets Neovim define the shared workspace.

That opened my eyes to what is possible when Pi is integrated into existing tools instead of sitting beside them. The useful part was not just putting a chat panel in the editor; it was giving Pi structured access to live buffers, highlights, previews, and review state so it could participate in the workflow already happening there.
