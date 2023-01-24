---
title: "[Hive] 변수, 파라미터 사용하는 방법"
categories: [하이브]
tags: [hive, parameter, variable, beeline, date]
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


### `beeline`에서 파라미터 넘길때

```sh
beeline --hivevar DATE='2021-01-01' -f query.hql
```

### 하이브 쿼리

```sql
# query.hql
set DATE;
SELECT
    *
FROM TABLE
WHERE date='${hivevar:DATE}'
```

* 이때 `set DATE;`를 잊지말자

### (응용) 실행하는 스크립트 (날짜 범위 지정해서 돌릴때, Backfill)

```sh
# backfill.sh
startdate='2021-07-01'
enddate='2021-07-07'

enddate=$( date -d "$enddate + 1 day" +%Y-%m-%d )
thedate=$( date -d "$startdate" +%Y-%m-%d )

while [ "$thedate" != "$enddate" ]; do
    printf 'The date is "%s"\n' "$thedate"
    beeline --hivevar DATE=$thedate -f query.hql
    thedate=$( date -d "$thedate + 1 days" +%Y-%m-%d ) # increment by one day
done

# backfill.sh
```