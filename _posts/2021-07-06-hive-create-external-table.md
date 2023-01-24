---
title: "[Hive] External 테이블 생성 쿼리"
categories: [하이브]
tags: [hive, data-engineering, external, sql]
---

데이터베이스 생성시에 경로를 설정할때

```sql
CREATE DATABASE <db_name> LOCATION '<hdfs_path>';
```

EXTERNAL 테이블 생성할때

```sql
CREATE EXTERNAL TABLE <table_name>
(
	col1 type1,
	col2 type2,
	col3 type3
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.JsonSerDe'
LOCATION '<hdfs_path>'
```

