---
title: Certbot으로 HTTPS 적용을 위한 키 생성
categories: []
tags: []
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

### key 생성

<https://certbot.eff.org/instructions?ws=nginx&os=osx>

```sh
brew install certbot
sudo certbot certonly --manual
```

```sh
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Please enter the domain name(s) you would like on your certificate (comma and/or
space separated) (Enter 'c' to cancel): 
Requesting a certificate for 

Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/<>/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/<>/privkey.pem
This certificate expires on 2022-04-08.
These files will be updated when the certificate renews.

NEXT STEPS:
- The certificate will need to be renewed before it expires. Certbot can automatically renew the certificate in the background, but you may need to take steps to enable that functionality. See https://certbot.org/renewal-setup for instructions.

- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
If you like Certbot, please consider supporting our work by:
 * Donating to ISRG / Let's Encrypt:   https://letsencrypt.org/donate
 * Donating to EFF:                    https://eff.org/donate-le
- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
```

### crontab에 renewal 하도록 설정

```sh
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && sudo renew -q" | sudo tee -a /etc/crontab > /dev/null
```

### Reference

* https://certbot.eff.org/