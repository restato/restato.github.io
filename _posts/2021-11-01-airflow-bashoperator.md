---
title: "[Airflow] bashOperator 사용시에 jinja2.exceptions.TemplateNotFound"
categories: [데이터엔지니어링]
tags: [airflow, bashoperator, jinja]
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

단순히 스크립트 실행인데 아래와 같이 에러가 났다.

```sh
jinja2.exceptions.TemplateNotFound: sh /forkrane/scrap.sh
```

```python
    t2 = BashOperator(
        task_id='ingest',
        depends_on_past=False,
        bash_command='cd /forkrane; sh scrap.sh',
        retries=3,
    )
```

위가 정의한 `BashOperator`인데 아래와 같이 수정해야 한다.

```python
    t2 = BashOperator(
        task_id='ingest',
        depends_on_past=False,
        bash_command='cd /forkrane; sh scrap.sh ', # 마지막에 공백을 추가 (파일 경로를 조작할때 필요)
        retries=3,
    )
```