---
title: "[Docker] 자주 사용하는 CLI, FLAG"
categories: [도커]
tags: [docker, cli, flag]
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

### Build Flag

```
# e.g. docker image build --tag <tab_name> .
--tag: 태그 이름
```

### Container Flag

```
# e.g. docker container --detach --publish 8088:80 <docker-image-name>
--detach(= -d): 컨테이너를 백그라운드에서 실행하여 컨테이너 ID를 출력
--publish: 컨테이너의 포트를 호스트 컴퓨터에 공개

# e.g. docker container run --interactive --tty <docker-image-name>
--interactive: 컨테이너에 접속된 상태
--tty: 터미널 세션을 통해 컨테이너를 조작

# e.g. docker container logs <container_name>
--name: 컨테이너의 이름을 지정

# e.g. docker container run --env TARGET=$TARGET <docker_image_name>
--env: 환경변수를 넘길때 사용
```

### CLI Container

```bash
# 컨테이너에서 실행 중인 프로세스의 목록을 확인
docker container top <docker_id>

# 대상 컨테이너의 상세한 정보 확인
docker container inspect <docker_id>
# 실행 중인 컨테이너의 상태를 확인 CPU, 메모리, 네크워크, 디스크 사용량을 알 수 있다.
docker container stats

# 명령을 실행해 상태와 상관없이 모든 컨테이너의 목록을 확인
docker continae ls --all

# 모든 컨테이너를 삭제
# 도커는 종료해도 컨테이너는 남아있기 때문에 디스크 공간을 차지하고 있음
docker container rm --force $(docker container ls --all --quite)

# 환경변수 추가해서 실행
docker container run -e TARGET=$TARGET -e INTERVAL=$INTERVAL <docker_image>
```


### CLI images

```bash
# w로 시작하는 태그명을 가진 이미지 목록을 확인
docker image ls 'w*'

# 이미지의 히스토리 확인하기
docker image history <image_name>
```