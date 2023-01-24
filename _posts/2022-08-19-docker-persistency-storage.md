---
title: "[Docker] Persistency Storage"
categories: [도커]
tags: [docker, persistency, storage]
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

### 컨테이너 레이어

컨테이너는 stateless application에게는 최적의 실행 환경이지만, stateful application에서는 디스크 공간이 필요
컨테이너가 종료되어도 파일 시스템은 삭제되지 않기 때문에 복사가 가능하다.

```bash
docker container run --name container_1 <docker_image>
docker container run --name container_2 <docker_image>
```

컨테이너를 종료한 이후에 아래 명령어로 container에서 local로 데이터 복사가 가능

```bash
docker container cp container_1:/data1.txt data1.txt
docker container cp container_2:/data2.txt data2.txt
```

컨테이너의 파일 시스템은 단일 디스크(/dev/sda1)다. 이 디스크는 도커가 여러 출처로부터 합쳐 만들고 컨테이너에 전달한 가상 파일 시스템이다. 이 출처는 기본적으로 

* 이미지 레이어: 컨테이너가 공유 (RO)
* 컨테이너의 기록 가능 레이어: 컨테이너마다 다르다.
  * 컨테이너와 같은 생애주기를 갖는다.
  * 컨테이너가 삭제되면 데이터도 삭제 (종료 != 삭제)

### copy-on-write

`copy-on-write` 방법을 사용해 읽기 전용 레이어의 파일을 수정할 수 있다. (이미지 레이어)
수정하기 위해서 도커가 파일을 쓰기 가능한 레이어로 복사해 온 다음 쓰기 가능 레이어에서 파일을 수정합니다.
이 방법으로 도커가 스토리지를 매우 효율적으로 사용할 수 있는 비법이다. 하지만 컨테이너가 삭제되면 수정된 내용도 함께 삭제된다.

### 도커 볼륨과 마운트

도커 볼륨과 마운트는 컨테이너와는 별개의 생애주기를 갖는다. 그러므로 컨테이너가 대체되어도 지속되어야 할 데이터를 저장할 수 있다.
persistency가 필요한 유상태 애플리케이션을 컨테이너로 실행하려면 볼륨을 사용해야 한다. 볼륨을 만드는 방식은 두가지이다.

* 수동으로 직접 볼륨을 생성해 컨테이너와 연결
* Dockerfile 스크립트에서 VOLUME instruction을 사용
  * 자동으로 볼륨을 생성해 컨테이너와 연결

```bash
docker container run --name <app_name> -d -p 80:80 <docker_image_name>
docker container inspect --format '{{.Mounts}}' <app_name>
docker volume ls
```

### 바인드 마운트

호스트 컴퓨터 파일 시스템의 디렉토리를 컨테이너 파일 시스템의 디렉토리로 만든다. 볼륨과 다르게 바인드 마운트는 도커를 사용하는 입장에서는 컨테이너가 호스트 컴퓨터의 파일에 직접 접근할 수 있고 그 반대도 가능해진다. 즉, 바운드 마운트는 양방향으로 동작한다. 바인드 마운트를 사용하면 호스트 컴퓨터 파일에 접근하기 위해 권한 상승이 필요하다. 그래서 Dockerfile 스크립트에서 USER instruction을 사용해 컨테이너에 관리자 권한을 부여

```bash
docker container run --mount type=bind,source=$source,target=$target -d -p 80:80 <docker_image_name>
```
