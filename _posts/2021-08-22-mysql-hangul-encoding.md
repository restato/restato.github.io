---
title: "[MySQL] Docker로 실행했을때 한글 깨짐"
categories: [데이터베이스]
tags: [mysql, encoding]
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

### 해결방법

```
# docker container
docker run –name mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=password -d mysql:5.7 –character-set-server=utf8 –collation-server=utf8_unicode_ci
```

```yaml
# docker-compose
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


### Encoding 문제

```
mysql> select * from transaction limit 10;
+-------+-----------+--------------------+----------------------+------------------+------------+-----------+-------------------+-----------------+----------------+--------+-------+------------------------------+---------------+-------+------+-----------+-------+----------------------+--------------------+---------------------+------------------------+
| index | area_code | transaction_amount | year_of_construction | transaction_year | legal_dong | apt_name  | transaction_month | transaction_day | dedicated_area | jibun  | floor | date_of_cause_for_dismantled | is_dismantled | si    | gu   | sigungu   | area  | dedicated_area_level | amount_per_area    | transaction_date    | description            |
+-------+-----------+--------------------+----------------------+------------------+------------+-----------+-------------------+-----------------+----------------+--------+-------+------------------------------+---------------+-------+------+-----------+-------+----------------------+--------------------+---------------------+------------------------+
|     0 |     11110 |              80000 |                 2002 |             2021 | ???        | ??(101?)  |                 6 |              15 |          84.82 | 6-13   |     1 | 21.08.17                     | O             | ????? | ???  | ????? ??? | 25.66 | 60-85m2??            |  3117.692907248636 | 2021-06-15 00:00:00 | ????? ??? ??? ?? 101?  |
|     1 |     11110 |             175000 |                 2004 |             2021 | ???        | ????      |                 6 |              14 |         201.82 | 110-15 |     3 | NULL                         | NULL          | ????? | ???  | ????? ??? | 61.05 | 85m2??               | 2866.5028665028667 | 2021-06-14 00:00:00 | ????? ??? ??? ????     |
|     2 |     11110 |              95000 |                 2006 |             2021 | ???        | ???????   |                 6 |              13 |          92.81 | 48-2   |    15 | NULL                         | NULL          | ????? | ???  | ????? ??? | 28.08 | 85m2??               |  3383.190883190884 | 2021-06-13 00:00:00 | ????? ??? ??? ???????  |
|     3 |     11110 |             105000 |                 2006 |             2021 | ???        | ???????   |                 6 |              25 |         106.81 | 48-2   |     8 | NULL                         | NULL          | ????? | ???  | ????? ??? | 32.31 | 85m2??               |  3249.767873723305 | 2021-06-25 00:00:00 | ????? ??? ??? ???????  |
|     4 |     11110 |              53000 |                 1999 |             2021 | ???        | ??        |                 6 |               6 |          59.28 | 639-50 |     5 | NULL                         | NULL          | ????? | ???  | ????? ??? | 17.93 | 60m??                | 2955.9397657557165 | 2021-06-06 00:00:00 | ????? ??? ??? ??       |
|     5 |     11110 |              74500 |                 1992 |             2021 | ???        | ????1     |                 6 |              12 |           54.7 | 702    |     9 | NULL                         | NULL          | ????? | ???  | ????? ??? | 16.55 | 60m??                |  4501.510574018127 | 2021-06-12 00:00:00 | ????? ??? ??? ????1    |
|     6 |     11110 |              64400 |                 1993 |             2021 | ???        | ????2     |                 6 |              18 |           54.7 | 703    |     3 | NULL                         | NULL          | ????? | ???  | ????? ??? | 16.55 | 60m??                |  3891.238670694864 | 2021-06-18 00:00:00 | ????? ??? ??? ????2    |
|     7 |     11110 |              86000 |                 1992 |             2021 | ???        | ????1     |                 6 |              19 |          79.87 | 702    |     8 | NULL                         | NULL          | ????? | ???  | ????? ??? | 24.16 | 60-85m2??            | 3559.6026490066224 | 2021-06-19 00:00:00 | ????? ??? ??? ????1    |
|     8 |     11110 |              56500 |                 2002 |             2021 | ???        | MID??(6?) |                 6 |              19 |          59.04 | 601-7  |     6 | NULL                         | NULL          | ????? | ???  | ????? ??? | 17.86 | 60m??                | 3163.4938409854426 | 2021-06-19 00:00:00 | ????? ??? ??? MID?? 6? |
|     9 |     11110 |              69900 |                 1993 |             2021 | ???        | ????2     |                 6 |              19 |          64.66 | 703    |     7 | NULL                         | NULL          | ????? | ???  | ????? ??? | 19.56 | 60m??                |  3573.619631901841 | 2021-06-19 00:00:00 | ????? ??? ??? ????2    |
+-------+-----------+--------------------+----------------------+------------------+------------+-----------+-------------------+-----------------+----------------+--------+-------+------------------------------+---------------+-------+------+-----------+-------+----------------------+--------------------+---------------------+------------------------+
10 rows in set (0.05 sec)
```

### 현재 상태 확인

```sql
mysql> status
--------------
/usr/bin/mysql  Ver 14.14 Distrib 5.7.35, for Linux (x86_64) using  EditLine wrapper

