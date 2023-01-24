---
title: "[Hive] Timestamp 쿼리 정리" 
categories: [하이브]
tags: [hive, sql, timestamp]
---

### `TIMESTAMP`로 변환

```sql
SELECT CAST(UNIX_TIMESTAMP("2021-03-25T15:32:22+09:00", "yyyy-MM-dd'T'HH:mm:ss") * 1000 AS TIMESTAMP)

-- Query Result
2021-03-25 15:32:22.0
```

### `HH` 추출

```sql
SELECT CAST(DATE_FORMAT(request_timestamp, 'HH') AS INT) AS hh
```

### `STRING > TIMESTAMP`

```sql
SELECT FROM_UNIXTIME(TO_UNIX_TIMESTAMP(column_name, 'yyyy-MM-dd HH:mm:ss'))
```

### `DIFF`

```sql
SELECT DATEDIFF(FROM_UNIXTIME(TO_UNIX_TIMESTAMP(column_name, 'yyyy-MM-dd HH:mm:ss')), FROM_UNIXTIME(TO_UNIX_TIMESTAMP(column_name, 'yyyy-MM-dd HH:mm:ss'))) AS diff_days
```