---
title: "[FastAPI] HTTPS 적용"
categories: [파이썬]
tags: [fastapi, python, https]
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

https://fastapi.tiangolo.com/deployment/https/

```python
uvicorn.run("app.main:app",
            host="0.0.0.0",
            port=8432,
            reload=True,
            ssl_keyfile="./key.pem", 
            ssl_certfile="./cert.pem"
```

### Reference

* https://dev.to/rajshirolkar/fastapi-over-https-for-development-on-windows-2p7d