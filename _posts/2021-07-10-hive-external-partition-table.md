---
title: "[Hive] External Partitioned Table (CREATE, INSERT, ALTER)"
categories: [하이브]
tags: [hive, external, insert, query, unicode, drop, partitioned]
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


### External Partitioned Table 생성

```sql
CREATE DATABASE {db} LOCATION 'hdfs://<hdfs_path>';

DROP TABLE {db}.{table};
CREATE EXTERNAL TABLE {db}.{table}
(
    COl1 STRING,
    COl2 STRING,

)
PARTITIONED BY (dt STRING)
ROW FORMAT DELIMITED 
FIELDS TERMINATED BY '\u0001'    
STORED AS TEXTFILE
LOCATION 'hdfs://<hdfs_path>';

MSCK REPAIR TABLE {db}.{table}
```

이때 `FIELDS TERMINATED BY`에 들어가는 구분자가 `\t`인 경우 컬럼 값에 따라 필드가 밀릴 수 있으니 보통은 사용하지 않는 `UNICODE(^A)`를 사용하는게 좋다. HIVE테이블을 내려받아 파이썬에서 읽을때는 아래 코드 참고

### INSERT OVERWRITE

```sql
INSERT OVERWRITE TABLE {db].{table} PARTITION(dt = ${hiveconf:DATE})
SELECT
   (...)
```

### DROP PARTITION

```sql
ALTER TABLE {db}.{table} DROP IF EXISTS PARTITION (dt='2021-07-01')
```

### 파이썬에서 `\u0001`로 구분해서 읽기

```python
import pandas as pd
pdf = pd.read_csv('log', delimiter='\u0001')
# or 
for idx, x in enumerate(open('log').readlines()):
  tokens = x.split('\u0001')
```