---
title: "深入理解 CSS 容器查询"
date: 2026-05-10
tags: ["CSS", "前端", "Web"]
categories: ["技术", "前端"]
---

CSS Container Queries 终于得到了主流浏览器的全面支持。本文将深入探讨这一革命性的 CSS 特性。

## 什么是容器查询

容器查询（Container Queries）允许你根据父容器的大小来调整样式，而不再局限于视口宽度。这是响应式设计的重大突破。

## 基本语法

```css
.container {
  container-type: inline-size;
  container-name: sidebar;
}

@container sidebar (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
}
```

### container-type 属性

| 值 | 说明 |
|----|------|
| `inline-size` | 仅查询内联方向尺寸 |
| `size` | 查询所有方向尺寸 |
| `normal` | 不作为查询容器 |

## 实际案例

### 卡片组件

<!--more-->

当容器宽度足够时，卡片自动切换为水平布局：

```css
@container (min-width: 300px) {
  .media-card {
    display: flex;
    gap: 1rem;
  }
}

@container (min-width: 500px) {
  .media-card {
    flex-direction: row;
    align-items: center;
  }
}
```

### 与媒体查询的对比

- **媒体查询**：基于视口尺寸
- **容器查询**：基于父容器尺寸

> 容器查询让组件真正做到"一次编写，到处适配"。

## 浏览器兼容性

截至 2026 年，所有主流浏览器都已支持容器查询。Chrome 和 Edge 从 105 版本开始支持，Safari 从 16 版本开始支持，Firefox 从 110 版本开始支持。

## 最佳实践

1. 为可复用组件设置容器查询
2. 结合 CSS Grid 和 Flexbox 使用效果更佳
3. 避免过度嵌套容器查询

## 总结

CSS 容器查询是响应式设计的未来。它让组件级别的自适应成为现实，极大地提升了开发效率。
