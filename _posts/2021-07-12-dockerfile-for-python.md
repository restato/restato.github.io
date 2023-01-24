---
title: "[Python] Dockerfile for Python Application"
categories: [파이썬]
tags: [python, docker, dockerfile]
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

## 파이썬에서 Docker

https://github.com/PatrickKalkman/python-docker

* Alpine을 사용하면 사이즈 작게 python docker를 만들 수 있음
* 기본값으로 container는 root로 동작
  * 하지만 container의 root와 host의 root가 같은것은 아니다.
  * docker는 container의 사용자를 제한한다.
  * security-attack surface를 줄이기 위해서는 권한이 없는 사용자로 컨테이너를 실행하는게 좋다.
  * 일부 공식 이미지는 이미 docker 이미지에 루트가 아닌 사용자를 생성한지만, 대부분의 경우 dockerfile에서 사용자를 직접 추가해야 한다
* app을 `CMD`의 명령어를 통해 수행
  * `CMD`를 통해 수행하면 os에서 SIGINT, SIGTERM의 신호를 받을 수 있다. (정상적으로 종료하는지 확인 가능)
  * 위 신호를 무시하고 container를 종료하면, Docker는 앱이 응답 할 때까지 10초 (기본 timeout) 동안 기다린다.
  * 앱이 응답하지 않으면 파이썬 프로세스를 종료하고 컨테이너를 중지
  * 따라서 가장 먼저 할 일은 SIGINT 및 SIGTERM 명령에 반응하여 app을 정상적으로 종료하는것
  * `App.stop()`을 통해 리소스를 정리
  * 소스코드에 대한 액세스 권한이 없거나, 소스코드 변경을 하지 않으려면 
    * docker 시작시에 `--init`을 사용해 docker에 컨테이너의 PID 1로서 프로세스를 사용하라고.

```sh
docker run --init -d yourpythonappimage
```

* container가 ctrl-c 또는 docker 중지 명령에 직접 반응
* `tini`를 dockerfile에 추가해서 영구적으로
  * https://github.com/krallin/tini
* health checks
  * dockerfile이 docker가 동작하는지 확인
  * 프로세스가 실행중이지만 새 연결처리할 수 없는 웹서버와 같은 경우 감지가 가능
* docker는 앱이 올바르게 작동하는지 여부를 알지못하므로 상태 확인을 수행하는 기능을 구현해야 한다
  * https://pypi.org/project/health-check/
  * https://pypi.org/project/py-healthcheck/
  * http endpoint가 있으면 curl을 통해 상태를 확인할 수 있다.
* Configuration Using Environment Variables
  * https://pypi.org/project/python-dotenv/ 을 이용해서 환경설정
  * `.env`를 key-value 쌍으로 읽어서 환경을 설정  

```sh
# development settings
DB_ADDRESS=localhost:2323
DB_TIMEOUT=4000
LOG_LEVEL=DEBUG
```

```python
import signal
import sys
import time
import os

from dotenv import load_dotenv

class App:
    def __init__(self):
        load_dotenv(verbose=True)
        self.loops = int(os.getenv("LOOPS", 5))
        self.shutdown = False
        signal.signal(signal.SIGINT, self.exit_gracefully)
        signal.signal(signal.SIGTERM, self.exit_gracefully)

    def exit_gracefully(self, signum, frame):
        print('Received:', signum)
        self.shutdown = True

    def start(self):
        print("Start app")

    def run(self):
        print("Running app")
        time.sleep(1)

    def stop(self):
        print("Stop app")


if __name__ == '__main__':
    app = App()
    app.start()
    counter = 0
    while not app.shutdown and counter < app.loops:
        app.run()
        counter += 1
    app.stop()
    sys.exit(0)
```


```sh
HEALTHCHECK --interval=21s --timeout=3s --start-period=10s CMD curl --fail http://localhost:3000/ || exit 1
```

* Logging from your Python Application
  * 상황에 따라 stdout, stderr에 로깅
    * print는 사용하지마
  * python 실행시 `-u` 파라미터를 사용
    * buffer message를 사용하지 않음

```Dockerfile
CMD ["python", "-u", "main.py"]
```

```Dockerfile
# Add Tiny
RUN apk add --no-cache tini
ENTRYPOINT ["/sbin/tini", "--"]
```

```Dockerfile
FROM python:3.8.7-alpine

RUN pip install --upgrade pip
RUN pip install pipenv

# Add Tiny
RUN apk add --no-cache tini

RUN adduser -D python

# Create the work dir and set permissions as WORKDIR set the permissions as root
RUN mkdir /home/python/app/ && chown -R python:python /home/python/app
WORKDIR /home/python/app

ENTRYPOINT ["/sbin/tini", "--"]

USER python

RUN pip install --user pipenv

ENV PATH="/home/worker/.local/bin:${PATH}"

COPY --chown=python:python Pipfile Pipfile
RUN pipenv lock -r > requirements.txt
RUN pip install --user -r requirements.txt

COPY --chown=python:python . .

CMD ["python", "-u", "main.py"]
```

```Dockerfile
FROM python:3.8.7-alpine

RUN pip install --upgrade pip
RUN pip install pipenv

RUN adduser -D python

# Create the work dir and set permissions as WORKDIR set the permissions as root
RUN mkdir /home/python/app/ && chown -R python:python /home/python/app
WORKDIR /home/python/app

USER python

RUN pip install --user pipenv

ENV PATH="/home/worker/.local/bin:${PATH}"

COPY --chown=python:python Pipfile Pipfile
RUN pipenv lock -r > requirements.txt
RUN pip install --user -r requirements.txt

COPY --chown=python:python . .

CMD ["python", "-u", "main.py"]
```

```python
import signal
import sys
import time
import os

from dotenv import load_dotenv

class App:
    def __init__(self):
        load_dotenv(verbose=True)
        self.loops = int(os.getenv("LOOPS", 5))
        self.shutdown = False
        signal.signal(signal.SIGINT, self.exit_gracefully)
        signal.signal(signal.SIGTERM, self.exit_gracefully)

    def exit_gracefully(self, signum, frame):
        print('Received:', signum)
        self.shutdown = True

    def start(self):
        print("Start app")

    def run(self):
        print("Running app")
        time.sleep(1)

    def stop(self):
        print("Stop app")


if __name__ == '__main__':
    app = App()
    app.start()
    counter = 0
    while not app.shutdown and counter < app.loops:
        app.run()
        counter += 1
    app.stop()
    sys.exit(0)
```