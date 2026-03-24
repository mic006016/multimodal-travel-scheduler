import { useState, useEffect } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import TripList from "./TripList";
import TripTrend from "./TripTrend";
import TripPreference from "./TripPreference";
import TripSatisfaction from "./TripSatisfaction";
import Theme from "./index";

const API_URL = import.meta.env.VITE_API_URL || "/api";

export default function TripSearch({ onSearch }) {
  console.log("API_URL : ", API_URL);
  console.log("userId ", useAuthStore.getState().user.id);

  const [year, setYear] = useState("");
  const userId = useAuthStore.getState().user.id;

  const onChange = (e) => {
    setYear(e.target.value);
  };

  const fetchDataProfer = async () => {
    try {
      // const url = `${API_URL}/theme/connectToFastApi`; // fast-Api 연결 테스트
      const url = `${API_URL}/theme/ml-arguments`;

      console.log("Trip Profer URL :", url);

      const response = await axios.get(url, {
        params: { userId: userId, year: year },
        withCredentials: true,
      });

      // const data = response.data;

      console.log("profer data :", response.data);
    } catch (error) {
      console.error("profer data Error:", error);
    } finally {
      console.log("profer data Fetching Completed");
    }
  };

  const fetchDataSatisfaction = async () => {
    try {
      const url = `${API_URL}/theme/trip-fastApi-satisfaction`;
      console.log("Trip Satisfy URL :", url);
      const response = await axios.get(url, {
        params: { userId: userId },
        withCredentials: true,
      });

      const data = response.data;

      console.log("Satisfy data :", data);
    } catch (error) {
      console.error("Satisfy data Error:", error);
    } finally {
      console.log("Satisfy data Fetching Completed");
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <form className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div>
          <label className="block mb-2 text-sm text-gray-700">여행년도</label>
          <input
            type="text"
            name="year"
            value={year}
            onChange={onChange}
            placeholder="YYYY"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="button"
            className="w-full px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            onClick={(e) => {
              onSearch(year);
              // setYear("");
            }}
          >
            검색
          </button>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            className="w-full px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
            onClick={(e) => {
              if (!year) {
                alert("여행년도를 입력하세요.");
                return;
              } else {
                fetchDataProfer();
              }
            }}
          >
            선호도 가져오기
          </button>
        </div>
        <div className="flex items-end">
          <button
            type="button"
            className="w-full px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            onClick={(e) => {
              fetchDataSatisfaction();
            }}
          >
            만족도 가져오기
          </button>
        </div>
      </form>
    </div>
  );
}
