---
title: "[Python] Logging Handler"
categories: [파이썬]
tags: [python, handler]
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

## Multi Handler

* `error.log`, `info.log`에 따로 파일에 저장
* `StreamHandler`와 `RotatingFileHandler`를 함께 사용해 화면, 파일에 함께 표시되도록

```python
import logging
from logging.handlers import RotatingFileHandler

def setup_logger():
  MAX_BYTES = 10000000 # Maximum size for a log file
  BACKUP_COUNT = 9 # Maximum number of old log files
  
  # The name should be unique, so you can get in in other places
  logger = logging.getLogger(__name__)
  logger.setLevel(logging.INFO) # the level should be the lowest level set in handlers

  log_format = logging.Formatter('[%(levelname)s] %(asctime)s - %(message)s')

  stream_handler = logging.StreamHandler()
  stream_handler.setFormatter(log_format)
  stream_handler.setLevel(logging.INFO)
  logger.addHandler(stream_handler)

  info_handler = RotatingFileHandler('info.log', maxBytes=MAX_BYTES, backupCount=BACKUP_COUNT)
  info_handler.setFormatter(log_format)
  info_handler.setLevel(logging.INFO)
  logger.addHandler(info_handler)

  error_handler = RotatingFileHandler('error.log', maxBytes=MAX_BYTES, backupCount=BACKUP_COUNT)
  error_handler.setFormatter(log_format)
  error_handler.setLevel(logging.ERROR)
  logger.addHandler(error_handler)
  
if __name__ == '__main__':
  setup_logger()
  for i in range(0, 1000):
    logger.info('This is a message {}'.format(i))
    if i % 5 == 0:
      logger.error('THis is a error {}'.format(i))
```