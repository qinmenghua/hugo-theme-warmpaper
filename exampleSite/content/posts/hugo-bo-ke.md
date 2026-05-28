---
title: "使用 Hugo 搭建个人博客"
date: 2026-05-15
tags: ["Hugo", "博客", "Tutorial"]
categories: ["技术"]
---

Hugo 是目前最快的静态网站生成器之一。本文详细介绍如何搭建个人博客。

## 为什么选择 Hugo

- **速度极快**：数千页的站点也能毫秒级构建
- **灵活**：强大的模板系统和内容组织方式
- **免费**：完全开源，部署到 GitHub Pages 零成本

## 安装 Hugo

根据你的操作系统选择安装方式：

### macOS

```bash
brew install hugo
```

### Windows

```bash
winget install Hugo.Hugo.Extended
```

## 初始化站点

```bash
hugo new site my-blog
cd my-blog
```

## 配置主题

在 `hugo.toml` 中设置：

```toml
theme = "warmpaper"
baseURL = "https://yourname.github.io"
title = "我的博客"
```

> 主题的完整配置请参考 `exampleSite/hugo.toml`。

## 创建内容

```bash
hugo new posts/my-first-post.md
```

## 目录结构

```
content/
├── posts/        # 文章目录
├── page/         # 独立页面
└── archives/     # 归档页
```

## 部署到 GitHub Pages

```bash
hugo
cd public
git init
git add .
git commit -m "deploy"
git remote add origin https://github.com/yourname/yourname.github.io.git
git push -u origin main
```

## 总结

Hugo 让搭建个人博客变得非常简单。结合 Warmpaper 主题，你可以在几分钟内拥有一个漂亮的博客。
