---
title: "[Python] 네이버 스마트스토어 정보 스크랩"
categories: [파이썬]
tags: [naver, smartstore, python, scrap, beautifulsuop]
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

<https://smartstore.naver.com/priceclub/products/4814057455?NaPm=ct%3Dkxlu9dtk%7Cci%3Da92adcb517ad11a4604f64100199bc3be834d2df%7Ctr%3Dslsbrc%7Csn%3D165145%7Chk%3D9c8373b4d8cf0a590a01af52bdf6f82a1676f10a>

class명이 랜덤인건가.. 우선 몇가지 사이트 확인했을때 가져와짐,
랜덤으로 하는 이유가 있구나? https://medium.com/developers-tomorrow/why-google-use-random-classname-81b4c363a4e0
스마트스토어는 오른쪽 마우스를 막았지만 상세정보쪽에서는 우클릭이 가능

```python
import requests
from bs4 import BeautifulSoup
import urllib.request

headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
response = requests.get(url, headers=headers)
response.raise_for_status()
soup = BeautifulSoup(response.content, 'html.parser')

# image_url
soup.find("div", class_="_23RpOU6xpc").find("img").get("src")
# title
soup.find("div", class_="CxNYUPvHfB").find("h3").text
# price (할인전가격)
soup.find("span", class_="_1LY7DqCnwR").text + "원"
# price (할인가격)
soup.find_all("span", class_="_1LY7DqCnwR")[1].text + "원"
```