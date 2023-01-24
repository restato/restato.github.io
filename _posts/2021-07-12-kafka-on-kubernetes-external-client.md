---
title: "외부(External Client)에서 Kafka on Kubernetes 연결" 
categories: [카프카]
tags: [kafka, kubernetes, k8s]
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

## 준비

* Kafka Client [Kafkacat](https://github.com/edenhill/kafkacat)
* cp-helm-charts [cp-helm-charts](https://github.com/confluentinc/cp-helm-charts)
  * Kafka 설치할때 사용

## Default Configuration

* `cp-helm-charts`에서 제공하는 기본 구성을 사용하여 `kafka`를 설치하고 `Kafkacat`을 사용하여 연결 시도
* External IP Address가 활성화되어 있지 않기 때문에 기본적으로 브로커와 연결할수 없다. (=entry point를 찾을 수 없다.)
* `get svc` 카프카가 설치된 클러스터에서 실행해서 확인 (External-IP가 `<none>`)

## Configuration Changes

* k8s에서 동작하는 kafka broker에 접근하기 위해서는 2개의 configuration 변경이 필요

```sh
cd <cp-helm-charts>/charts/cp-kafka
```

```yaml
# values.yaml 을 아래와 같이 수정
nodeport:
  enabled: true # 기본값은 false
```

`servicePort` 및 `firstLIstenerPort`는 그대로 둔다.

```yaml
servicePort: 19092
firstListenerPort: 31090
```

위 변경사항은 적용하기 위해 아래와 같이 수행

```sh
cd <cp-helm-charts>
helm upgrade <installation-name> .
```

성공적으로 적용되면 이 구성은 클라이언트를 브로커에 연결하는 데 사용할 수 있는 클러스터에 노드 포트 서비스를 생성한다.

```sh
get svc
```

노드 포트 서비스가 새롭게 생성된다. 해당 서비스에 연결하기 위해 클러스터를 구성하는 모든 노드의 외부 IP를 사용할 수 있다. 아래 명령을 상요하여 노드의 외부 IP를 가져오고 목록에서 하나의 IP주소를 선택

```sh
kubectl get nodes -o wide
```

`<ExternalIP>`는 선택된 외부 IP를 의미한다. 이제는 `<ExternalIP>:31090`으로 `Kafkacat` 클라이언트로 접속해보면 접속이 된다.

```sh
> kafkacat -L -b <ExternalIP>:31090
Metadata for all topics (from broker -1: <ExternalIP>:31090/bootstrap):
 1 brokers:
  broker 0 at <InternalIP>:31090 (controller)
 49 topics:
.....(details of topics)
```

브로커가 클라이언트에게 반환하는 메타데이터(향후 통신에 사용됨)는 클러스터 내부에 있는 IP주소를 나타냅니다. (아직 외부 listeners를 구성하지 않았기 때문에)

```sh
broker 0 at <InternalIP>:31090 (controller)
```

따라서 클라이언트가 브로커에 메시지 게시 요청을 보낼 때 이 내부 IP주소와 통신할 수 없고 메시지 publishing이 실패한다. (브로커와 성공적인 연결을 보더라도) 아래 설정이 추가로 필요하다.

## Configure Kafka Broker to return the correct metadata to enable further communication with the clients.

`values.yaml` 파일을 수정

```sh
cd <cp-helm-charts>/charts/cp-kafka
```

```yaml
"advertised.listeners": |-
 EXTERNAL://<ExternalIP>:31090 # External 앞에 공백이 있어야 한다.
```

최종 구성의 internal listeners 목록에 external listener에 추가된다.

```sh
cd <cp-helm-charts>
helm upgrade <instllation-name> .
```

다시 Kafkacat을 이용해서 접속해보면

```sh
> kafkacat -L -b 35.198.199.180:31090                                                                                                                                                                                                                                            
Metadata for all topics (from broker 0: <ExternalIP>:31090/0):
 1 brokers:
  broker 0 at <ExternalIP>:31090 (controller)
 49 topics:
.....(details of topics)
```

* 출력에 초기 `internal IP`가 아닌 `external IP`가 있는 컨트롤러 주소가 표시
* 완료되면 클라이언트는 클러스터의 브로커에서 메타데이터를 성공적으로 가져올 수 있을 뿐만 아니라 메시지를 publish하고, subscribe

## Kafkacat 사용해보자

```sh
# Broker 체크
docker run -it --network=host edenhill/kafkacat:1.6.0 -b <broker> -L
# Consuming
docker run -it --network=host edenhill/kafkacat:1.6.0 kafkacat -b <broker> -t <topic>
```

## Headless Service (k8s 내부에서만 접근이 가능한 서비스)

* Headless 서비스는 해당 Pod Set에 대해 직접 접근 가능한 고유 IP를 부여한다.
* 각 broker를 위해 stable network ID를 제공
* 생성된 ID는 k8s 내부에만 존재하므로 headless service로는 해결할 수 없다.

### POSSIBLE SOLUTION: Kafka REST Proxy

* 브로커에게 직접 접근하지 않고, REST API를 통해 접근
* 단점
  * 문제가 해결되지만 시스템에 복잡성 수준이 추가
  * Kafka는 클라이언트가 브로커 상태(상태는 Rest Proxy를 통해 전달되지 않음)를 인식하고 브로커와 직접(중개자를 통하지 않음) 통신하도록 설계되었기 때문에 이 솔루션은 오버헤드

### POSSIBLE SOLUTION: External Nodeport Service For Each Broker

* `Helm`의 공식 카프카 Chart에서 지원되며 Kafka 브로커와 k8s 외부의 클라이언트 애플리케이션 간의 통신을 구성할 때 기본값 
  * <https://github.com/helm/charts/tree/master/incubator/kafka>
* NodePort 서비스는 노드가 k8s 외부의 클라이언트 간의 직접 통신을 위해 고유한 포트를 제공하는 각 브로커에 대해 생성
* 라우팅은 노드 IP에 액세스할 때 k8s에 의해 수행(k8s는 각 노드의 백그라운드에서 실행되고 라우팅을 제어)
* broker `kafka-0`에 포트 A로 구성된 `NodePort` 가 있는 경우, k8s 클러스터의 모든 노드는 포트 A를 수신하고 네트워크 패킷을 브로커 `kafka-0`으로 전달한다. 즉, 각 브로커는 외부 액세스를 위한 고유한 포트를 얻는다.
* 단점
  * 노드 IP가 자주 변경 (unknown 간격으로 시간이 변경)
  * k8s에 사용되는 노드는 쉽게 교체할 수 있으므로 해당 IP는 일반적으로 신뢰할 수 없다.
  * 외부 클라이언트를 재구성해야 하는 필요성은 쉽게 해결되지 않는다.
  * 개발망에서는 최대 24시간 동안 지속(GCPs preemptible VMS)되기 때문에 문제를 해결할 수 없음

### CHOSEN SOLUTION: LOAD BALANCER FOR EACH BROKER

* 각 broker에 대해서 `Load Balancer`를 생성하는 방식으로 해결
* 각 브로커는 언제든지 연결할 수 있는 외부 클라이언트와 통신이 가능한 고유한 IP를 할
* 각 브로커의 로드 밸런싱 IP는 필요한 직접 통신을 제공
* 로드 밸런서는 K8s 서비스로 배포
* `Load Balancer`를 적용하기 위해서는 몇가지 세팅이 필요하다. 
* 세팅
  * 시작시에 각 브로커는 bootstrap server를 가져와야 하므로 외부 IP로 미리 구성
    * bootstrap server는 기본적으로 브로커로 라우팅되는 주소
  * k8s의 alpha 기능(`dns.alpha.kubernetes.io/internal`)을 통해 쉽게 해결이 가능
    * 그러나 안정성을 위해 alpha 기능을 사용하지 않고 다르게 해결
  * (최종) 카프카 외부 로드 밸런서 전용으로 DNS에 새 하위 도메인을 생성하여 수행
    * DNS를 사용하여 각 브로커의 부트스트랩 서버를 미리 구성한 다음 DNS 라우팅 IP를 원하는 로드밸런서 IP 주소로 구성할 수 있다.

### Summary

외부 데이터베이스에서 Load Balancers를 사용해서 카프카 브로커로 연결을 안정적으로 가능

## 참고 

* https://argus-sec.com/external-communication-with-apache-kafka-deployed-in-kubernetes-cluster/
* https://medium.com/swlh/enable-external-access-to-confluent-kafka-on-kubernetes-step-by-step-e4647ca7a927