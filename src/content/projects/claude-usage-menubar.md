---
name: Claude Usage Menu Bar
tech: [Swift, SwiftUI, AppKit, macOS, Swift Package Manager]
links:
  - label: Code
    url: https://github.com/rajatbhagat/claude-usage-menubar
date: 2026-09-09
---

![Claude Usage Menu Bar showing session and weekly usage in the macOS menu bar](images/claude-usage-menubar.png)

A macOS menu bar app that shows how much of my Claude Pro plan's usage limit I've burned through, as a live colored ring in the menu bar — session and weekly percentages with reset countdowns, plus local token counts and estimated cost. It sources the numbers from Claude Code's own `/usage` command rather than a reverse-engineered endpoint, so they match the official dashboard, and the check itself costs nothing. Built with SwiftUI's `MenuBarExtra` and no Xcode project — just Swift Package Manager and a hand-rolled `.app` bundle. It requests zero macOS permissions, which turned out to be the hard part: GUI apps launch with a working directory of `/`, so the spawned CLI treated the entire filesystem root as its project and set off permission prompts for network volumes, Photos, Music, and Desktop until the working directory was pinned explicitly.
