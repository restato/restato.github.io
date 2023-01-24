---
title: "[Docker] Golden Image"
categories: [도커]
tags: [docker, golden, image]
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

도커는 이미지는 취약점 탐지 등의 승인 절차를 거쳐 공개된 이미지를 사용하는게 좋다.

* 공식 이미지: openjdk:11.0.3
* 골든 이미지(golden image): openjdk
  * 기반 이미지로 특정 버전의 공식 이미지를 기반으로 하며, 필요에 따라 수정되고 이미지의 참조의 명명 체계를 다르게
* 골든 이미지로 신뢰성 있는 이미지를 생성

`골든 이미지`는 공식 이미지를 기반 이미지로 삼아 인증서나 환경 설정값 등 자신이 필요한 설정을 추가한 것

기반 이미지부터 우리가 만든 이미지라는 차이점이 있다. 공식 이미지는 매달 새 버전이 릴리즈 되지만, 골든 이미지는 업데이트 주기를 우리가 마음대로 정할 수 있다. 또한, 지속적 통합 파이프라인에서 Dockerfile 스크립트를 확인하는 방법으로 골든 이미지 사용을 강제하는 것도 좋은 방법이다.