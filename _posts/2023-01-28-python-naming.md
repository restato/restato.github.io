---
title: "[Python] 파이썬 네이밍"
categories: [파이썬]
tags: [클린파이썬]
mermaid: true
math: true
comments: true
pin: false
---

private은 `_`(밑줄 한개)을 사용, name mangling을 방지하기 위해서는 `__`(밑줄 두개) 사용

```python
_books = {} # private var
__dict = {} # 파이썬 내장 lib로 네임 mangling 방지를 위해 __ 두개 사용
```

```python
# private method
def _get_data():
    ...

# naming mangling 방지를 위해 두개의 밑줄
def __path():
    ...
```

user 객체를 반환하는 함수인 경우 아래 두개의 함수 이름 중에 올바른 함수 이름은?

```python
# 어떤 id인지 모호함
def get_user_info(id):
    ...

# 올바른 방법
def get_user_by(user_id):
    ...
```