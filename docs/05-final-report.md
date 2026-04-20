# 📑 [Final Report] 스마트 앨범 자동 분류 모델 최적화 프로젝트

**Smart Album Classification Model Optimization Report**

---

## 1. Executive Summary (프로젝트 개요)

본 프로젝트는 여행 일정 생성 서비스의 핵심 기능인 **'스마트 앨범'** 구현을 위해, 사용자 이미지를 11개 카테고리로 자동 분류하는 딥러닝 모델 개발을 목표로 했습니다.

초기 8개 클래스에서 발생한 분류 모호성을 해결하기 위해 **11개 클래스로 확장**하였으며, 데이터 불균형(Imbalance)과 시각적 중첩(Visual Overlap) 문제를 해결하기 위해 **Data-Centric**과 **Model-Centric** 접근 방식을 모두 적용했습니다.

최종적으로 **EfficientNetV2-S**를 기반으로 전이학습(Transfer Learning)을 수행하였으며, 단계별 최적화를 통해 **최고 정확도 98.17%**, **최종 서비스 모델 정확도 97.50%**를 달성했습니다. 특히, 고질적인 문제였던 **'건물(Buildings) vs 거리(Street)'의 오분류를 57% 감소**시키고, 소수 클래스인 **'공원(Parks)'의 재현율(Recall)을 4% 이상 향상**시키는 성과를 거두었습니다.

---

## 2. Problem Definition & Dataset (문제 정의 및 데이터)

### **2.1. Class Expansion (클래스 확장)**

기존 8개 클래스의 한계를 극복하고 사용자 경험을 강화하기 위해 3개 클래스를 추가, 총 11개 클래스로 재정의했습니다.

- **Existing (8):** `Buildings`, `Forest`, `Mountain`, `Sea`, `Street`, `Culture`, `Food`, `Person`
- **Added (3):** `Animals` (동물), `Clouds` (하늘/구름), `Parks` (공원)

### **2.2. Data Challenges (직면 과제)**

- **Data Imbalance:** `Food` 클래스는 500장 이상인 반면, 직접 크롤링한 `Parks` 클래스는 122장에 불과하여 약 1:4의 불균형 발생.
- **Visual Ambiguity:**
    - **Buildings vs. Street:** 건물 사진에 도로가 포함되거나, 거리 사진에 건물이 포함되어 경계가 모호함.
    - **Parks vs. Culture:** 한국의 문화재(Culture)는 대부분 숲과 나무(Parks)를 포함하고 있어 시각적 특징이 중첩됨.

---

## 3. Methodology: 4-Step Optimization Pipeline (개발 방법론)

모델 성능을 극대화하기 위해 다음 4단계 파이프라인을 구축하여 체계적으로 접근했습니다.

| **단계** | **전략 (Strategy)** | **주요 활동 (Key Activities)** |
| --- | --- | --- |
| **Step 1** | **Baseline** | EfficientNetV2-S 전이학습 모델 구축, 초기 성능 진단 |
| **Step 2** | **Data Cleaning** | 오분류 데이터 전수 조사 및 노이즈(Noisy Label) 제거 |
| **Step 3** | **Fine-tuning** | **Smart Unfreezing** 및 **Differential Learning Rate** 적용 |
| **Step 4** | **Robustness** | **Data Augmentation(Crop)** 및 **Weighted Loss** 적용 |

---

## 4. Performance Analysis (성능 분석)

### **4.1. Step-by-Step Performance (단계별 성과표)**

| **Metric** | **Step 1 (Baseline)** | **Step 2 (Cleaning)** | **Step 3 (Fine-tuning)** | **Step 4 (Final Robust)** |
| --- | --- | --- | --- | --- |
| **Accuracy** | 94.45% | 97.08% | **98.17% (Peak)** | 97.50% |
| **Macro F1** | 0.94 | 0.96 | **0.98** | 0.97 |
| **특이사항** | 도심지 혼동 심각 | 데이터 노이즈 제거됨 | `Food`/`Person` 만점 | **`Parks` Recall 급상승** |

> **💡 Decision Note:**
Step 3에서 가장 높은 정확도(98.17%)를 기록했으나, Step 4(97.50%)를 **최종 배포 모델(Production Model)**로 선정했습니다. 이는 전체 평균 점수보다 **'공원(Parks)'과 '건물(Buildings)' 같은 취약 클래스의 방어력(Robustness)을 높이는 것이 실제 서비스 품질에 더 중요**하다고 판단했기 때문입니다.
> 

