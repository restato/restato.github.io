---
title: "[FastAPI] Bunnybook 프로젝트 코드 구조 파악"
categories: [파이썬]
tags: [fastapi, bunnybook, python, awesome]
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

<https://github.com/mjhea0/awesome-fastapi> 에서 bunnybook이라는 오픈소스를 발견했는데 FastAPI와 React를 사용했다고 해서 한번 프로젝트 구성 및 개발 스터디겸 코드를 살펴보기로 했다.

* <https://github.com/pietrobassi/bunnybook#a-tiny-social-network-for-bunnies-built-with-fastapi-and-reactrxjs>
  * neo4j 이미지를 "neo4j:4.4-community"로 변경 M1에서 동작시키기 위해서


```
Pulling graph (neo4j:4.3.2-community)...
4.3.2-community: Pulling from library/neo4j
ERROR: no matching manifest for linux/arm64/v8 in the manifest list entries
```