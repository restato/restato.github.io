---
title: "[Docker] Docker Image Layer 이해하기"
categories: [도커]
tags: [docker, image, image layer]
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

Dockerfile은 instruction으로 구성되어 있고, 아래와 같이 이미지의 instruction을 확인할 수 있다.
instruction과 이미지 레이어는 1:1 관계를 갖는다.

```bash
docker image history <image_name>
```

이미지 레이어를 잘 활용해야 도커를 효율적으로 활용을 할 수 있다. 도커 이미지는 이미지 레이어가 모인 논리적 대상이다. 레이어는 도커 엔진의 캐시에 물리적으로 저장된 파일이다. 이미지 레이어는 여러 이미지와 컨테이너에서 공유되기 때문이다.

`FROM`을 사용하는 이유가 어떤 이미지 기반에서 이미지를 만들지에 대한 내용이다. 운영체제와 런타임을 포함하는 이미지로 부터 생성한다면 우리는 실제 동작하는 스크립트의 크기 만큼 이미지가 필요하다. 만약 운영체제, 런타임, 그리고 스크립트를 모두 포함해 이미지를 생성한다면 이미지 크기가 커질것이다. 아래 명령어를 통해 이미지 크기 확인이 가능하다. 하지만 아래 이미지는 논리적 용량이지 해당 이미지가 실제로 차지하는 디스크 용량을 나타낸것이 아니다.

```bash
# 실제 디스크 용량을 차지하는 것은 아니다. 
docker image ls 
```

이미지 레이어를 이용해 Dockerfile 스크립트를 최적화해 도커 이미지의 용양을 줄이고 빌드를 빠르게 만드는 기법에서 특히 잘 활용할 수 있다.