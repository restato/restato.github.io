---
title: "[Docker] Dockerfile HealthCheck, DependencyCheck"
categories: [도커]
tags: [docker, healthcheck, dependencycheck]
mermaid: true
math: true
comments: true
pin: false
---

### HEALTHCHECK

HEALTHCEHCK instruction을 사용해 컨테이너에서 동작중인 애플리케이션의 상태가 정상인지 확인할 수 있다.

```yaml
FROM ...
ENTRYPOINT ...
HELATHCHECK CMD curl --fail http://localhost/health
```

아래와 같이 확인해보면 도커가 이상 상태를 감지하는지 확인한다. `HEALTHCEHCK` instruction을 사용하지 않았다면 도커가 이상 상태를 감지하지 못한다.

```bash
docker container ls 
```

### Dependency Check

healthcheck instruction과 다르게 CMD를 할때 체크하도록 추가하는 방식

```yaml
CMD curl --fail http://localhost/health && \
  <run application>
```

### 커스텀 유틸리티

위에서 사용한 curl은 테스트 목적이고, 보안 정책상의 이유로 이미지에 curl을 포함시킬 수 없다.
멀티 스테이지 빌드 과정

* builder
* (추가) check-builder
* app
  * copy util (check-buidler의 결과)
  * copy app (builder의 결과)
  * HEALTHCHECK
  * CMD app

### Docker Compose에서의 HleathCheck와 DependencyCheck

Dockerfile에 HEALTHCEHCK가 정의되어 있다면 아래와 같이 사용

```yaml
api:
  image: <image_name>
  ports:
    - 8080:80
  healthcheck:
    interval: 5s
    timeout: 1s
    retries: 2
    start_period: 5s # 컨테이너 실행 후 첫 헬스 체크를 실시하는 시간 간격을 의미
  networks:
    - network
```

Dockerfile에 HEALTHCHECK가 정의되어 있지 않다면 아래와 같이 사용

```yaml
api:
  image: <image_name>
  restart: on-failure # 컨테이너가 예기치 않게 종료되면 컨테이너를 재시작한다.
  ports:
    - 8080:80
  healthcheck:
    test: ["CMD", "app", <healthcheck>]
    interval: 5s
    timeout: 1s
    retries: 2
    start_period: 10s
  networks:
   - network

```

Healthcheck는 주기적으로 자주 실행되므로 시스템에 부하를 주는 내용이어서는 안 된다. DependencyCheck는 애플리케이션 시작 시에만 실행되기 때문에 리소스에 신경 쓸 필요 없다.