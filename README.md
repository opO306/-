# Define Main Screen JSX

이 프로젝트는 Vite + React (TypeScript) 기반의 프론트엔드 애플리케이션입니다. Tailwind CSS가 적용되어 있으며, 게임의 핵심 UI를 구성합니다. 이 프로젝트의 주요 설계 요소는 [[memory:13025817]] "언제든 출시 가능한 상태"의 시스템을 기반으로 합니다.

## 디렉터리 구조

- `data/`: 게임 내 사용되는 예시, 샘플 JSON 등 정적 데이터를 포함합니다.
- `functions/`: Firebase Cloud Functions 관련 코드를 포함합니다. (서버리스 백엔드 로직)
- `guidelines/`: 프로젝트 설계 및 가이드 문서를 포함합니다.
- `migrate/`: 데이터 마이그레이션 스크립트 등을 포함합니다.
- `src/`: Vite-React 애플리케이션의 소스 코드입니다. 페이지, 컴포넌트, 유틸리티 함수 등이 이곳에 위치합니다.
- `node_modules/`: Node.js 모듈 의존성 파일들이 위치합니다. (`.gitignore`에 추가되어 버전 관리에서 제외됩니다.)

## Running the code

1.  **의존성 설치**: 프로젝트 의존성을 설치합니다.

    ```bash
    npm i
    ```

2.  **로컬 개발 서버 시작**: 개발 서버를 시작하여 애플리케이션을 로컬에서 실행합니다.

    ```bash
    npm run dev
    ```

3.  **프로덕션 빌드**: 배포를 위해 프로젝트를 빌드합니다.

    ```bash
    npm run build
    ```

4.  **빌드 미리보기**: 빌드된 결과물을 로컬에서 미리 봅니다.

    ```bash
    npm run preview
    ```

## 배포 절차

이 프로젝트는 Firebase Cloud Functions 및 정적 호스팅을 통해 배포될 수 있도록 설계되었습니다.

1.  **Firebase CLI 설치**: Firebase CLI가 설치되어 있지 않다면 전역으로 설치합니다.

    ```bash
    npm install -g firebase-tools
    ```

2.  **Firebase 로그인**: Firebase 계정에 로그인합니다.

    ```bash
    firebase login
    ```

3.  **프로젝트 선택**: 배포할 Firebase 프로젝트를 선택하거나 초기화합니다.

    ```bash
    firebase use --add
    ```

4.  **빌드**: 프로덕션 빌드를 수행합니다.

    ```bash
    npm run build
    ```

5.  **배포**: Firebase Hosting 및 Functions를 배포합니다.

    ```bash
    firebase deploy
    ```