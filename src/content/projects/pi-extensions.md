---
title: "PI Extensions"
description: "My collection of custom Pi extensions for use in the Pi coding agent."
publishDate: 2026-04-24
technologies: ["TypeScript", "Pi", "Node.js"]
role: "solo"
status: "shipped"
draft: false
tags: ["projects"]
---

PI Extensions is my collection of custom Pi extensions for use in the [Pi coding agent](https://pi.dev). This page currently covers two of them: one for per-model behavior and one for session continuity.

## pi-model-prompt

- GitHub: [lukemelnik/pi-model-prompt](https://github.com/lukemelnik/pi-model-prompt)
- npm: [`@lukemelnik/pi-model-prompt`](https://www.npmjs.com/package/@lukemelnik/pi-model-prompt)
- What it's for:
  - saving a custom prompt per provider/model pair
  - editing, showing, and clearing the active model's prompt from Pi commands
  - keeping prompt tweaks available across sessions and projects
- Why I created it:
  - after moving between Claude, Codex, and Pi, I wanted different behavioral corrections for each model instead of one generic system prompt
  - Codex often over-engineered solutions and added complexity that was not necessary
  - Claude often rushed into implementation instead of slowing down, checking with me, and taking a more measured approach
  - Pi saves user and assistant messages when it saves a session, but it does not store the system prompt, which means you can change that prompt independently and make a per-model prompt extension possible

## pi-session-recap

- GitHub: [lukemelnik/pi-session-recap](https://github.com/lukemelnik/pi-session-recap)
- npm: [`@lukemelnik/pi-session-recap`](https://www.npmjs.com/package/@lukemelnik/pi-session-recap)
- What it's for:
  - showing a one-line recap above the editor so it is easier to resume a long-running Pi session
  - refreshing the recap after agent turns when Pi goes idle
  - choosing the model used for recaps and configuring the refresh delay
- Why I created it:
  - I liked the short recap Claude Code shows when you come back to a terminal session later and need to remember what a tmux pane was doing
  - I wanted that same continuity in Pi
  - the interesting part of the extension was making the timing and model behavior configurable instead of hardcoding a single recap workflow
