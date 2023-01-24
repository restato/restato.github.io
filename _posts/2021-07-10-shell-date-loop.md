---
title: "[Shell] 날짜 범위 지정해서 실행"
categories: [쉘]
tags: [shell, date, loop, range]
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

* 입력
  * `staratdate`
  * `enddate`

```sh
startdate='20210701'
enddate='20210707'

enddate=$( date -d "$enddate + 1 day" +%Y%m%d )   # rewrite in YYYYMMDD format
                                                  #  and take last iteration into account
thedate=$( date -d "$startdate" +%Y%m%d )
while [ "$thedate" != "$enddate" ]; do
    printf 'The date is "%s"\n' "$thedate"
    beeline --hivevar DATE=$thedate -f query.hql
    thedate=$( date -d "$thedate + 1 days" +%Y%m%d ) # increment by one day
done
```

```sh
startdate='2021-07-01'
enddate='2021-07-07'

enddate=$( date -d "$enddate + 1 day" +%Y-%m-%d )
thedate=$( date -d "$startdate" +%Y-%m-%d )

while [ "$thedate" != "$enddate" ]; do
    printf 'The date is "%s"\n' "$thedate"
    beeline --hivevar DATE=$thedate -f query.hql
    thedate=$( date -d "$thedate + 1 days" +%Y-%m-%d ) # increment by one day
done

```