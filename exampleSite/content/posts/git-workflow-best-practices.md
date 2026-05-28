---
title: "Git 工作流最佳实践"
date: 2026-03-05
tags: ["Git", "工具", "工程化"]
categories: ["技术"]
---

在团队协作中，一个好的 Git 工作流能够极大提升效率。

## 常见工作流对比

### Git Flow

适合有固定发布周期的项目。

```
master ───────●───────────●─────────
              ╲         ╱
develop ───────●───●───●───────────
                   ╲ ╱
feature            ●
```

### GitHub Flow

适合持续部署的项目。

- 从 main 分支创建功能分支
- 提交更改并创建 Pull Request
- 审核通过后合并到 main

### Trunk-Based Development

适合需要快速迭代的团队。

> 所有开发者直接在主干分支工作，通过短命特性分支进行代码评审。

## 提交信息规范

### Conventional Commits

```
<type>(<scope>): <description>

[body]

[footer]
```

| Type | 说明 |
|------|------|
| feat | 新功能 |
| fix | 修复 bug |
| docs | 文档变更 |
| refactor | 代码重构 |
| test | 测试相关 |

## 分支命名规范

```
feature/issue-123-add-login
fix/issue-456-fix-crash
hotfix/urgent-security-patch
```

## 推荐的团队实践

1. **保持提交原子化**：每个提交只做一件事
2. **写有意义的提交信息**：说明为什么做这个变更
3. **经常推送**：避免长时间的本地变更
4. **代码评审**：所有变更都应该经过审查
5. **自动化测试**：合并前确保 CI 通过

## 总结

选择适合团队的工作流并坚持执行，比追求"完美"的工作流更重要。
