---
title: "[Airflow] MySQL 연동"
categories: [데이터엔지니어링]
tags: [airflow, mysql, dataengineering]
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

mysql에서 데이터베이스 생성

```sql
CREATE DATABASE airflow CHARACTER SET utf8 COLLATE utf8mb4_unicode_ci;

CREATE USER 'airflow' IDENTIFIED BY 'airflow';
GRANT ALL PRIVILEGES ON airflow.* TO 'airflow';
```

```sql
--이미 설정되서 필요 없음
CREATE DATABASE airflow CHARACTER SET utf8 COLLATE utf8mb4_unicode_ci;
CREATE DATABASE airflow -- 이렇게 실행
ERROR 1253 (42000): COLLATION 'utf8mb4_unicode_ci' is not valid for CHARACTER SET 'utf8'

SHOW VARIABLES LIKE '%char%';
+--------------------------+----------------------------+
| Variable_name            | Value                      |
+--------------------------+----------------------------+
| character_set_client     | latin1                     |
| character_set_connection | latin1                     |
| character_set_database   | utf8                       |
| character_set_filesystem | binary                     |
| character_set_results    | latin1                     |
| character_set_server     | utf8                       |
| character_set_system     | utf8                       |
| character_sets_dir       | /usr/share/mysql/charsets/ |
+--------------------------+----------------------------+
8 rows in set (0.07 sec)
```

```conf
--mysql my.cnf 에 아래 코드를 uncomment
character-set-server = utf8
collation-server = utf8_unicode_ci
```


```
mysql+mysqldb://airflow:airflow@localhost:3306/airflow
```

```
airflow config get-value core sql_alchemy_conn 
mysql+mysqldb://airflow:airflow@localhost:3306/airflow

# sql_alchemy_conn = sqlite:////Users/direcision/airflow/airflow.db
sql_alchemy_conn = mysql+pymysql://airflow:airflow@localhost:3306/airflow

```

```
# https://stackoverflow.com/questions/25865270/how-to-install-python-mysqldb-module-using-pip
pip install pymysql
```

```
airflow db init
```

```
Traceback (most recent call last):
  File "/Users/direcision/.pyenv/versions/global/bin/airflow", line 8, in <module>
    sys.exit(main())
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/__main__.py", line 48, in main
    args.func(args)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/cli/cli_parser.py", line 48, in command
    return func(*args, **kwargs)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/cli/commands/db_command.py", line 31, in initdb
    db.initdb()
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/utils/session.py", line 70, in wrapper
    return func(*args, session=session, **kwargs)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/utils/db.py", line 591, in initdb
    upgradedb(session=session)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/utils/session.py", line 67, in wrapper
    return func(*args, **kwargs)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/utils/db.py", line 868, in upgradedb
    command.upgrade(config, 'heads')
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/command.py", line 320, in upgrade
    script.run_env()
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/script/base.py", line 563, in run_env
    util.load_python_file(self.dir, "env.py")
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/util/pyfiles.py", line 92, in load_python_file
    module = load_module_py(module_id, path)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/util/pyfiles.py", line 108, in load_module_py
    spec.loader.exec_module(module)  # type: ignore
  File "<frozen importlib._bootstrap_external>", line 848, in exec_module
  File "<frozen importlib._bootstrap>", line 219, in _call_with_frames_removed
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/migrations/env.py", line 107, in <module>
    run_migrations_online()
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/migrations/env.py", line 101, in run_migrations_online
    context.run_migrations()
  File "<string>", line 8, in run_migrations
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/runtime/environment.py", line 851, in run_migrations
    self.get_context().run_migrations(**kw)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/alembic/runtime/migration.py", line 620, in run_migrations
    step.migration_fn(**kw)
  File "/Users/direcision/.pyenv/versions/3.8.10/envs/global/lib/python3.8/site-packages/airflow/migrations/versions/0e2a74e0fc9f_add_time_zone_awareness.py", line 44, in upgrade
    raise Exception("Global variable explicit_defaults_for_timestamp needs to be on (1) for mysql")
Exception: Global variable explicit_defaults_for_timestamp needs to be on (1) for mysql
```

mysql my.cnf에서 아래와 같이 수정

```conf
[mysqld]
character-set-server = utf8
collation-server = utf8_unicode_ci
skip-character-set-client-handshake
explicit_defaults_for_timestamp = 1
```

or 

```dockerfile
    platform: linux/x86_64
    command:
        - --character-set-server=utf8
        - --collation-server=utf8_unicode_ci
        - --explicit_defaults_for_timestamp=1
```

```
INFO  [airflow.models.dag] Sync 2 DAGs
INFO  [airflow.models.dag] Setting next_dagrun for example_subdag_operator.section-1 to None
INFO  [airflow.models.dag] Setting next_dagrun for example_subdag_operator.section-2 to None
Initialization done
```

```
airflow standalone
```