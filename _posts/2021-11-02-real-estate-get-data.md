---
title: "[Python] 공공데이터 부동산 실거래 가져오기"
categories: [파이썬]
tags: [python, realestate]
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

![](/assets/2021-11/realestate-get-data.png)

```python
def get_data(url, rcode, ym, svc_key):
    print("service_key", svc_key)
    querystring = {
        "pageNo":"1",
        "startPage":"1",
        "numOfRows":"99999",
        "pageSize":"10",
        "LAWD_CD":"" + rcode + "",
        "DEAL_YMD":"" + ym + "",
        "type":"json",
        "serviceKey":"" + svc_key + ""}

    headers = {
        'cache-control': "no-cache",
    }
    print(querystring)
    response = requests.request("GET", url, headers=headers, params=querystring)
    return response
```

응답값으로 XML의 값을 넘겨주는데,
XML의 값을 Pandas의 DataFrame 형태로 변환

```python
import xml.etree.ElementTree as ET
import pandas as pd 

def parse_xml(text):
    root = ET.fromstring(text)
    return root


def xml_to_pdf(root):
    item_list = []
    for child in root.find('body').find('items'):
        elements = child.findall('*')
        data = {}
        for element in elements:
            tag = element.tag.strip()
            text = element.text.strip()
            # print tag, text
            data[tag] = text
        item_list.append(data)
    return pd.DataFrame(item_list)
```