---
name: code-review
description: Reviews code quality, security, and maintainability. Use after writing or modifying code.
---

# Code Review

## Process

1. Run `git diff --staged` to check staged changes (if none, use `git diff` for all changes)
2. Focus on modified files and review using the checklist below
3. For any issues found, include concrete fix examples in the feedback

## Checklist

### Code Quality
- Is the code concise and readable?
- Are function and variable names appropriate?
- Is there any duplicated code?
- Is error handling implemented appropriately?

### Security
- Are there any exposed secrets or API keys?
- Is input validation implemented?

### Testing & Performance
- Is test coverage sufficient?
- Are performance considerations reflected?

## Feedback Priority
- Critical (must fix)
- Warning (fix recommended)
- Suggestion (consider improving)
