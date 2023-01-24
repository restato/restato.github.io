---
title: "[MySQL] Workbench UI Docker"
categories: [데이터베이스]
tags: [mysql, workbench, ui, docker]
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

### Workbench

```yaml
version: "2.1"
services:
  mysql-workbench:
    image: ghcr.io/linuxserver/mysql-workbench
    container_name: mysql-workbench
    environment:
      PUID: 1000
      PGID: 1000
      TZ: Asia/Seoul
    volumes:
      - ./config:/config
    ports:
      - 3000:3000
    cap_add:
      - IPC_LOCK
    restart: unless-stopped
    platform: linux/x86_64
```

```
```

### 참고

* https://hub.docker.com/r/linuxserver/mysql-workbench