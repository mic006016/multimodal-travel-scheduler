import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const data = [
  { name: "음식", satis: 28, dissatis: 12 },
  { name: "교통", satis: 25, dissatis: 15 },
  { name: "친절", satis: 18, dissatis: 20 },
  { name: "날씨", satis: 15, dissatis: 25 },
  { name: "청결", satis: 14, dissatis: 28 },
  { name: "분위기", satis: 28, dissatis: 12 },
  { name: "숙소", satis: 25, dissatis: 15 },
  { name: "시설", satis: 18, dissatis: 20 },
  { name: "안내", satis: 15, dissatis: 25 },
];

const SATISFACTION_COLORS = [
  "#10b981",
  "#22c55e",
  "#84cc16",
  "#a3e635",
  "#537715",
  "#b7c2a6",
  "#546b2b",
  "#7a8d5a",
  "#9ff013",
];
const DISSATISFACTION_COLORS = [
  "#ef4444",
  "#f87171",
  "#fca5a5",
  "#fb923c",
  "#fdba74",
  "#998167",
  "#887d71",
  "#e68013",
  "#c78034",
];

export function TripSatisfaction({ param }) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const [satisfactionData, setSatisfactionData] = useState([]);
  const userId = useAuthStore.getState().user.id;
  const year = param;

  console.log("satis : ", param);

  useEffect(() => {
    if (!param) return;

    const loadTrips = async () => {
      try {
        await fetchSatisfaction();
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    };
    loadTrips();
  }, [userId, year]);

  const fetchSatisfaction = async () => {
    try {
      const url = `${API_URL}/theme/trip-satisfaction`;
      console.log("Trip satisfaction URL :", url);
      const response = await axios.get(url, {
        params: { userId: userId, year: year },
        withCredentials: true,
      });

      setSatisfactionData(response.data);

      console.log("Satisfaction data :", year);
    } catch (error) {
      console.error("Satisfaction Select Error:", error);
    } finally {
      console.log("Satisfaction Fetching Completed");
    }
  };

  const satisArr = [];
  satisfactionData.forEach((item) => {
    satisArr.push({ name: item.name, value: item.satis });
  });

  const dissatisArr = [];
  satisfactionData.forEach((item) => {
    dissatisArr.push({ name: item.name, value: item.dissatis });
  });

  // if (!satisfactionData.length) return <p>검색결과 없음</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 만족 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="mb-4 text-gray-900">만족</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={satisArr}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {satisArr.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={SATISFACTION_COLORS[index % SATISFACTION_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* 불만족 차트 */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="mb-4 text-gray-900">불만족</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={dissatisArr}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {dissatisArr.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    DISSATISFACTION_COLORS[
                      index % DISSATISFACTION_COLORS.length
                    ]
                  }
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "6px",
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
export default TripSatisfaction;
