---
title: "[Python] Selenium을 이용해서 Youtube 데이터 가져오기"
categories: [파이썬]
tags: [python, selenium, youtube, scrapping]
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

* Youtube 데이터 스크랩
  * 좋아요, 싫어요, 댓글, 뷰개수, 제목
* 결과를 `pandas` DataFrame으로 저장

## 코드

```python
#IMPORT THESE PACKAGES
import selenium
from selenium import webdriver
import pandas as pd
#OPTIONAL PACKAGE, BUY MAYBE NEEDED
from webdriver_manager.chrome import ChromeDriverManager
import time

options = webdriver.ChromeOptions()
# 백그라운드에서 동작하도록
options.add_argument("headless")
# `chromedriver`를 따로 받을 필요가 없음
driver = webdriver.Chrome(ChromeDriverManager().install(), options=options)


data1 = {'Likes': [], 'Dislikes': [], 'Comments': [], 'Views': [], 'Title': [], 'Username': []}
fulldf = pd.DataFrame(data1)

# Copy > Copy Full XPath
# Likes = driver.find_element_by_xpath('/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[7]/div[2]/ytd-video-primary-info-renderer/div/div/div[3]/div/ytd-menu-renderer/div[1]/ytd-toggle-button-renderer[1]/a/yt-formatted-string').text

driver.get("https://www.youtube.com/watch?v=xLguIlM6y_A&ab_channel=%EB%A7%88%EC%9D%B8%EB%93%9C%ED%94%BC%EC%95%84%EB%85%B8MINDPIANO")
driver.implicitly_wait(10)
xpath = '/html/body/ytd-app/div/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[8]/div[2]/ytd-video-primary-info-renderer/div/div/div[3]/div/ytd-menu-renderer/div/ytd-toggle-button-renderer[1]/a/yt-formatted-string'
Likes = driver.find_element_by_xpath(xpath).text
# Dislikes = driver.find_element_by_xpath('PASTE THE FULL XPATH HERE').text
# Comments = driver.find_element_by_xpath('PASTE THE FULL XPATH HERE').text
# Views = driver.find_element_by_xpath('PASTE THE FULL XPATH HERE').text
# Title = driver.find_element_by_xpath('PASTE THE FULL XPATH HERE').text
# Username = driver.find_element_by_xpath('PASTE THE FULL XPATH HERE').text

print(Likes)
# print(Dislikes)
# print(Comments)
# print(Views)
# print(Title)
# print(Username)

# row = [Likes, Dislikes, Comments, Views, Title, Username]
#  fulldf.loc[len(fulldf)] = row
```