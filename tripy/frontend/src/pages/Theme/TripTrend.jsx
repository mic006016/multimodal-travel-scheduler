import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

export function TripTrend({ param }) {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const [trendData, setTrendData] = useState([]);
  const userId = useAuthStore.getState().user.id;
  const year = param;

  useEffect(() => {
    if (!param) return;

    const loadTrips = async () => {
      try {
        await fetchTrend();
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    };
    loadTrips();
  }, [userId, year]);

  const fetchTrend = async () => {
    try {
      const url = `${API_URL}/theme/trip-trend`;
      console.log("Trip trend URL :", url);
      const response = await axios.get(url, {
        params: { userId: userId, year: year },
        withCredentials: true,
      });

      setTrendData(response.data);

      console.log("Trend data :", trendData);
    } catch (error) {
      console.error("Trend Select Error:", error);
    } finally {
      console.log("Trend Fetching Completed");
    }
  };
  // if (!trendData.length) return <p>검색결과 없음</p>;
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
      <h4 className="mb-4 text-gray-900">여행추이</h4>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={trendData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="mm" stroke="#6b7280" />
          <YAxis stroke="#6b7280" />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="val"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: "#3b82f6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TripTrend;
