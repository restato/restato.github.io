---
title: "Load Balancer"
categories: [쿠버네티스]
tags: [kubernetes, load-balancer]
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

## L4/L7 (로드밸런서)

* 부하 분산, 로드밸런싱은 셋이상의 중앙처리장치 혹은 저장장치와 같은 컴퓨터 자원들에게 작업을 나누는 것을 의미
* 로드밸런서 종류
  * 운영체제 로드밸런서: 물리적 프로세서 간에 작업을 스케줄링
  * 네트워크 로드밸런서
* L4(Transport Layer)
  * Transport Layer(IP + Port) Load Balancing
  * TCP, UDP Protocol
  * Round Robin 방식 사용
  * 장점은 Port기반 스위칭 지원, VIP를 이용하여 여러대를 한대로 묶어 부하를 분산시킨다.
* L7(Application Layer)
  * Application Layer(사용자 Request) Load Balancing
  * HTTP, FTP, SMTP Protocol