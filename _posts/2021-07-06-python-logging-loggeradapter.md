---
title: "[Python] LoggerAdapter"
categories: [파이썬]
tags: [python, logging, loggeradapter]
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

* 로거를 생성할때 추가할래 -> `LoggerAdapter`
* 로깅을 남길때 추가할래 -> `CustomAdapter`

### LoggerAdapter 

```python
# encoding: utf8
import logging

class LoggerAdapter(logging.LoggerAdapter):
    def __init__(self, logger, prefix):
        super(LoggerAdapter, self).__init__(logger, {})
        self.prefix = prefix

    def process(self, msg, kwargs):
        return '[%s] %s' % (self.prefix, msg), kwargs

logger = logging.getLogger(__name__)

fmt='[%(asctime)s] - %(process)s - %(levelname)s - %(module)s - %(message)s'
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter(fmt))
logger.addHandler(handler)
logger.setLevel(logging.INFO)

logger_a = LoggerAdapter(logger, 'A')
logger_b = LoggerAdapter(logger, 'B')

logger_a.info('Logger A')
logger_b.info('Logger B') 
```

### CustomAdapter

```python
# encoding: utf8
import logging

class CustomAdapter(logging.LoggerAdapter):
    def process(self, msg, kwargs):
        my_context = kwargs.pop('id', self.extra['id'])
        return '[%s] %s' % (my_context, msg), kwargs

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - [%(levelname)s] - %(name)s - (%(filename)s).%(funcName)s(%(lineno)d) - %(message)s",
)

logger = logging.getLogger(__name__)
logger = CustomAdapter(logger, {"id": None})

logger.info('Hello V', id='A')
logger.info('Hello V', id='B')
```
