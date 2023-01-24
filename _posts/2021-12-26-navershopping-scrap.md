---
title: "[Python] 네이버 카탈로그 페이지 스크랩"
categories: [파이썬]
tags: [naver, catalog, scrap, beautifulsoup]
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

<https://search.shopping.naver.com/catalog/22766289732?cat_id=50000216&frm=NVSCPRO&query=%EB%8F%84%EB%A7%88&NaPm=ct%3Dkxlhzpcw%7Cci%3D582e1a74c939ca66a4c834f93da443380d27eb19%7Ctr%3Dsls%7Csn%3D95694%7Chk%3D0ef0a2f686bd4f745dac9cf8a3896e6eae550a46>

```python
import requests
from bs4 import BeautifulSoup
import urllib.request

headers = {"User-Agent":"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36"}
response = requests.get(url, headers=headers)
response.raise_for_status()
soup = BeautifulSoup(response.content, 'html.parser')
# image_url
soup.find("div", class_="image_thumb__20xyr").find("img").get('src')
# price
soup.find("div", class_="lowestPrice_low_price__fByaG").find("em").text + "원"
# title
soup.find("div", class_="top_summary_title__15yAr").find("h2").text
```
