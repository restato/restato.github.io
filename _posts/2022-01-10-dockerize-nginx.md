---
title: Nginx Docker에 띄우기 (+HTTPS)
categories: [Docker]
tags: [docker, nginx, https]
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

### Nginx with Docker

```sh
docker run \
    --rm \
    --name nginx \
    -v ~/nginx/nginx.conf:/etc/nginx/nginx.conf:ro \
    -p 8080:80 \
    nginx # -d

docker run -d -p 80:80 --read-only -v $(pwd)/nginx/nginx-cache:/var/cache/nginx -v $(pwd)/nginx/nginx-pid:/var/run nginx
```

<http://localhost/>

* https://hub.docker.com/_/nginx
* https://github.com/wmnnd/nginx-certbot
* https://pentacent.medium.com/nginx-and-lets-encrypt-with-docker-in-less-than-5-minutes-b4b8a60d3a71
* https://github.com/wmnnd/nginx-certbot/issues/52