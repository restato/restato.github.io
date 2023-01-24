---
title: "React Native 환경 구성"
categories: [React]
tags: [react native, envrionment, javascript, typescript]
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

### VSCode Plugin

* https://marketplace.visualstudio.com/items?itemName=msjsdiag.vscode-react-native


### 환경 설정 [#](https://reactnative.dev/docs/environment-setup)

* nodejs 다운로드 및 설치 [#](https://nodejs.org/en/download/)

```sh
This package has installed:
	•	Node.js v16.13.1 to /usr/local/bin/node
	•	npm v8.1.2 to /usr/local/bin/npm
Make sure that /usr/local/bin is in your $PATH.
```

* Expo CLI 설치

```sh
npm install -g expo-cli
```

* 앱시작

```sh
expo init AwesomeProject

cd AwesomeProject
npm start # you can also use: expo start
```

* https://reactnative.dev/docs/running-on-device
* IOS에서 실행하기 위해서 Xcode 다운로드
  * https://apps.apple.com/us/app/xcode/id497799835?mt=12