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

const COLORS = ["#10b981", "#3b82f6", "#f59e0b"];

export function TripType({ param }) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const [typeData, setTypeData] = useState([]);
  const userId = useAuthStore.getState().user.id;
  const year = param;

  useEffect(() => {
    if (!param) return;

    const loadTrips = async () => {
      try {
        await fetchPreferences();
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    };
    loadTrips();
  }, [userId, year]);

  const fetchPreferences = async () => {
    try {
      const url = `${API_URL}/theme/trip-preferences`;
      console.log("Trip preference URL :", url);
      const response = await axios.get(url, {
        params: { userId: userId, year: year },
        withCredentials: true,
      });

      setTypeData(response.data);

      console.log("Preference data :", typeData);
    } catch (error) {
      console.error("Preference Select Error:", error);
    } finally {
      console.log("Preference Fetching Completed");
    }
  };

  // if (!typeData.length) return <p>검색결과 없음</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h3 className="mb-4 text-gray-900">여행 유형</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={typeData}
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
            {typeData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
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
  );
}
export default TripType;
