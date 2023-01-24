---
title: "[RaspberryPi] 애기 CCTV 만들기"
categories: [라즈베리파이]
tags: [raspberryPi, cctv. camera]
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

```sh
git clone https://github.com/EbenKouao/SmartCCTV-Camera.git
python3 -m venv venv
source venv/bin/activate
pip install opencv-python # for cv3
pip install flask
pip install face_recognition
```

## 카메라 실행

```sh
# port를 8000으로 변경했음
python main.py
```

`localhost:8000`에 들어가면 완성

## 참고

* https://github.com/EbenKouao/SmartCCTV-Camera