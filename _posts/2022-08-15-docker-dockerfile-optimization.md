---
title: "[Docker] Dockerfile 최적화"
categories: [도커]
tags: [docker, dockerfile, optimization]
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

Dockerfile을 빌드해 새로운 이미지를 만들때 instruction(=layer)가 하나씩 빌드 하는것을 확인할 수 있다. 이때 기존에 빌드해 캐시된 레이어가 있다면 재사용하고, 캐시된 레이어가 없다면 새롭게 빌드한다.

캐시된 레이어를 사용하도록 Dockerfile을 최적화하면 빌드하는데 필요한 시간을 줄일 수 있다. 도커는 캐시에 일치하는 레이어가 있는지 확인하기 위해 해시값을 이용한다.  해시값은 스크립트의 instruction과 instruction에 의해 복사되는 파일의 내용으로부터 계산한다. 즉 파일이 변경되면 해당 instruction을 다시 실행하게 된다.

레이어가 총 6개가 있다고 가정했을때, 4번째 레이어가 캐시 미스가 발생해 instruction을 다시 실행한다면 4번째 이후의 모든 레이어(5,6)를 다시 실행하게 된다.

즉 **빌드 시간을 단축하기 위해서는 Dockerfile에서 변경이 적은 instruction을 위에 배치하는게 좋다.**

보통 CMD instruction을 Dockerfile의 맨 마지막에 위치시키는데 이것 또한 변경이 적은 instruction 이기 때문에 FROM 다음에 배치하는게 좋다. (FROM 앞에 위치하는건 불가)
