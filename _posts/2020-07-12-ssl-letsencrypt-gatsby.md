---
title: "node.js Express certbot을 이용해 letsencrypt 무료로 설정하기 (+삽질 과정)"
tags: [nodejs, express, certbot, letsencrypt, ssl, certification]
categories: [nodejs]
---

# 들어가며

현재 `Gatsby`로 부동산 관련된 프론트를 구성하고, nodejs를 이용해 data fetch 작업이 필요했다. 하지만 클라이언트가 `https`로 제공된다면, 백엔드 서버에서도 `https`로 `REST API`를 제공해야 한다. 현재 해당 블로그는 `netlify`를 이용해 호스팅을 하고 있고, `netlify`느 `SSL`인증까지 해줘 `https`로 서비스를 하고 있는 상태이다. 결과적으로 나는 `REST API`를 제공하는 node.js에서 `SSL`인증을 통해 `https`의 서비스가 필요했다.

> 참고로 https://www.npmjs.com/package/greenlock-express 를 이용해도 letsencrypt를 주기적으로 갱신이 가능하다. certbot을 사용하려면 crontab에 갱신하는 작업을 메뉴얼하게 해야한다. 나의 경우 certbot을 이용해서 letsencrypt를 node.js express에 적용했다. greenlock을 참고하기 위해서는 https://git.rootprojects.org/root/greenlock-express.js/src/branch/master/examples/express/my-express-app.js

SSL을 인증하는 과정은 <sup>1)</sup> 키발급, <sup>2)</sup> node.js express에 키등록, 마지막으로 <sup>3)</sup> 키 갱신하는 작업을 하면 끝. 각종 블로그를 참고해보려고 했으나 다들 각기 다른 버전으로 삽질의 연속이였다. 역시 나는 다시 공홈(?)으로 돌아가서 적용까지 할수 있었다.

# SSL Let's Encrypt를 무료로 사용

일단 SSL을 제공하는 업체는 많으며 유료 버전으로 제공하고 있다. 개인 블로그 용도를 돈주면서까지 할 필요가 있을까 싶어서 SSL을 무료로 제공하는 `let's encrypt`를 사용하기로 결정. 많은 사람들이 해당 인증 기관을 통해 `https`의 서비스를 제공하고 있었다. 인터넷에 한글로된 문서가 있어서 접하는데는 어렵지 않았다. 쉘 엑세스 권한이 있는 경우네는 `certbot`을 이용해서 적용이 가능하다. 반면 쉘 엑세스의 권한이 없는 경우에는 호스팅 제공자 목록을 확인하여 문서에 따라 적용하면 된다고 한다. 나의 경우 내 서버에서의 인증이 필요하니 `certbot`을 이용하면 된다.

# certbot

![certbot](/assets/2020-07/image1.png)