Connection id:		16
Current database:	realestate
Current user:		root@localhost
SSL:			Not in use
Current pager:		stdout
Using outfile:		''
Using delimiter:	;
Server version:		5.7.35 MySQL Community Server (GPL)
Protocol version:	10
Connection:		Localhost via UNIX socket
Server characterset:	utf8mb4
Db     characterset:	utf8
Client characterset:	latin1 <--- 문제
Conn.  characterset:	latin1 <--- 문제
UNIX socket:		/var/run/mysqld/mysqld.sock
Uptime:			1 day 5 min 2 sec

Threads: 1  Questions: 122  Slow queries: 0  Opens: 130  Flush tables: 1  Open tables: 121  Queries per second avg: 0.001
```

### 사용가능한 인코딩 확인

```sql
mysql> show character set;
+----------+---------------------------------+---------------------+--------+
| Charset  | Description                     | Default collation   | Maxlen |
+----------+---------------------------------+---------------------+--------+
| big5     | Big5 Traditional Chinese        | big5_chinese_ci     |      2 |
| dec8     | DEC West European               | dec8_swedish_ci     |      1 |
| cp850    | DOS West European               | cp850_general_ci    |      1 |
| hp8      | HP West European                | hp8_english_ci      |      1 |
| koi8r    | KOI8-R Relcom Russian           | koi8r_general_ci    |      1 |
| latin1   | cp1252 West European            | latin1_swedish_ci   |      1 |
| latin2   | ISO 8859-2 Central European     | latin2_general_ci   |      1 |
| swe7     | 7bit Swedish                    | swe7_swedish_ci     |      1 |
| ascii    | US ASCII                        | ascii_general_ci    |      1 |
| ujis     | EUC-JP Japanese                 | ujis_japanese_ci    |      3 |
| sjis     | Shift-JIS Japanese              | sjis_japanese_ci    |      2 |
| hebrew   | ISO 8859-8 Hebrew               | hebrew_general_ci   |      1 |
| tis620   | TIS620 Thai                     | tis620_thai_ci      |      1 |
| euckr    | EUC-KR Korean                   | euckr_korean_ci     |      2 |
| koi8u    | KOI8-U Ukrainian                | koi8u_general_ci    |      1 |
| gb2312   | GB2312 Simplified Chinese       | gb2312_chinese_ci   |      2 |
| greek    | ISO 8859-7 Greek                | greek_general_ci    |      1 |
```

### 데이터베이스 인코딩 변경

```
alter database [데이터베이스명] default character set UTF8;
```

### Config 변경

```
[client]
default-character-set=utf8
 
[mysql]
default-character-set=utf8
 
[mysqld]
collation-server = utf8_unicode_ci
init-connect='SET NAMES utf8'
character-set-server = utf8
```
