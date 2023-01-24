---
title: "FastAPI에서 RedisCache 사용 방법 w\ docker-compose"
categories: [redis]
tags: [docker-compose, docker, redis, fastapi]
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

```yaml
# redis-server.yml
  redis:
    image: redis:alpine
    restart: always
    command: redis-server --port 6379
    container_name: redis 
    volumes:
      - ./data/redis/data:/data
      - ./data/redis/conf/redis.conf:/usr/local/etc/redis/redis.conf
      - ./data/redis/acl/users.acl:/etc/redis/users.acl
    command: redis-server /usr/local/etc/redis/redis.conf
    labels:
      - "name=redis"
      - "mode=standalone"
    ports:
      - 6379:6379
```

```
docker exec -it redis redis-cli
ping
key *
SET foot foo
```

```
CONNECT_FAIL: Redis server did not respond to PING message.
```

`networks`를 추가

<https://docs.docker.com/compose/networking/>

```python
LOCAL_REDIS_URL = "redis://redis:6379" # docker service name
logger = logging.getLogger(__name__)
app = FastAPI(title='vagazine')

@app.on_event("startup")
def startup():
    redis_cache = FastApiRedisCache()
    redis_cache.init(
        host_url=os.environ.get("REDIS_URL", LOCAL_REDIS_URL),
        prefix="myapi-cache",
        response_header="X-MyAPI-Cache",
        ignore_arg_types=[Request, Response, Session]
    )

@app.get("/items")
@cache(expire=30)
def read_items():
    return {}
```

```
*229 connect() failed (111: Connection refused) while connecting to upstream
```

### 참고

* <https://stackoverflow.com/questions/30547274/docker-compose-anyway-to-specify-a-redis-conf-file>
* <https://github.com/redis-developer/fastapi-redis-tutorial/blob/master/docker-compose.yaml>
* <https://github.com/cancerDHC/ccdh-terminology-service/pull/53/files1>