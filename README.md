## ✈️ TRIPY: SLLM 기반 지능형 개인화 여행 일정 생성 & 스마트 앨범 플랫폼

> 
> 
> 
> **TRIPY**는 시간 비용을 절감하고 최적의 여행 경험을 제공하기 위해 설계된 지능형 통합 여행 플랫폼입니다. 파편화된 여행 기록을 통합하고, 스마트 앨범 분류 기능을 통해 사용자의 개입을 최소화하는 All-in-One 시스템을 제공합니다.
> 

### 🌟 핵심 아키텍처 (Microservice Architecture)

본 프로젝트는 시스템의 확장성과 유지보수성을 극대화하기 위해 **Node.js(Main) - FastAPI(AI)** 형태의 2-Server 시스템으로 설계되었습니다 .

1. **Node.js (Main Server)**: 클라이언트 요청 처리, DB 저장, EXIF 메타데이터 추출 및 OpenStreetMap API를 통한 역지오코딩 수행.
2. **FastAPI (AI Inference Server)**: 메인 서버로부터 이미지를 전달받아 CNN 기반 카테고리 분류 모델을 구동하고, 결과(Tag + Score)만 독립적으로 반환 .

### 🔥 담당 업무 및 핵심 기여 (My Contributions)

프로젝트의 프론트엔드 UI부터 백엔드, AI 추론 파이프라인, 그리고 클라우드 인프라 배포까지 전체 시스템의 End-to-End 구축을 담당했습니다.

#### 1. AI & Data Engineering (스마트 앨범 분류 모델)

- **CNN 기반 카테고리 분류 모델 개발**: 캐글 및 AI-Hub 데이터를 활용하여 8개 카테고리(건물, 문화, 음식, 숲, 산, 인물, 바다, 거리) 분류를 위한 EfficientNetV2-S 모델 전이학습(Transfer Learning) 수행 .
- **Data-Centric AI 최적화**: 모호한 데이터를 식별 및 격리하는 데이터 클리닝을 통해 Baseline 대비 성능 향상.
- **XAI (Explainable AI)**: Grad-CAM을 활용하여 모델의 예측 근거(Decision Boundary)를 시각화하고 타당성 검증.

#### 2. Backend Engineering (Node.js & 마이크로서비스)

- **Controller - Service - DAO 계층 아키텍처 도입**: 비즈니스 로직과 데이터 접근 계층을 분리하여 코드 가독성 및 재사용성 향상.
- **데이터 파이프라인 및 Open API 연동**: `exifr`를 이용한 사진 메타데이터(GPS, Date) 추출 및 OpenStreetMap(Nominatim)을 활용한 Reverse Geocoding 주소 변환 구현.
- **안전한 Transaction 처리 (Commit/Rollback)**: AI 분석 결과를 바탕으로 Photo 데이터와 Category 데이터를 DB에 저장할 때 예외가 발생하면 업로드된 파일을 삭제하고 DB를 롤백하는 무결성 보장 로직 구현.

#### 3. Frontend Engineering (React + Vite)

- **스마트 앨범 UI/UX 구현**: React와 Vite를 기반으로 날짜, 위치, 카테고리별(건물, 문화, 바다 등)로 자동 분류된 앨범을 동적으로 렌더링하는 UI 개발.

#### 4. DevOps & Cloud Infrastructure

- **Docker 컨테이너화**: 프론트엔드, 백엔드, AI 서버, 데이터베이스(MySQL, Redis)를 분리하여 Docker Compose로 묶어 독립적인 실행 환경 구축 .
- **AWS EC2 배포**: AWS Linux 환경에 Docker 엔진 및 Nginx 리버스 프록시를 세팅하여 무중단 서비스 인프라 구축.
- **CI/CD 파이프라인**: GitHub Actions를 활용하여 빌드부터 도커 이미지 푸시, AWS EC2 SSH Pull 및 자동 배포로 이어지는 자동화 파이프라인 구성.

### 📁 디렉토리 구조 (Node.js 백엔드 중심)

MVC 패턴을 변형한 Controller(Routes) - Service - DAO(DB) 구조를 적용하여 로직의 관심사를 완벽히 분리했습니다.

```jsx
📦 project-root
 ┣ 📂 db
 ┃ ┗ 📜 album_db.js          # [DAO] DB 쿼리 전담 (Sequelize)
 ┣ 📂 middlewares
 ┃ ┗ 📜 multer_config.js     # [Middleware] 파일 업로드 설정 (Multer)
 ┣ 📂 models                 # Sequelize 모델 구조체
 ┃ ┣ 📜 index.js
 ┃ ┗ 📜 photo.js
 ┣ 📂 routes                 # [Controller] 요청 URL 라우팅 및 응답
 ┃ ┣ 📜 album_router.js      # (GET) 조회 전용 라우터
 ┃ ┗ 📜 upload_router.js     # (POST) 업로드 전용 라우터
 ┣ 📂 services
 ┃ ┗ 📜 album_service.js     # [Service] 핵심 비즈니스 로직 (AI통신, EXIF, 역지오코딩)
 ┣ 📂 uploads                # Multer 이미지 임시/영구 저장소
 ┣ 📜 app.js                 # [Entry Point] 서버 실행 및 라우터 등록
 ┣ 📜 package.json           # 의존성 관리
 ┗ 📜 .env                   # 환경변수 (DB 인증, AI 서버 URL 등)
```

### 🔄 핵심 데이터 흐름 (Data Flow & Transaction)

클라이언트의 사진 업로드 요청부터 DB 저장까지의 파이프라인은 다음과 같이 동작합니다 .

1. **Request**: 클라이언트가 `/api/upload`로 이미지 파일 전송.
2. **Controller (`upload_router.js`)**: Multer 미들웨어로 파일을 저장하고, 서비스 레이어 호출.
3. **Service (`album_service.js`)**:
    - `exifr` 패키지를 이용해 이미지에서 시간(takenAt), GPS(위도, 경도) 추출.
    - OpenStreetMap(Nominatim) API를 호출하여 GPS 좌표를 실주소(시/구/동)로 변환 (Reverse Geocoding) .
    - FormData 형식으로 FastAPI 서버에 분석 요청 (추론 결과 수신) .
4. **Transaction (DB & Rollback)**:
    - DB에 `Photo`와 추론된 `Category` 정보를 트랜잭션으로 저장.
    - **오류 발생 시**: `t.rollback()` 실행으로 DB 저장을 취소하고, 라우터단에서 예외 처리를 통해 업로드된 물리적 파일을 삭제하여 찌꺼기 방지.
5. **Response**: 모든 저장이 성공적으로 커밋(Commit)되면, 클라이언트에 결과 JSON 반환.

### 🛠 Tech Stack

#### Frontend

- React, Vite, Axios

#### Backend (Microservices)

- **Main Server**: Node.js, Express, Sequelize, Multer, exifr
- **AI Server**: Python, FastAPI, PyTorch, Torchvision, Uvicorn
- **Database**: MySQL, Redis

#### Infrastructure & DevOps

- **Cloud**: AWS EC2 (Linux)
- **Container**: Docker, Docker Compose
- **Web Server**: Nginx
- **CI/CD**: GitHub Actions
