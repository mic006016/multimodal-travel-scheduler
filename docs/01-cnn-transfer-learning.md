## **📊 EfficientNetV2-S 이미지 분류 모델 성능 분석 보고서**
.
**1. 모델 개요 및 종합 성능 평가**

본 분석은 **EfficientNetV2-S** 모델을 전이 학습(Transfer Learning)하여 총 11개의 클래스를 분류한 결과를 바탕으로 함.

**1.1 종합 지표**

| Confusion Matrix | Classification Report |
|:---:|:---:|
| <img height="350" alt="image" src="https://github.com/user-attachments/assets/8a484de7-4863-410b-a57c-898cb3b50c63" /> | <img height="300" alt="image" src="https://github.com/user-attachments/assets/aa90c272-d149-433e-ab40-d69b27edaeab" /> |

모델은 전반적으로 특정 클래스에 편향되지 않고 고른 성능을 내는 안정적인 상태임.

- **정확도 (Accuracy):** 94.45% (3,567개 데이터 중 94.5% 정답)
- **Macro Avg F1:** 93.75%
- **Weighted Avg F1:** 94.44%

**1.2 총평**

Confusion Matrix 확인 시 정답을 맞춘 대각선 성분이 매우 뚜렷하여 **상용화 수준에 근접한 우수한 분류 성능**을 보임. 특히 객체 특징이 명확한 클래스에서 압도적인 성적을 거둠.

---

**2. 클래스별 상세 성능 분석**

**2.1 우수 성능 클래스 (Top 3)**

특징 추출이 용이하고 형태적 변동성이 적은 클래스들이 상위권을 차지.

1. **Food (음식):** F1-Score 0.9903. 색감과 근접 촬영 구도가 명확하여 거의 완벽하게 분류.
2. **Person (인물):** F1-Score 0.9851. 실제 인물을 놓치는 경우(Recall 0.9940)가 거의 없음.
3. **Forest (숲):** F1-Score 0.9730. 높은 Recall(0.9854)을 기록함.
4. *기타 강점:* **Animals(동물)** 클래스 역시 형태적 특징 학습이 잘 되어 오분류가 극히 적음.

**2.2 하위 성능 클래스 (Bottom 3)**

상대적으로 데이터가 부족하거나 시각적 유사성이 높은 클래스들임.

1. **Parks (공원):** F1-Score 0.8766 (최저). 데이터 개수가 115개로 가장 적은 것이 주 원인.
2. **Buildings (건물):** F1-Score 0.8846. 실제 건물을 건물로 인식하지 못하는 케이스가 존재.
3. **Street (거리):** F1-Score 0.8981. 거리가 아닌 것을 거리로 잘못 예측하는 경우가 발생.

---

**3. 주요 오분류 패턴 분석 (Confusion Points)**

오분류는 모델의 구조적 문제보다 **데이터 자체의 '의미적 중복성(Semantic Overlap)'**에서 주로 기인함.

| Buildings → Street 오인 | Street → Buildings 오인 |
|:---:|:---:|
| <img height="400" alt="image" src="https://github.com/user-attachments/assets/0c538b38-f500-412f-9889-642afd016e0d" /> | <img height="400" alt="image" src="https://github.com/user-attachments/assets/b820f715-24e6-4c4f-9191-8d1ba8e42953" /> |

- **도심 환경의 모호성 (Buildings ↔ Street):**
    - 건물을 거리로(24건), 거리를 건물로(18건) 혼동하는 사례가 가장 많음.
    - 도시 풍경, 콘크리트, 직선적 구조라는 특징을 공유하기 때문임.

 | Culture → Parks 오인 | Parks → Culture 오인 |
|:---:|:---:|
| <img height="400" alt="image" src="https://github.com/user-attachments/assets/6f0133cb-1235-4646-b029-d704b5800362" /> | <img height="400" alt="image" src="https://github.com/user-attachments/assets/574f3197-e60e-4f72-8961-72a07b2c263b" /> |
  
- **자연과 문화재의 경계 (Culture ↔ Parks):**
    - 고궁이나 사찰(Culture)이 나무나 정원(Parks)을 배경으로 포함하고 있어 발생하는 혼동.

---

**4. 데이터 분포 현황**

데이터의 양과 모델 성능 사이에는 뚜렷한 상관관계가 관찰됨.

- **최다 데이터:** Animals (674개) → F1-Score 0.96으로 고성능.
- **최소 데이터:** Parks (115개) → F1-Score 0.87로 상대적 저성능.

---

**5. 향후 개선을 위한 액션 플랜 (Action Plan)**

1. **데이터 정제 및 기준 재정립:**
    - 혼동이 잦은 Buildings와 Street 이미지를 직접 검수하여 모호한 사진은 라벨링을 수정하거나 제외.
      
2. **맞춤형 데이터 증강 (Augmentation):**
    - 데이터가 부족한 **Parks, Person** 클래스를 추가 수집하거나 증강.
    - Culture 클래스는 건축물 특징이 부각되도록 RandomCrop 비율을 조정하거나 단청 색상을 강조하는 기법을 적용.
      
3. **전략적 클래스 재구성:**
    - 도심 분류가 중요하지 않다면 Buildings와 Street를 **'City(도심)'**로 통합하여 정확도를 높이는 계층적 분류를 고려.
      
4. **모델 학습 고도화:**
    - 오분류된 이미지만 모아 다시 학습시키는 **Hard Example Mining** 기법을 도입.
    - Buildings 클래스의 낮은 Recall(0.8779) 보완을 위해 False Negative 사례를 집중 분석.
