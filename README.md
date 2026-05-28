# hugo-theme-warmpaper

A warm, Claude-inspired Hugo blog theme with graph paper background.

Port of [hexo-theme-warmpaper](https://github.com/finch-xu/hexo-theme-warmpaper)（Hexo/EJS → Hugo/Go 模板）

[中文文档](README.zh.md)

- **Requires Hugo >= 0.123.0**

## Features

- Claude-inspired color scheme (warm beige + orange accent)
- Subtle orange grid-paper background texture
- Single-column post layout + sticky TOC sidebar with scroll tracking
- Card-style post list on homepage
- Responsive design (TOC auto-hides on mobile)
- LXGW WenKai GB font (CDN with subset loading)
- Light/Dark theme with system preference detection and manual toggle
- Syntax highlighting (Chroma with class-based CSS, supports Hexo native / highlight.js / PrismJS)
- **GFM-style alert boxes** (`[!NOTE/TIP/IMPORTANT/WARNING/CAUTION]`)

## Installation

### Clone (recommended)

```bash
cd your-hugo-site
git clone https://github.com/qinmenghua/hugo-theme-warmpaper.git themes/warmpaper
```

### Hugo Modules

```bash
hugo mod init your-site
```

Then add to `hugo.toml`:

```toml
[module]
  [[module.imports]]
    path = "github.com/qinmenghua/hugo-theme-warmpaper"
```

Update the module:

```bash
hugo mod get
```

## Configuration

Add to your site's `hugo.toml`:

```toml
theme = "warmpaper"
```

See `exampleSite/hugo.toml` for a complete configuration example.

```toml
# Theme parameters
[params]
  # Navigation menu (array of objects to preserve display names)
  [[params.menu]]
    name = "Home"
    url = "/"
  [[params.menu]]
    name = "Archives"
    url = "/archives"

  # Profile card
  [params.profile]
    avatar = "/images/logo.svg"
    description = "A short bio"

    [[params.profile.links]]
      name = "GitHub"
      url = "https://github.com/yourname"
      icon = "github"

  # Table of Contents
  [params.toc]
    enable = true
    max_depth = 3
    min_depth = 2

  # Post excerpt link text
  excerpt_link = "Read More"

  # Footer copyright (leave empty for default)
  copyright = ""

# TOC config
[markup.tableOfContents]
  startLevel = 2
  endLevel = 3
  ordered = false
```

MIT
