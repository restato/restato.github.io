---
title: "[Python] 구글 뉴스 Selenium, BeautifulSoup을 이용해 스크랩하기"
categories: [파이썬]
tags: [python, google, news, beautifulsoup, scrap, selenium]
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

## 기능

* `selenium`을 이용해서 스크롤하기
  * `google news`의 경우 스크롤을 해야 추가로 기사가 로딩된다.
* 기사 내용을 `title`, `href`로 `pandas` DataFrame으로 저장
* `implicitly_wait`을 이용해 로딩을 대기
  * `time.sleep()`과 다르게 로딩되면 추가로 기다리지 않는다.
* background로 동작하도록

## 코드

```python
import requests
import pandas as pd
import time

from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from bs4 import BeautifulSoup
from bs4.element import Comment

payload={}
headers = {}

def get_google_news(params):
    options = webdriver.ChromeOptions()
    # 백그라운드에서 동작하도록
    options.add_argument('headless')
    # 아래와 같이 `install()`을 하면 별도로 `chromedriver`를 받을 필요 없다.
    driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)
    domain = 'https://news.google.com' 
    driver.get(domain + '/' + params)
    # driver.implicitly_wait(30)
    elem = driver.find_element_by_tag_name("body")

    #This code will scroll down to the end
    no_of_pagedowns = 20
    while no_of_pagedowns:
        elem.send_keys(Keys.PAGE_DOWN)
        time.sleep(0.2)
        no_of_pagedowns-=1

    soup = BeautifulSoup(driver.page_source, "html.parser") # Parses HTTP Response
    data = []
    for link in soup.select('h3 > a'):
        href = domain + link.get('href')[1:]
        title = link.string
        data.append({'title': title, 'href': href})
    return pd.DataFrame(data)

google_news_df = get_google_news(params="topstories?hl=ko&gl=KR&ceid=KR:ko")

for idx, google_news in google_news_df.iterrows():
    title = google_news['title']
    href = google_news['href']

```