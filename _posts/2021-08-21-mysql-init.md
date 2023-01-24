---
title: "[MySQL] 초기 작업"
categories: [데이터베이스]
tags: [mysql, init]
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


### CREATE USER

```sh
CREATE USER 'username'@'localhost' IDENTIFIED BY 'password';
CREATE USER 'play'@'localhost' IDENTIFIED BY 'play2';
```

### 테이블 권한

```sh
grant all privileges on *.* to 'username'@'localhost';
grant all privileges on *.* to 'play'@'localhost';
# 모든 IP에서 접속 가능하도록
grant all privileges on *.* to 'play'@'%'; 
# 설정 적용
flush privileges;
```

### 데이터베이스 생성

```sh
# UTF8 설정을 해야 한글이 깨지지 않는다.
CREATE DATABASE db_name DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
CREATE DATABASE realestate DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
```

### 데이터베이스 확인

```sh
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| mysql              |
| performance_schema |
| realestate         |
| sys                |
+--------------------+
5 rows in set (0.05 sec)
```

### 테이블 생성

```sql
CREATE TABLE `users` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `email` varchar(255) COLLATE utf8_bin NOT NULL,
    `password` varchar(255) COLLATE utf8_bin NOT NULL,
    PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin
AUTO_INCREMENT=1 ;
```

### 사용자 확인

```sh
mysql> select user, host from mysql.user;
+---------------+-----------+
| user          | host      |
+---------------+-----------+
| root          | %         |
| mysql.session | localhost |
| mysql.sys     | localhost |
| play          | localhost |
| root          | localhost |
+---------------+-----------+
5 rows in set (0.01 sec)
```

* `host`의 값이 `%`: 모든 IP에서 접근 가능

### MySQL Conf

```sh
apt-get update
apt-get -y install vim
vi /etc/mysql/mysql.conf.d/mysqld.cnf
```


### 데이터베이스 경로

```sh
rm -rf /var/lib/mysql/<db_name>
```

### 재시작

```sh
service mysql restart
```