certbot 페이지를 들어가면 소프트웨어, OS를 선택해 가이드를 받으면 된다. node.js에서 동작시키기 때문에 `Web Hosting Product`에 `Centos 7`로 살펴보기로 한다. [공홈에서 설정하는 방법 가이드 바로가기](https://certbot.eff.org/lets-encrypt/centosrhel7-webproduct)

> 참고로 OS 버전 확인하는 방법은 `cat /etc/redhat-release`

## 설치하는 순서

- EPEL repo를 enable

```shell
$ sudo yum install https://dl.fedoraproject.org/pub/epel/epel-release-latest-7.noarch.rpm
```

- certbot 설치

```shell
$ sudo yum install certbot
```

- certbot을 이용해서 키생성
  - nodejs에 적용하기 위해 `--standalone` 모드를 통해서 key를 생성

```shell
$ sudo certbot certonly --standalone
$ sudo certbot certonly --webroot
```

![certbot을 이용해서 key생성 완료](/assets/2020-07/certbot-key-gen.png)

생성이 완료되면 `.pem`의 파일이 `/etc/letsencrypt/live/hostname/*.pem`에 생성된다. 처음에는 결과 파일이 어디 생기는지도 확인안하고 어디에 있는거야 찾다가 샘플코드 보니 나와있어서 응? 하고 보니 내가 `certbot`을 이용해 생성할때 `IMPORTANT NOTES`라고 대놓고 써있었다.

## 갱신하기

`letsencrypt`의 경우 갱신이 필요하다. 아래와 같이 `crontab`에 등록하면 끝, 메뉴얼하게 갱신하기 위해서는 `$certbot renew`를 통해 가능하다.

```shell
echo "0 0,12 * * * root python -c 'import random; import time; time.sleep(random.random() * 3600)' && certbot renew -q" | sudo tee -a /etc/crontab > /dev/null
```

# node.js Express에 적용하기

- nodejs에서 https 모듈을 이용해서 위 과정에서 생성한 키를 등록
- `80`포트와 `443`포트에 생성하면 `http`로 접속해도 `https`로 `redirect`
- `https://hostname` 접속해서 결과 확인 (참고로 `port: 443`이 아닌 `port: 80`)

```js
// server.js
const http = require("http")
const https = require("https")
const fs = require("fs")

var privateKey = fs.readFileSync("/etc/letsencrypt/live/{hostname}/privkey.pem")
var certificate = fs.readFileSync("/etc/letsencrypt/live/{hostname}/cert.pem")
var ca = fs.readFileSync("/etc/letsencrypt/live/{hostname}/chain.pem")
const credentials = { key: privateKey, cert: certificate, ca: ca }

const app = express()
app.use((req, res) => {
  res.send("Hello V")
})

http.createServer(app).listen(80)
https.createServer(credentials, app).listen(443)
```

위와 같에 `server.js`의 파일을 생성하고 아래와 같이 입력하면 끝

```shell
$ sudo node server.js
```

등록 되었는지 확인

```shell
https://{hostname}/
curl --request GET 'https://{hostname}'
```

![최종 좌물쇠까지 확인](/assets/2020-07/result.png)

위 결과처럼 좌물쇠가 나오면 SSL인증이 완료된 것이다. `CURL`을 통해 결과를 확인해도 되고 [SSLlabs](https://www.ssllabs.com/ssltest/)를 통해서도 확인이 가능하다. `key`에 대한 정보가 나오며 언제까지 유효한지에 대한 내용도 나온다. 아래는 최종 요약에 대한 내용

![ssl-labs 결과](/assets/2020-07/ssl-labs.png)

# 방화벽 확인

내가 가장 삽질한 부분이 바로 여기이다. `80`포트 뿐만 아니라 `433`의 포트까지 열려야 인증이 가능하다. `iptime`을 이용해서 포트 포워딩을 안했나 싶었는데, 이미 이전에 `80`포트에서 외부에서 접속을 확인했던지라 포트의 문제라고는 생각을 안했다. 이런 의도하지 않은 삽질이 나에게는 익숙하지 않다.

```shell
$ sudo firewall-cmd --permanent --zone=public --add-port=8080/tcp
$ sudo firewall-cmd --permanent --zone=public --add-port=80/tcp
$ sudo firewall-cmd --permanent --zone=public --add-port=443/tcp
$ sudo firewall-cmd --reload

# on/off
$ sudo systemctl [start|enable] firewalld
$ sudo systemctl [stop|disable] firewalld

# 방화벽 상태 확인
$ sudo firewall-cmd --state

# 활성화 상태
$ sudo firewall-cmd --get-active-zones

# 서비스 리스트
$ sudo firewall-cmd --get-service

# 특정 존에 있는 서비스 리스트 (ex: public)
$ sudo firewall-cmd --zone=public --list-services
```

포트에 대한 한가지 팁은 한개의 서비스를 띄우고 해당 서비스로 확인하는게 좋다. python의 경우 모두 설치가 되어있으니까 아래와 같이 임시로 서비스를 하나 올리고 확인하면 해당 포트가 열렸는지 확인하기 수월하다. (간단하고 쉽게 서비스 실행이 가능한 python 모듈)

```shell
# python 2.x
python -m SimpleHTTPServer <port>
python -m SimpleHTTPServer 8080
# python 3.x
python3 -m http.server <port>
python3 -m http.server 8000
```

### 참고

- https://letsencrypt.org/ko/
- https://certbot.eff.org/