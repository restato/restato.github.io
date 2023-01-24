---
title: "[Python] Pandas에서 특정 컬럼 제외하고 나머지 선택"
categories: [파이썬]
tags: [python, pandas, tips]
mermaid: true
math: true
comments: true
pin: false
image:
  path:
  width:
  height:
  alt:
---

```python
특정 컬럼 제외하고 나머지
df.loc[:, df.columns != 'b']
```