---
title: "[Docker] Dockerfile 작성하기"
categories: [도커]
tags: [docker, dockerfile]
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

Dockerfile은 일련의 instruction 으로 구성돼 있다.

### Instruction

* `FROM`: 시작 이미지
* `ENV`: 환경 변수 값을 지정하기 위한 instruction. KEY = VALUE 포맷으로 지정
* `WORKDIR`: 컨테이너 이미지 파일 시스템에 디렉토리를 생성하고, 해당 디렉토리를 작업 디렉토리로 지정하는 instruction
* `COPY`: 로컬 파일 시스템의 파일 혹은 디렉토리를 컨테이너 이미지로 복사하는 instruction
* `CMD` : 도커가 이미지로부터 컨테이너를 실행했을 때 실행할 명령을 지정하는 instruction

instruction과 이미지 레이어는 1:1 관계를 갖는다. 레이어 확인을 위해서는 아래와 같이 확인

```bash
docker image history <image_name>
```

이미지 레이어를 잘 활용해야 도커를 효율적으로 활용을 할 수 있다.

### Build Dockerfile

```bash
docker image build --tag <tab_name> <context_path>
```

`context_path` 는 Dockerfile 및 이미지에 포함시킬 파일이 위치한 경로다. `.` 은 현재 작업 디렉토리를 의미한다.