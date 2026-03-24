import React, { useState, useEffect } from "react"
import axios from "axios"
import { FileText, Database, Trash2, RefreshCw } from "lucide-react"

const AI_URL = import.meta.env.VITE_AI_URL + "/ai"

export default function DocumentList({ refreshTrigger }) {
  const [stats, setStats] = useState({ count: 0, sources: [] })
  const [isLoading, setIsLoading] = useState(false)

  const fetchStats = async () => {
    setIsLoading(true)
    try {
      const res = await axios.get(`${AI_URL}/plan/stats`)
      console.log("======================")
      console.log(res.data)
      console.log("======================")
      if (res.data) {
        // res.data.sources가 없으면 빈 배열([])을 넣음
        //setStats({
        //  ...res.data,
        //  sources: res.data.sources || [],

        setStats(res.data)
        //})
      }
    } catch (e) {
      console.error("Failed to fetch stats", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
    // Poll every 5 seconds to keep list fresh
    const interval = setInterval(fetchStats, 5000)
    return () => clearInterval(interval)
  }, [refreshTrigger])

  const handleReset = async () => {
    if (!window.confirm("정말로 모든 문서를 초기화하시겠습니까?")) return

    try {
      await axios.post(`${AI_URL}/plan/reset`)
      setStats({ count: 0, sources: [] }) // UI 즉시 반영
      alert("데이터베이스가 초기화되었습니다.")
    } catch (e) {
      alert("초기화 실패")
    }
  }
  return (
    <div className="mt-6 w-full bg-transparent p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-[16px] font-bold text-[#222] flex items-center gap-2">
          <Database size={16} className="text-blue-500" />
          색인된 문서 ({stats.count} 청크)
        </div>
        <div className="flex gap-1">
          <button
            onClick={fetchStats}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors"
            title="새로고침"
          >
            <RefreshCw
              size={12}
              className={`text-slate-400 ${isLoading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={handleReset}
            className="p-1 hover:bg-red-100 rounded-full transition-colors"
            title="DB 초기화"
          >
            <Trash2 size={12} className="text-slate-400 hover:text-red-500" />
          </button>
        </div>
      </div>

      <div className="space-y-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
        {stats.sources.length === 0 ? (
          <p className="text-xs text-slate-400 italic text-center py-2">
            색인된 문서가 없습니다.
          </p>
        ) : (
          stats.sources.map((src, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-100 shadow-sm"
            >
              <FileText size={12} className="text-blue-400 shrink-0" />
              <span className="truncate">{src}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
