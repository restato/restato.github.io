---
title: "[Hive] 특정 필드(들)을 제외하고 컬럼 추출"
categories: [하이브]
tags: [hive, query]
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

```sql
set hive.support.quoted.identifiers=none;
SELECT `(date|name)?+.+` FROM <table_name>
```