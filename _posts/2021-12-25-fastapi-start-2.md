---
title: "FastAPI 시작"
categories: [파이썬]
tags: [fastapi, backend, api, server]
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

<https://fastapi.tiangolo.com/>

```sh
pyenv virtualenv 3.8.10 backend
pyenv local backend
pip install fastapi
pip install "uvicorn[standard]"

uvicorn main:app --reload # 코드 변경이 있어도 자동으로 reload
```

* <http://localhost:8000/docs>
* <http://localhost:8000/redoc>
  * 자주 사용하는 쿼리를 입력 가능