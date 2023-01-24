---
title: "Spark 테이블을 Hive 테이블로 생성"
categories: [스파크]
tags: [spark, hive, table, external]
---

### Spark 결과를 Hive 테이블로 생성

* External 테이블로 생성

```sql
DROP TABLE <table_name>;
CREATE EXTERNAL TABLE <db_name>.<table_name>(
	col1 STRING,
	col2 STRING
)
STORED AS ORC
LOCATION '<hdfs_path>'
TBLPROPERTIES ('external.table.purge'='true'); --테이블 삭제시 함께 데이터도 삭제되도록
```

```python
# pyspark
db_name = # db_name
table_name = # table_name
df.registerTempTable('temp_table')
spark.sql(f'INSERT OVERWRITE {db_name}.{table_name} SELECT * FROM temp_table')
```