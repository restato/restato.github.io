---
title: "Netlify에 Gatsby 블로그 무료로 배포 및 호스팅, 어디까지 무료로 가능할까?"
image:
  path: /assets/2020-06/create-a-new-site.png
category: [development]
tags: [netlify, gatsby, blog, host, build]
---

gatsby로 사이트를 생성하고, 생성한 사이트를 어디에 어떻게 올려서 서비스(?)를 제공할 수 있을지에 대한 내용을 다뤄볼까 한다. 이번에 블로그를 새로 만들면서 아래와 같이 몇가지(...2가지) 요구 사항이 있었다.

- 무료
- 간편한 배포

위를 모두 만족한게 `netlify` 였고, 사용성도 좋아서 지금 현재 블로그에도 사용중이다. (좋다고 생각하고 쓰다가 아래 `team build status`를 보고 약간은 흔들렸다.)

### Hosting setup

- Git repository 설치
- Upload site folder

### Git repository setup

- Github, GitLab, Bitbucket에 모두 가능
- 이전 버전으로 roll back이 가능
- 변경할 때마다 수동으로 다시 작성하고 업로드를 할 필요가 없다.
- repo의 권한이 public/private 모두 상관 없음

* 적용
  - `branch to deploy (default: master)`: 특정 branch로 가능
  - `build command`: Netlify를 실행하려는 명령을 지정할 수 있음, 기본값은 `npm run build`
  - `publish directory (default: public)`: Netlify가 웹 사이트를 호스팅하는데 사용해야하는 폴더 (예: public, dist, build)를 지정 가능
  - `advanced build settings`: 사이트에 빌드할 환경 변수가 필요한 경우`advanced`를 클릭하고 `new variable` 버튼을 클릭하여 지정이 가능

`Deploy site`를 누르면 Netlify는 build와 deploy를 처리한다. `Deploys` tab으로 가면 `Deploy log`를 확인할 수 있음

### Netlify

- 참고로 github에 코드 수정을 push하면 알아서 deploy까지 완료해준다.
- custom-domain을 하기 위해서 settings에서 변경하면 내가 원하는 domain으로 변경이 가능하다.

![새로운 사이트 만들기](/assets/2020-06/create-a-new-site.png)
![배포하기](/assets/2020-06/site-deploy-in-progress.png)
![나만의 도메인 설정](/assets/2020-06/custom-domain.png)

물론 서비스는 항상 무료가 아니다. 특정 항목이 일정 이상되면 금액을 지불해야 한다. 나는 개인적인 블로그로 사용하기 때문에 비용 문제가 발생할리가 없다고 생각했지만... 아래와 같이 `team build status`를 보여주길래 이게 응???

![Team build status](/assets/2020-06/team-builds-status.png)

(주의) 잘 살펴보면 한달동안 내가 배포하고 빌드하는 시간에 제약이 있다는 점이다. 이 점을 주의하며... 배포를 너무 자주하지 말아야지

- 참고
  - https://www.gatsbyjs.org/docs/deploying-to-netlify/#git-repository-setup
  - https://www.netlify.com/
