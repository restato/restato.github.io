---
title: "[Tensorflow] requests.exceptions.HTTPError: 400 Client Error: Bad Request for url"
categories: ["텐서플로우"]
tags: ["tensorflow", "serving", "400"]
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

20개의 요청을 했을때 앞에 몇개는 성공하는데 어느 순간 400이 뜬다.
간혹 아래 에러도 떠서 

```
requests.exceptions.ConnectionError: ('Connection aborted.', ConnectionResetError(54, 'Connection reset by peer'))
urllib3.exceptions.ProtocolError: ('Connection aborted.', ConnectionResetError(54, 'Connection reset by peer'))
```

header를 추가하면 된다고 해서 추가했는데 실패
`user-agent`를 추가해도 마찬가지로 실패

```python
# header 추가해도 실패
headers = {"content-type": "application/json"}
response = requests.post(self.server_url + ':predict',
                            data=predict_request,
                            headers=headers)
```

너무 빠르게 요청하나 싶어서 `sleep`을 추가했는데 실패

```python
import time

time.sleep(1)
```

여러번 요청 중 항상 10번째에서 실패
여러번 호출을 할때 요청하는 데이터를 매번 요청시 초기화가 필요한데 
그 작업을 누락함..