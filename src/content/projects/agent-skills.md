---
title: "Agent Skills"
description: "An editable, cross-agent skills repo for reusable AI workflows, commands, and configuration."
publishDate: 2025-02-01
technologies: ["Markdown", "YAML", "Bash", "Claude Code", "Codex", "Pi"]
github: "lukemelnik/agent-skills"
role: "solo"
status: "shipped"
draft: true
tags: ["projects"]
---

Agent Skills is my shared repo of reusable skills, commands, and config for AI coding agents. I wanted one place to keep the instructions and scripts I actually rely on, then make them available across Claude Code, Codex, and Pi. It is open source, but the main purpose is to support my own workflow with tools I can inspect and change directly.

## Problem

Installing agent skills from npm felt like the wrong security model for something that can shape local workflows and run scripts. I would rather review plain files in a repo I control than depend on package installs, opaque updates, and code that is harder to tweak in the middle of real work.

The other problem was duplication. I was switching between different agent harnesses, re-creating the same setup, and re-explaining repeated workflows in prompts instead of giving the agent a reusable layer it could discover on its own.

## Solution

I keep broadly useful skills in one repo I own and edit directly, then symlink them into each agent’s skills directory. That gives me one source of truth across harnesses while still leaving room for project-specific skills inside individual repos.

A lot of the repo came from seeing useful ideas in other people’s skills, then adapting them into versions that better fit how I work. That makes the repo both a toolkit and a place to iterate: if I notice a failure mode, I can update the skill or add a helper script immediately.

## What I built

The repo combines a few different layers:

- reusable reference skills for specific stacks, tools, and workflows
- command-style skills for repeated tasks like review, implementation, and CI checks
- small config helpers for things like notifications and statusline behavior
- a setup script that links one source repo into multiple agent environments

## Technical architecture

- Skills live as plain files under `skills/`, one directory per skill.
- They use the shared `SKILL.md` format with YAML frontmatter.
- `setup.sh` symlinks them into `~/.claude/skills`, `~/.agents/skills`, and `~/.pi/agent/skills`.
- Because they are symlinked, any edit in the repo is immediately available everywhere.

## Product decisions

- Prefer locally owned files over npm-installed skills.
- Keep reusable skills here; keep project-specific skills in each project.
- Adapt useful ideas from other people’s skills instead of treating them as fixed packages.
- Add a skill only when a workflow repeats or the agent keeps making the same mistake.
- Avoid adding context the model already knows.
- Keep the repo focused instead of turning it into a giant catalog.

## Why it has been useful

Skills make repeated workflows more reliable. They reduce copy-paste, make useful context discoverable to the agent, and keep my tooling more consistent across different harnesses. That consistency also makes it easier to compare models on a more even baseline, since more of the surrounding setup stays the same.

## Current status

This is an actively evolving personal toolkit that I use in real work. It is public so other people can inspect it, copy it, and adapt it for their own setup.
