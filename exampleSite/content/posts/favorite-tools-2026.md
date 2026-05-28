---
title: "My Favorite Developer Tools in 2026"
date: 2026-01-15
tags: ["Tools", "Development", "Productivity"]
categories: ["Technology"]
---

A curated list of tools I use daily as a developer.

## Editors

### Neovim

My primary editor. Fast, extensible, and keyboard-centric.

```
# init.lua snippet
vim.opt.number = true
vim.opt.relativenumber = true
vim.opt.tabstop = 2
vim.opt.shiftwidth = 2
```

### VS Code

For when I need a full GUI debugger or collaborative editing.

## Terminal

### WezTerm

A GPU-accelerated terminal emulator written in Rust. Configuration is Lua-based.

```lua
local wezterm = require 'wezterm'
return {
  font_size = 14.0,
  color_scheme = 'Catppuccin Mocha',
}
```

## Git Tools

### lazygit

A terminal UI for Git. Makes staging, committing, and branching much faster.

> Once you try lazygit, you'll never go back to `git add -p`.

## Performance

| Tool | Startup | Memory | Config Format |
|------|---------|--------|---------------|
| Neovim | ~50ms | ~80MB | Lua |
| VS Code | ~3s | ~400MB | JSON |
| Zed | ~200ms | ~150MB | JSON |

## Honorable Mentions

- **ripgrep** (rg) — blazing fast text search
- **fd** — better find
- **bat** — cat with syntax highlighting
- **delta** — better git diffs
- **zoxide** — smarter cd command

## Conclusion

The best tools are the ones that disappear into your workflow. Invest time in learning them well.
