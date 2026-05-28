# hugo-theme-warmpaper

暖色调 Hugo 博客主题，灵感源自 Claude 配色，带有方格纸背景。

从 [hexo-theme-warmpaper](https://github.com/finch-xu/hexo-theme-warmpaper)（Hexo/EJS）移植到 Hugo（Go 模板）。

[English](README.md)

- **需要 Hugo >= 0.123.0**

## 功能特性

- Claude 风格配色（暖米色 + 橙色强调）
- 淡橙色方格纸背景纹理
- 单栏文章布局 + 固定 TOC 侧边栏（滚动追踪）
- 首页卡片式文章列表
- 响应式设计（移动端自动隐藏 TOC）
- LXGW 文楷 GB 字体（CDN 加载）
- 浅色/深色主题（跟随系统偏好 + 手动切换）
- 代码高亮（Chroma 类名模式，兼容 Hexo 原生 / highlight.js / PrismJS）
- **GFM 风格提示框**（`[!NOTE/TIP/IMPORTANT/WARNING/CAUTION]`）

## 安装

### 克隆（推荐）

```bash
cd your-hugo-site
git clone https://github.com/qinmenghua/hugo-theme-warmpaper.git themes/warmpaper
```

### Hugo 组件方式

```bash
hugo mod init your-site
```

在 `hugo.toml` 中添加：

```toml
[module]
  [[module.imports]]
    path = "github.com/qinmenghua/hugo-theme-warmpaper"
```

更新组件：

```bash
hugo mod get
```

## 配置

在站点的 `hugo.toml` 中添加：

```toml
theme = "warmpaper"
```

完整示例见 `exampleSite/hugo.toml`。

```toml
# 主题参数
[params]
  # 导航菜单（数组格式保留显示名称）
  [[params.menu]]
    name = "首页"
    url = "/"
  [[params.menu]]
    name = "归档"
    url = "/archives"

  # 个人资料卡
  [params.profile]
    avatar = "/images/logo.svg"
    description = "写点代码，记点思考"

    [[params.profile.links]]
      name = "GitHub"
      url = "https://github.com/yourname"
      icon = "github"

  # 目录
  [params.toc]
    enable = true
    max_depth = 3
    min_depth = 2

  # 文章摘要链接
  excerpt_link = "阅读全文"

  # 页脚版权（留空使用默认）
  copyright = ""

# 目录配置
[markup.tableOfContents]
  startLevel = 2
  endLevel = 3
  ordered = false
```

## 许可证

[MIT](LICENSE) © 2026 awyme
