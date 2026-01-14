# Job Scraper - Cloudflare Workers

채용공고 스크래핑 서버입니다.

## 배포 방법

### 1. Cloudflare 계정 생성
[https://dash.cloudflare.com/sign-up](https://dash.cloudflare.com/sign-up)

### 2. Wrangler 설치
```bash
npm install -g wrangler
```

### 3. 로그인
```bash
wrangler login
```

### 4. 배포
```bash
cd workers/job-scraper
npm install
npm run deploy
```

배포 후 URL이 표시됩니다 (예: `https://job-scraper.<your-subdomain>.workers.dev`)

## 사용 방법

### 모든 사이트 스크래핑
```
GET https://job-scraper.<your-subdomain>.workers.dev/scrape-all
```

### 특정 사이트 스크래핑
```
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/woowahan
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/naver
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/toss
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/line
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/daangn
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/kakao
GET https://job-scraper.<your-subdomain>.workers.dev/scrape/airbnb
```

## 무료 사용량

Cloudflare Workers 무료 티어:
- 일일 100,000 요청
- CPU 시간 10ms/요청

## 주의사항

- 일부 사이트는 봇 차단으로 인해 스크래핑이 실패할 수 있습니다.
- 실패한 사이트는 직접 방문 링크로 대체됩니다.
