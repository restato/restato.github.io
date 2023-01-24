---
title: "Kubernetes Overview"
categories: [쿠버네티스]
tags: [kubernetes, overview]
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


### Kubernetes

* 컨테이너 플랫폼, 마이크로서비스 플랫폼, 이식성 있는 클라우드 플랫폼
* Stateless, Stateful, 데이터 처리등 다양한 어플리케이션 타입을 컨테이너로 구동할 수 있게 해줌
  * stateless: 프로세스 또는 애플리케이션은 격리된 것으로 간주 (자동판매기와 같은) - 상태가 필요 없는
  * stateful: 온라인 뱅킹이나 이메일처럼 여러번 반환될수있는것, 이전 트랜잭션의 컨텍스트에 따라 수행, 현재 트랜잭션의 컨텍스트에서 발생한 상황에 영향을 받는다.
  * https://www.redhat.com/ko/topics/cloud-native-apps/stateful-vs-stateless
* Immutable
  * Container는 띄우고 나서 변하지 않음
  * Image로서 태어난 runtime이기 때문에
* Container를 관리하기 위해서는 Kubernetes가 필요하다.
* 서비스 메시
* api gateway
  * microservice 간에 대화를 하도록 고용옹어가 api
  * 보안요소, 사용자컨트롤, 트래픽제어, 모니터링요소를 담당
* polyglob
  * 파이썬은 ML, nodejs는 백앤드와 같이 적절한 환경으로 개발하고 합치는