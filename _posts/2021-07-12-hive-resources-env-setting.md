---
title: "[Hive] Setting Resource Environment"
categories: [하이브]
tags: [hive, resource, environment]
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
set hive.auto.convert.join=false;
set hive.tez.container.size=32000;
set hive.tez.java.opts=-Xmx24000m;
set tez.am.java.opts=-Xmx24000m;
set tez.runtime.io.sort.mb=12000;
set tez.task.resource.memory.mb=32000;
set tez.am.resource.memory.mb=24000;
```