---
title: "[FastAPI] CORS"
categories: [파이썬]
tags: [fastapi, cors]
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


```
Access to fetch at 'http://localhost:8000/' from origin 'http://localhost:19006' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.
```

FE에서 `http://localhost:8000` 호출시 위 에러 발생
요청하는 호스트 주소를 origins에 추가

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
origins = [
    "http://localhost.tiangolo.com",
    "https://localhost.tiangolo.com",
    "http://localhost",
    "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

https://fastapi.tiangolo.com/tutorial/cors/#origin