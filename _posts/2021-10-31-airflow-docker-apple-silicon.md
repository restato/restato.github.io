---
title: "[Airflow] Docker로 실행하기 Apple Silicon"
categories: [데이터엔지니어링]
tags: [airflow, data-engineering]
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

### docker-compose

```sh
# https://airflow.apache.org/docs/apache-airflow/stable/start/docker.html
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.2.1/docker-compose.yaml'
```

```sh
docker compose up -d
```

```sh
localhost:8080
```

```yaml
services:
  postgres:
    image: postgres:13
    environment:
      POSTGRES_USER: airflow
      POSTGRES_PASSWORD: airflow
      POSTGRES_DB: airflow
    volumes:
      - postgres-db-volume:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready", "-U", "airflow"]
      interval: 5s
      retries: 5
    restart: always
```

```shell
INFO  [alembic.runtime.migration] Context impl PostgresqlImpl.

INFO  [alembic.runtime.migration] Will assume transactional DDL.

/entrypoint: line 217:    47 Killed                  airflow db upgrade

[2021-10-31 23:34:49,740] {cli_action_loggers.py:105} WARNING - Failed to log action with (psycopg2.errors.UndefinedTable) relation "log" does not exist

LINE 1: INSERT INTO log (dttm, dag_id, task_id, event, execution_dat...
```

리소스를 아래와 같이 늘리니 정상적으로 올라온다

```
CPU 2 -> 4, Memory 2GB -> 6GB, SWAP 1GB -> 2GB.
```

###  Initialize

```sh
mkdir -p ./dags ./logs ./plugins
echo -e "AIRFLOW_UID=$(id -u)" > .env

docker-compose up airflow-init
```

### docker run

```sh
docker-compose up
curl -LfO 'https://airflow.apache.org/docs/apache-airflow/2.2.1/airflow.sh'
chmod +x airflow.sh
./airflow.sh info
```

### 참고

<https://stackoverflow.com/questions/67853522/apache-airflow-installation-issue-on-mac-m1>