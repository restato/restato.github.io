---
title: "[Kubernetes] Pod에서 sudo 권한 얻기"
categories: []
tags: []
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

## krew 설치

* https://krew.sigs.k8s.io/docs/user-guide/setup/install/
* kubectl `plugin`을 설치/관리할때 사용

```sh
# 기존
kubectl exec $POD_NAME -- bash
# sudo
kubectl exec-as $POD_NAME -- bash
```
