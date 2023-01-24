---
title: "[Python] 쿠팡 이미지, 상품명, 가격 스크랩"
categories: [파이썬]
tags: [scrap, beautifulsoup, coupang]
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

<https://www.coupang.com/vp/products/5585680852?itemId=119183238&vendorItemId=3240941688&src=1191000&spec=10999999&addtag=400&ctag=5585680852&lptag=CFM60714948&itime=20211225204138&pageType=PRODUCT&pageValue=5585680852&wPcid=16404319383207540421604&wRef=&wTime=20211225204138&redirect=landing&isAddedCart=> 주소가 주어졌을때 아래와 같이 상품 이미지, 타이틀, 금액을 가져올 수 있음

```python
import requests
from bs4 import BeautifulSoup
import urllib.request

headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
response = requests.get(url, headers=headers)
response.raise_for_status()

soup = BeautifulSoup(response.content, 'html.parser')
# image_url
f'http:{soup.find("img", class_="prod-image__detail").get("src")}'
# title
soup.find("h2", class_="prod-buy-header__title").text
# price
soup.find("div", class_="prod-origin-price").find("span", class_="origin-price").text
```

* https://realpython.com/beautiful-soup-web-scraper-python/