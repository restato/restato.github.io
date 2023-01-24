---
title: "[Flutter] Basic"
categories: [flutter]
tags: [flutter, basic]
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

<https://docs.flutter.dev/development/ui/widgets-intro>

* `runApp()` 함수가 시작
* Widget (Text ,Row, Column, Stack, Container 등)
  - StatelessWidget or StatefulWidget (state에 따라)
  - `build()` 함수가 main job
  - Container는 3차원도 가능 matrix 사용하면
  - 초기 화면 구성은 Row, colummn, Stack
* <https://material.io/icons/>을 사용하기 위해서는 `pubspec.yaml` 파일에서 `uses-material-design: true` 설정이 필요
* Layout은 <https://docs.flutter.dev/development/ui/widgets/layout> 참고
* GestureDetector를 사용하면 UI는 없지만 동작을 감지(사용자 액션)
  * taps, drags, scales
  * <https://docs.flutter.dev/development/ui/advanced/gestures>
* statefulWidgets을 사용해서 State objects를 생성 (응답에 따라 결과 받을때)
* State에 대한 lifecycle을 이해하기 위해서는 <https://api.flutter.dev/flutter/widgets/State-class.html>