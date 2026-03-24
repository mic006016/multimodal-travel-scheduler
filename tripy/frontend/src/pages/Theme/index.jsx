import { useState } from "react";
import TripSearch from "./TripSearch";
import TripList from "./TripList";
import TripTrend from "./TripTrend";
import TripPreference from "./TripPreference";
import TripSatisfaction from "./TripSatisfaction";
import "./tailwind.css";
import "./theme.css";
import "./fonts.css";

export const Theme = () => {
  const [params, setParams] = useState("");

  return (
    <div
      className="min-h-screen bg-gray-50 p-6"
      style={{ paddingTop: "220px" }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="mb-8">
          <h3 className="text-gray-900 mb-2">여행 감성 분석</h3>
          <p className="text-gray-600">여행 데이터를 한눈에 확인하세요</p>
        </div>

        {/* 검색 필터 */}
        <TripSearch onSearch={setParams} />

        {/* 여행 목록 테이블 */}
        <TripList param={params} />

        {/* 차트 영역 */}
        <div className="space-y-6">
          {/* 여행추이 차트 */}
          <TripTrend param={params} />

          {/* 여행 유형 차트 */}
          <TripPreference param={params} />

          {/* 만족/불만족 차트 */}
          <TripSatisfaction param={params} />
        </div>
      </div>
    </div>
  );
};

export default Theme;
