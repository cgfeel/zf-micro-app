---
name: git-commit-standard
description: 在提交代码时，自动生成符合 Conventional Commits 规范的 commit message
version: 1.0.0
trigger: ["提交代码", "生成 commit message", "git commit"]
---

# Git 提交规范化

## 执行步骤

1. 运行 `git diff --staged` 查看暂存区的修改
2. 分析修改内容，判断变更类型：
   - `feat`: 新功能
   - `fix`: 修复 bug
   - `docs`: 文档变更
   - `style`: 代码格式、样式修改（不影响功能）
   - `refactor`: 重构（不影响功能）
   - `test`: 测试相关
   - `chore`: 构建/工具/依赖更新等杂项
3. 生成 `commit message` 格式：

   ```
   <type>(<scope>): <subject>

   <body>

   <footer>
   ```

   - `<type>`: 变更类型
   - `<scope>`: 影响的模块或功能（可选）
   - `<subject>`: 简短描述变更内容
   - `<body>`: 详细描述变更内容（可选）
   - `<footer>`: 关联的 issue 或 breaking change（可选）

4. 显示给用户确认后执行 `git commit & git push`，并输出最终的 `commit message`。

## 示例：

修改了 `src/components/BookmarkCard.tsx` 中的样式，生成的 `message`：

```
style(BookmarkCard): 优化书签卡片的响应时布局

- 调整了移动端下的卡片宽度
- 修复了标签溢出的问题
```
