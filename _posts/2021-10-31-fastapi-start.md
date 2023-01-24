---
title: "[FastAPI] 시작하기"
categories: [파이썬]
tags: [python, fastapi, database]
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

* https://fastapi.tiangolo.com/

```python
pip install fastapi
pip install "uvicorn[standard]" #  ASGI server 가 필요해서 설치 (A)
```

### Example (GET)

```python
from typing import Optional

from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}
```

### Unicorn command

* [usage](https://www.uvicorn.org/#usage)

```sh
# main: python module 
# --reload: 코드 변경한 이후에 서버가 재시작 되도록 (개발 모드에서 사용)
unicorn main:app --reload 
# zsh: command not found: unicorn 
brew install unicorn
```

* <http://127.0.0.1:8000/items/5?q=somequery>
* <http://127.0.0.1:8000/docs>: Interactive API docs 가 자동으로 생성
* <http://127.0.0.1:8000/redocs>: alternative API docs


### Example (PUT)

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

# Basemodel로 아이템을 정의하고
class Item(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None


@app.get("/")
def read_root():
    return {"Hello": "World"}


@app.get("/items/{item_id}")
def read_item(item_id: int, q: Optional[str] = None):
    return {"item_id": item_id, "q": q}


@app.put("/items/{item_id}")
def update_item(item_id: int, item: Item):
    return {"item_name": item.name, "item_id": item_id}
```

### Example (Enum)

```python
from enum import Enum

from fastapi import FastAPI


class ModelName(str, Enum):
    alexnet = "alexnet"
    resnet = "resnet"
    lenet = "lenet"


app = FastAPI()


@app.get("/models/{model_name}")
async def get_model(model_name: ModelName):
    if model_name == ModelName.alexnet:
        return {"model_name": model_name, "message": "Deep Learning FTW!"}

    if model_name.value == "lenet":
        return {"model_name": model_name, "message": "LeCNN all the images"}
```

* 이렇게 만들면 APIdoc에서 selectBox로 확인가능

### Query Parameters

```python
from fastapi import FastAPI

app = FastAPI()

fake_items_db = [{"item_name": "Foo"}, {"item_name": "Bar"}, {"item_name": "Baz"}]


@app.get("/items/")
async def read_item(skip: int = 0, limit: int = 10): # limit 의 값 default로 설정이 가능
# async def read_item(item_id: str, q: Optional[str] = None): # default의 값을 none으로 설정 (optional 값을 처리할때)
    return fake_items_db[skip : skip + limit]
```

* <https://fastapi.tiangolo.com/tutorial/query-params/>
* <http://127.0.0.1:8000/items/?skip=0&limit=10>
* 쿼리파라미터의 값이 `bool` 타입일때는 1, true, True, on, yes 모두 사용 가능
* `required`의 파라미터 값에는 default를 선언할 수 없음

### Request Body

* Pydantic 모델을 사용해서 request body를 정의

```python
from typing import Optional

from fastapi import FastAPI
from pydantic import BaseModel


class Item(BaseModel):
    name: str # required
    description: Optional[str] = None # Optional
    price: float
    tax: Optional[float] = None


app = FastAPI()


@app.post("/items/")
async def create_item(item: Item):
    return item
```

* <https://fastapi.tiangolo.com/tutorial/body/>

### Validation

```python
from typing import Optional

from fastapi import FastAPI, Query # Query를 import

app = FastAPI()


@app.get("/items/")
async def read_items(q: Optional[str] = Query(None, max_length=50)): # 길이 50 # min_length 도 설정 가능, 시작도, regex도
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

* `min_length`, `regex` 설정도 가능
* `required`를 하기 위해서는 `Query(..., min_length=3))`, `...`을 사용


```python
from typing import Optional

from fastapi import FastAPI, Query

app = FastAPI()


@app.get("/items/")
async def read_items(
    q: Optional[str] = Query(
        None,
        title="Query string",
        description="Query string for the items to search in the database that have a good match", # description 추가도 가능
        min_length=3,
    )
):
    results = {"items": [{"item_id": "Foo"}, {"item_id": "Bar"}]}
    if q:
        results.update({"q": q})
    return results
```

### 마치며...

* 봐야할게 너무 많다 <https://fastapi.tiangolo.com/project-generation/>
* 대충 어떤 느낌인지 보기 위해서 프로젝트를 하나 만들면서 부족한걸 채우자
* TODO
  * <https://fastapi.tiangolo.com/tutorial/sql-databases/>