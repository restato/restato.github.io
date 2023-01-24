---
title: "[FastAPI] Dockerize"
categories: [파이썬]
tags: [fastapi, dockerize, docker-compose]
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

### 프로젝트 구조

```
app/main.py
Dockerfile
docker-compose.yml
```

### Dockerfile

```Dockerfile
# Dockerfile

# pull the official docker image
FROM python:3.9.4-slim

# set work directory
WORKDIR /app

# set env variables
# Prevents Python from writing pyc files to disc
ENV PYTHONDONTWRITEBYTECODE 1
# Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# copy project
COPY . .
```

### docker-compose.yml

```yaml
# docker-compose.yml

version: '3.8'

services:
  web:
    build: .
    command: uvicorn app.main:app --host 0.0.0.0
    volumes:
      - .:/app
    ports:
      - 8000:8000
```

### Docker build & run

```sh
docker-compose build
docker-compose up -d
docker-compose up -d --build
docker-compose -f <docker-compose.yml> up -d --build
docker-compose down -v

#When finished
docker-compose down

#Check console output
docker-compose logs
docker-compose logs app #Check only app service log

#Go inside the app container
docker-compose run app bash
```

<http://localhost:8000>

### Reference

* <https://testdriven.io/blog/fastapi-docker-traefik/>
* <https://linuxtut.com/en/02ed76b94c60deba8282/>