---
title: "[Python] 문자열 붙이기 성능 비교 (join, +)"
categories: [파이썬]
tags: [클린파이썬]
mermaid: true
math: true
comments: true
pin: false
image:
  src:
  width:
  height:
  alt:
---

가독성, 성능을 위해 문자열 붙일때는 `+`보다 `join`을 사용

```python
# 문자열 이 별변이므로 각 연결에 대해 새로운 메모리를 할당
full_name = first_name + " " + last_name

# 결합된 문자열에 메모리를 한번에 할당, 성능과 가독성 향상
" ".join([first_name, last_name])
```