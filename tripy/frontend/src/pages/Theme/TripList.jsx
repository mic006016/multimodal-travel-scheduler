import { useEffect, useState } from "react";
import axios from "axios";
import { useAuthStore } from "../../store/authStore";

const TripList = ({ param }) => {
  const API_URL = import.meta.env.VITE_API_URL || "/api";

  const [data, setData] = useState([]);
  const userId = useAuthStore.getState().user.id;
  const year = param;

  useEffect(() => {
    if (!param) return;

    const loadTrips = async () => {
      try {
        await fetchTrips();
      } catch (error) {
        console.error("Error loading trips:", error);
      }
    };
    loadTrips();
  }, [userId, year]);

  const fetchTrips = async () => {
    try {
      const url = `${API_URL}/theme/trip-list`;

      console.log("Trip List URL :", url);

      const response = await axios.get(url, {
        params: { userId: userId, year: year },
        withCredentials: true,
      });

      setData(response.data);

      console.log("Trip List data :", data);
    } catch (error) {
      console.error("Trip List Select Error:", error);
    } finally {
      console.log("Trip List Fetching Completed");
    }
  };

  // if (!data.length) return <p>검색결과 없음</p>;
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm text-gray-700">
                여행일자
              </th>
              <th className="px-6 py-3 text-left text-sm text-gray-700">
                여행제목
              </th>
              <th className="px-6 py-3 text-left text-sm text-gray-700">
                여행내용
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((data) => (
              <tr key={data.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-2 text-sm text-gray-900">
                  {data.createdAt}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {data.title}
                </td>
                <td className="px-6 py-2 text-sm text-gray-900">
                  {data.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default TripList;
