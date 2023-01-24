---
title: elasticsearch에서 자주 사용하는 api 모음
tags: [elasticsearch, api]
categories: [elasticsearch]
---

`http://localhost:9200/_cat`을 들어가면 사용가능한 목록이 나온다.

### check document counts

```
http://localhost:9200/_cat/count/graphapt-rent
```

### check cluster health

```
https://localhost:9200/_cat/_health
```
