# 작심 백엔드

## 실행방법

먼저 docker-compose를 통해 postgresql과 redis를 실행합니다.

```bash
docker-compose up -d
```

(만약 두 컨테이너의 상황을 계속해서 보고싶다면 `-d` 옵션을 빼고 실행합니다.)

postgresql은 5440번 포트, redis는 6385번 포트를 사용합니다.

그 다음으로

```bash
yarn start:dev
```

를 통해 계발 환경을 실행합니다.
