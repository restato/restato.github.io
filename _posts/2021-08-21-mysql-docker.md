---
title: "[MySQL] M1에서 MySQL Docker 실행"
categories: [데이터베이스]
tags: [db, rdb, docker, docker-compose, m1]
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

### Docker

```sh
docker pull mysql
Using default tag: latest
latest: Pulling from library/mysql
no matching manifest for linux/arm64/v8 in the manifest list entries
```

* `M1` 진짜 빡

```sh
docker pull --platform linux/x86_64 mysql
```

* <https://stackoverflow.com/questions/65456814/docker-apple-silicon-m1-preview-mysql-no-matching-manifest-for-linux-arm64-v8>

```sh
docker run --platform linux/x86_64 
-p 3306:3306 
--name mysql-container
-e MYSQL_ROOT_PASSWORD=<root_passwd>
-e MYSQL_DATABASE=<dbname>
-e MYSQL_USER=<username>
-e MYSQL_PASSWORD=<passwd>
-d mysql
```

### Docker Compose

```yaml
version: '3'
services:
  mysql:
    image: library/mysql:5.7
    container_name: mysql-container
    restart: always
    ports:
      - 3306:3306
    environment:
      MYSQL_ROOT_PASSWORD: play
      TZ: Asia/Seoul
    volumes:
      - ./db/mysql/data:/var/lib/mysql
      - ./db/mysql/init:/docker-entrypoint-initdb.d
      - ./db/mysql/mycustom.cnf:/etc/mysql/conf.d/custom.cnf
    platform: linux/x86_64
    command:
        - --character-set-server=utf8
        - --collation-server=utf8_unicode_ci
```

```sh
# 실행
docker-compose up -d
# 종료 
docker-compose down
```

### 로그 확인

```sh
docker-compose logs -f
docker-compose logs -f <mysql>
```

### 실행된 도커 컨테이너에 접속

```sh
docker exec -it mysql-container bash
```

### MySQL 접속

```
mysql -u root -p <passwd>
```