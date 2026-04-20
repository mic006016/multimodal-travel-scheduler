## 📸 [Data & AI Report] 스마트 앨범 자동 분류 모델: Data-Centric 최적화 및 XAI 검증 (지능형 여행 스케줄러)

### 💡 Project Overview

> "단순히 높은 정확도를 달성하는 것을 넘어, 데이터의 불완전성(Noise, Imbalance)을 엔지니어링으로 극복하고 실제 서비스 환경에서의 강건성(Robustness)을 확보하는 데 집중한 프로젝트입니다."
> 

<br>

### 💫 Executive Summary (핵심 성과 요약)

- **목표:** 사용자 여행 사진의 EXIF 데이터를 추출하고, CNN 모델을 통해 11개 카테고리로 자동 분류하는 '스마트 앨범' 파이프라인 구축
- **AI & Data 모델링 성과:**
    - **Robustness 확보:** 테스트 셋 최고 정확도(98.17%)에 매몰되지 않고, 소수 클래스의 재현율과 모호한 사진에 대한 방어력을 높인 **97.50% 모델을 최종 서비스에 배포**
    - **Data-Centric 최적화:** 시각적 중첩이 발생하는 '건물 vs 거리' 오분류를 **57% 감소**
    - **Imbalance 극복:** Weighted Loss를 통해 소수 클래스('공원')의 Recall을 **+4.1%p 향상 (94.26% 달성)**
- **System Integration 성과:**
    - 프론트엔드 - Node.js(Data 처리) - FastAPI(AI 추론)로 이어지는 마이크로서비스 아키텍처 및 AWS/Docker 기반 자동화 배포 완료

<br>


### 1. Problem Definition: 데이터 한계와 직면 과제

초기 8개 클래스에서 발생한 분류 모호성을 해결하기 위해 11개 클래스로 도메인을 확장(`동물, 하늘/구름, 공원` 추가)하였으며, 이 과정에서 두 가지 치명적인 데이터 문제를 식별했습니다.

- **Data Imbalance (데이터 불균형):** '음식(Food)' 클래스는 500장 이상 수집된 반면, 직접 크롤링한 '공원(Parks)' 클래스는 122장에 불과하여 약 1:4의 극심한 불균형 발생.
- **Visual Ambiguity (시각적 특징 중첩):**
    - `Buildings vs Street`: 건물 사진의 하단에 도로가 포함되거나 그 반대의 경우, 모델의 판단 경계가 무너짐.
    - `Parks vs Culture`: 한국의 문화재(Culture) 사진은 필연적으로 숲과 나무(Parks)를 배경으로 포함하고 있어 의미론적(Semantic) 중첩이 발생.

<br>

### 2. Methodology: 4-Step 최적화 파이프라인

데이터 품질과 모델 구조를 동시에 개선하기 위해 4단계의 파이프라인을 구축했습니다.

| **Step** | **전략 (Strategy)** | **주요 수행 내용 (Key Activities)** | **모델 성능 (Accuracy)** |
| --- | --- | --- | --- |
| **Step 1** | **Baseline** | EfficientNetV2-S 전이학습 모델 구축 및 초기 성능 진단 | 94.45% |
| **Step 2** | **Data Cleaning** | 오분류 데이터 전수 조사 및 라벨링 노이즈(Noisy Label) 제거 | 97.08% |
| **Step 3** | **Fine-tuning** | Smart Unfreezing 및 Differential Learning Rate 적용 | **98.17% (Peak)** |
| **Step 4** | **Robustness** | Data Augmentation(Crop) 및 Class Weighted Loss 적용 | **97.50% (Final)** |

> 📌 **Decision Note: 왜 98.17% 대신 97.50%를 선택했는가?**
Step 3에서 가장 높은 전체 정확도를 기록했으나, 실제 서비스 환경에서는 '공원'이나 '건물'처럼 오분류가 잦은 취약 클래스를 방어하는 강건성(Robustness)이 UX에 더 중요하다고 판단했습니다. 따라서 전체 평균 스코어를 소폭 양보하더라도 소수 클래스의 재현율을 극대화한 Step 4 모델을 Production(최종 배포) 모델로 선정했습니다.
> 

<br>

### 3. Troubleshooting & Deep Dive (핵심 문제 해결)

| Confusion Matrix | Classification Report |
|:---:|:---:|
| <img height="350" alt="image" src="https://github.com/user-attachments/assets/520ad033-ced2-4140-b140-5d791053b76c" /> | <img height="300" alt="image" src="https://github.com/user-attachments/assets/5c023c63-aef2-414e-8048-2a2e764da548" /> |

#### [Case 1] 건물 vs 거리 혼동 해결 (오분류 57% 감소)

- **현상:** 건물을 찍은 사진 하단에 도로가 섞여 있을 경우, 모델이 이를 '거리(Street)'로 오분류하는 현상 집중 발생.
- **가설 및 해결 (RandomResizedCrop):** 모델이 '도로'라는 Noise Feature에 과적합되었다고 판단. 이미지의 일부분(창문, 지붕 등 도로가 없는 영역)만 잘라서 학습(Augmentation)시켜, 모델이 건물의 본질적인 구조 패턴에 집중하도록 강제함.
- **결과:** Buildings → Street 오분류 건수가 7건에서 3건으로 감소(57% 개선).  

#### [Case 2] 문화재 vs 공원의 시각적 중첩 해결 (Recall +4.1%p 상승)

- **현상:** 나무가 많은 문화재 사진을 공원으로 착각하거나, 그 반대의 경우 지속 발생 (절대적인 데이터 수량 차이의 한계).
- **가설 및 해결 (Class Weighting):** 소수 클래스이자 오분류 타겟이 되는 '공원(Parks)'의 Loss 가중치를 높게 부여. 모호한 경계에 있는 이미지를 판별할 때 Threshold를 공원 쪽으로 유리하게 조정.
- **결과:** 공원(Parks) 클래스의 Recall이 90.16%에서 **94.26%로 수직 상승**. (데이터 개수 122장이라는 물리적 한계를 엔지니어링으로 극복함)

<br>

### 4. XAI (Explainable AI) 기반 모델 타당성 검증

단순히 결과값(Tag)만 반환하는 것을 넘어, **Grad-CAM(Gradient-weighted Class Activation Mapping)**을 통해 모델이 이미지의 어떤 영역(Feature)을 보고 판단을 내렸는지 시각화하여 신뢰성을 검증했습니다.

| Buildings | Street |
|:---:|:---:|
| <img height="400" alt="image" src="https://github.com/user-attachments/assets/892c291e-93a3-4d1b-b8ba-616892836147" /> | <img height="400" alt="image" src="https://github.com/user-attachments/assets/07aab30d-fcca-4b00-be94-5027afa928e1" /> |

- **분석 결과:**
    - **건물(Buildings):** 모델이 배경이나 하늘이 아닌 건물의 창문 격자와 외벽 텍스처에 히트맵을 활성화함.
    - **거리(Street):** 화면 중앙의 소실점(Vanishing Point)과 바닥면 아스팔트 질감에 집중함.
    - **결론:** 모델이 단순한 픽셀의 통계적 분포를 외운 것이 아니라, 인간이 시각을 인지하는 방식과 유사하게 **객체의 고유 특징(Feature)을 정확히 학습했음**을 증명했습니다.
