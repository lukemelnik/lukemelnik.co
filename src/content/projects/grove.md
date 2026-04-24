---
title: "Grove"
description: "A terminal-native CLI for git worktrees, deterministic ports, env setup, and tmux workspaces."
publishDate: 2026-04-17
technologies: ["Go", "Cobra", "YAML", "tmux", "GitHub Actions", "GoReleaser"]
github: "lukemelnik/grove"
role: "solo"
status: "shipped"
draft: false
tags: ["projects"]
---

Grove is a CLI for making git worktrees practical in a tmux-based workflow. I built it while developing Songkeeper with multiple agent branches running in parallel, where services, ports, and background processes kept colliding. Instead of switching to one of the newer orchestration frameworks, I wanted a thin layer on top of tools I already trusted: git worktrees, tmux, and Neovim.

## Problem

Raw `git worktree` is powerful, but in practice it still leaves a lot of friction.

- creating and attaching worktrees is only part of the problem
- multi-service apps still need per-branch port overrides and env handling
- tmux sessions and panes still need to be created and organized
- cleanup is risky without safety checks

That got more painful once I started running more agent-driven workflows in parallel. For a project like Songkeeper, where linting and pre-commit checks are heavy, I needed stronger isolation between branches without turning each new worktree into a bunch of manual setup.

## Solution

Grove wraps the annoying parts into a single terminal-native workflow.

- create a worktree
- assign stable branch-specific ports
- generate layered env configuration
- open the tmux workspace
- safely clean up when the branch is done

The goal was not to replace the terminal workflow. It was to make the existing one fast enough to use constantly.

## What I built

Grove is a standalone Go CLI with commands for initializing config, creating and attaching worktrees, listing active branches, checking current status, and cleaning up stale work.

The most important capabilities are:

- deterministic port assignment so each branch gets stable service ports
- layered env handling with symlinked `.env` files and per-worktree `.env.local` generation
- tmux workspace creation with configurable panes, layouts, optional services, and session/window modes
- deletion and cleanup flows with safety checks for unpushed work, open PRs, and dirty worktrees
- agent-friendly CLI behavior, including discoverable commands, schema output, JSON output, and dry-run support

## Technical architecture

Grove is written in Go and configured through a `.grove.yml` file in the project root.

- **CLI:** Cobra-based command structure
- **Config:** YAML with a CLI-accessible schema via `grove schema`
- **Core modules:** worktree management, env generation, deterministic ports, tmux orchestration, and hooks
- **Release flow:** GitHub Actions + GoReleaser for tagged binary releases

One of the more important design choices was making the tool easy for agents to operate. The commands are intentionally discoverable, support non-interactive flows, and return structured output when needed so an agent can set up and debug a project without a lot of hand-written guidance.

## Product decisions

- Keep the workflow terminal-native instead of switching to a newer orchestration layer.
- Solve the real overhead around worktrees rather than replacing git or tmux.
- Optimize for multi-service apps where ports and env files need to vary per branch.
- Add safety checks so cleanup commands are useful without feeling dangerous.
- Make the CLI agent-friendly from the start.
- Treat it as a pragmatic layer on top of proven tools, not a bet that the current orchestration landscape is settled.

## Current status

Grove has a public release and is already useful in real work. It came out of a specific need in my own development setup, but it also reflects a broader preference: keep the tools that already work well, and add just enough orchestration to make parallel development feel smooth.
