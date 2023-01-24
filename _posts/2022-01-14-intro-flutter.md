---
title: "Flutter 시작"
categories: [Flutter]
tags: [flutter]
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

native app을 만들때 2022년에는 react native보다 flutter가 더 많이 사욯안다는 말을 어디서 얼핏 봐서 react native 프로젝트만 만들었는데 flutter로 변경해보기로.. 매번 이렇게 처음 시작만 해보는것 같지만!


### Flutter 설치

<https://docs.flutter.dev/get-started/install/macos>

* 용량이 1.1GB

```sh
cd ~/development
unzip ~/Downloads/flutter_macos_2.8.1-stable.zip
export PATH="$PATH:`pwd`/flutter/bin"

flutter doctor # 설치해야 하는 dependeices 가 있는지 확인
```

### VSCode 연동

<https://docs.flutter.dev/get-started/editor?tab=vscode>

* extensions에서 flutter, dart를 검색해서 설치
  * flutter 설치하면 dart도 설치된다.
* SDK 설정
  * view > command palette 에서 flutter doctor 실행

### App 생성 및 실행

<https://docs.flutter.dev/get-started/test-drive?tab=vscode>

*  view > command palette 에서 flutter: new project
* `main.dart` 
* `F5` 또는 `Run > Start Debugging`

![](./assets/2022-01/flutter-demo.png)

### App 작성

<https://docs.flutter.dev/get-started/codelab>

위 까지는 설정이고 앱 개발을 위해서는 아래 내용으로 시작

<https://docs.flutter.dev/get-started/learn-more>
