---
title: "[Python] Streamlit ValueError: variable encoding field is specified without a type; the type cannot be inferred because it does not match any column in the data."
categories: [파이썬]
tags: [python, streamlit, bug]
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

ValueError: variable encoding field is specified without a type; the type cannot be inferred because it does not match any column in the data.

```python
df.columns = [x for x in df.columns]
```

정확한 이유는 모르겠지만.. 위처럼 컬럼 변경하면 문제없이 동작함