### **4.2. Key Improvements (주요 개선 사항)**

1. **Perfection in Major Classes:**
    - `Food` (514장), `Person` (166장) 클래스에서 **오답률 0% (Recall 1.0)** 달성.
    - `Animals` 클래스 Recall **98.81%** 달성 (Step 1 대비 비약적 상승).
2. **Addressing Minority Class (Parks):**
    - Weighted CrossEntropy Loss 적용으로 `Parks` Recall이 **90.16% → 94.26%**로 **+4.1%p 상승**.
    - 데이터 개수 부족(122장)의 한계를 기술적으로 극복함.

---

## 5. Troubleshooting & Deep Dive (핵심 문제 해결)

본 프로젝트의 가장 큰 기술적 성과는 **'모델이 어디를 보고 판단하는가'**를 제어하여 고질적인 오분류를 해결한 과정입니다.

### **Case 1: The "Buildings vs. Street" Dilemma**

- **문제 (Problem):** 건물 사진의 하단에 도로가 포함될 경우, 모델이 이를 'Street'로 오인하는 현상 발생 (Step 3 기준 오분류 7건).
- **해결 (Solution):** **`RandomResizedCrop` Augmentation** 도입.
    - 이미지의 일부분(창문, 지붕 등 도로가 없는 영역)만 잘라서 학습시켜, 모델이 '도로'가 아닌 '건물 구조'에 집중하도록 강제함.
- **결과 (Result):**
    - `Buildings` → `Street` 오분류: **7건 → 3건 (57% 감소)**.
    - Grad-CAM 분석 결과, 모델의 시선이 도로에서 **건물의 창문과 외벽 패턴**으로 이동했음을 확인.

### **Case 2: Semantic Overlap (Culture vs. Parks)**

- **문제 (Problem):** 문화재(Culture)와 공원(Parks)이 모두 '나무'와 '숲'을 포함하여 상호 오분류 지속.
- **해결 (Solution):** **Class Weighting (가중치 조절)**.
    - 소수 클래스인 `Parks`에 더 높은 페널티를 부여하여, 모호한 경우 `Parks`로 판단하도록 유도(Threshold 조정 효과).
- **결과 (Result):**
    - `Parks`를 놓치는 비율(Miss rate)이 현저히 줄어듦. (단, `Culture`를 `Parks`로 착각하는 Trade-off는 일부 수용).

---

## 6. XAI Analysis (설명 가능한 AI 검증)

**Grad-CAM**을 통해 모델의 판단 근거를 시각화하여 신뢰성을 검증했습니다.

- **Buildings:** 배경이나 하늘이 아닌 **창문 격자, 건물 외벽의 텍스처**에 히트맵 활성화.
- **Street:** 화면 중앙의 **소실점(Vanishing Point)**과 **도로 바닥면**에 집중.
- **Conclusion:** 모델이 단순한 픽셀 매칭이 아니라, 인간이 인지하는 방식과 유사한 **객체의 고유 특징(Feature)**을 학습했음을 증명했습니다.

---

## 7. Conclusion (최종 결론)

본 프로젝트는 단순한 분류 모델 구현을 넘어, **실제 데이터가 가진 불완전성(Noise, Imbalance, Ambiguity)**을 엔지니어링 기술로 극복하는 과정이었습니다.

1. **Data-Centric:** 데이터 크롤링 및 정제(Cleaning)를 통해 기초 체력을 확보했습니다.
2. **Model-Centric:** Smart Unfreezing과 Weighted Loss를 통해 정교함을 더했습니다.
3. **Optimization:** Augmentation전략을 통해 Hard Case(건물/거리 혼동)를 해결했습니다.

최종적으로 선정된 Step 4 모델은 **97.5%의 높은 정확도**와 **모든 클래스에 대한 균형 잡힌 성능**을 갖추었으며, 실제 '여행 일정 생성 서비스'의 스마트 앨범 기능을 수행하기에 충분한 품질을 확보하였습니다.

---

**[Appendix] Technical Stack**

- **Framework:** PyTorch, Torchvision
- **Model:** EfficientNetV2-S (Pre-trained on ImageNet)
- **Optimization:** AdamW, CosineAnnealingLR
- **Analysis:** Scikit-learn (Metrics), Grad-CAM (XAI)
- **Environment:** GPU Accelerated Training
