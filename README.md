# 안전관리계획서 작성 웹사이트 제작

안전관리계획서를 온라인으로 작성하고 관리할 수 있는 웹 서비스입니다.

## 주요 기능

- 안전관리계획서 양식 온라인 작성
- 로그인/세션 기반 사용자 관리
- 작성한 양식 저장 및 조회
- 대시보드를 통한 작성 현황 관리

## 기술 스택

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **Session**: express-session

## 실행 방법

```bash
npm install
node server.js
```

서버 실행 후 http://localhost:3000 접속

## 테스트 계정

| ID | PW | 이름 |
|----|----|------|
| admin | admin1234 | 관리자 |
| test01 | test1234 | 홍길동 소장 |
| test02 | safe1234 | 이현장 대리 |

## 프로젝트 구조

```
project-build-uk/
├── public/
│   ├── index.html        # 메인 홈페이지
│   ├── login.html        # 로그인 페이지
│   ├── forms.html        # 양식 목록 페이지
│   ├── dashboard.html    # 작성현황 대시보드
│   ├── forms/            # 양식 파일
│   ├── css/              # 스타일시트
│   └── js/               # 자바스크립트
├── server.js             # Express 서버
└── package.json
```
