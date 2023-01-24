---
title: "[Python] Gunicorn 살펴보기"
categories: [파이썬]
tags: [python, gunicorn]
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

## Gunicorn

* WSGI (Web Server Gateway Interface)
  * 웹 어플리케이션이 웹서버와 통신하기 위한 인터페이스

```python
def app(environ, start_response):
    """Simplest possible application object"""
    data = b'Hello, World!\n'
    status = '200 OK'
    response_headers = [
        ('Content-type', 'text/plain'),
        ('Content-Length', str(len(data)))
    ]
    start_response(status, response_headers)
    return iter([data])

# filename:functionname
$ gunicorn --workers=2 test:app
```

APP_NAME을 지정하는게 좋겠다.

```
-n APP_NAME, --name=APP_NAME - If setproctitle is installed you can adjust the name of Gunicorn process as they appear in the process system table (which affects tools like ps and top).
```

## Architecture

* `pre-fork` worker model
  * central matser process가 worker processes를 관리한다.
* 모든 요청과 응답은 workerp process에서 처리

## 참고

* https://docs.gunicorn.org/en/latest/run.html
* https://docs.gunicorn.org/en/latest/design.html