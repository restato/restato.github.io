---
title: "[FastAPI] MySQL 연동"
categories: [파이썬]
tags: [python, fastapi, mysql]
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

### Peewee

python에서 mysql 접속을 위해서 [peewee](https://docs.peewee-orm.com/en/latest/peewee/database.html)를 사용

```sh
# Python peewee.ImproperlyConfigured: MySQL driver not installed
pip install pymysql
```

```python
from peewee import *

user = 'root'
password = '**'
db_name = '**'

conn = MySQLDatabase(
    db_name, user=user,
    password=password,
    host='localhost'
)

>>> conn.connect()
True
```