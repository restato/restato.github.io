---
title: "[Python] Pylint"
categories: [파이썬]
tags: [python, pylint]
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

```sh
pip install pylint
pylint --generate-rcfile > .pylintrc
```

코드에서 예외처리를 위해서는

```python
# pylint:disable=line-too-long,....
```