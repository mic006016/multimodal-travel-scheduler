import React, { useState, useRef } from "react"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react"
import axios from "axios"
import { motion, AnimatePresence } from "framer-motion"

const AI_URL = import.meta.env.VITE_AI_URL + "/ai"

export default function FileUpload({ onUploadSuccess }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("idle") // idle, uploading, success, error
  const [message, setMessage] = useState("")
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const handleFileUpload = async (files) => {
    // Validation loop
    const validFiles = []
    for (let i = 0; i < files.length; i++) {
      if (
        files[i].type === "application/pdf" ||
        files[i].type === "text/plain"
      ) {
        validFiles.push(files[i])
      }
    }

    if (validFiles.length === 0) {
      setUploadStatus("error")
      setMessage("PDF 및 TXT 파일만 허용됩니다.")
      return
    }

    setUploadStatus("uploading")
    setMessage(`${validFiles.length}개 파일 업로드 중...`)

    const formData = new FormData()
    validFiles.forEach((file) => {
      formData.append("files", file)
    })

    try {
      const response = await axios.post(`${AI_URL}/plan/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      console.log("======================")
      console.log(response.data)
      console.log("======================")
      setUploadStatus("success")
      setMessage(
        `${response.data.processed_files.length}개 파일에서 총 ${response.data.total_chunks}개 청크가 성공적으로 처리되었습니다.`,
      )
      if (onUploadSuccess) onUploadSuccess()
    } catch (error) {
      console.error(error)
      setUploadStatus("error")
      setMessage("업로드 실패. 백엔드가 실행 중인가요?")
    }
  }

  return (
    <div className="w-full h-full flex items-center justify-center">
      <motion.div
        layout
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={`
          w-full h-full relative border-2 border-dashed rounded-xl p-8
                   flex flex-col items-center justify-center
          ${
            isDragging
              ? "border-blue-500 bg-blue-50 shadow-[0_0_40px_rgba(59,130,246,0.3)]"
              : "border-blue-200 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-100"
          }
        `}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          accept=".pdf,.txt"
          multiple
          style={{ display: "none" }}
          onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
        />

        {/* Animated Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-50 via-white to-purple-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          <div
            className={`
                        p-4 rounded-full mb-3 transition-all duration-300 shadow-md group-hover:shadow-blue-200 group-hover:scale-110
                        ${
                          isDragging
                            ? "bg-blue-100"
                            : "bg-gradient-to-br from-blue-50 to-indigo-50"
                        }
                    `}
          >
            {uploadStatus === "uploading" ? (
              <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
            ) : uploadStatus === "success" ? (
              <CheckCircle className="w-10 h-10 text-green-500 drop-shadow-sm" />
            ) : uploadStatus === "error" ? (
              <AlertCircle className="w-10 h-10 text-red-500 drop-shadow-sm" />
            ) : (
              <Upload className="w-10 h-10 transition-colors" color="#88AC73" />
            )}
          </div>

          <h3
            style={{
              fontSize: "16px",
              fontWeight: 600,
              marginBottom: "4px",
            }}
          >
            {uploadStatus === "uploading" ? "문서 처리 중..." : "문서 업로드"}
          </h3>

          <p
            style={{
              fontSize: "13px",
              color: "#777",
              textAlign: "center",
              marginbottom: "50px",
            }}
          >
            드래그 앤 드롭 또는 클릭하여 탐색
          </p>
        </div>
      </motion.div>

      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-10 p-2 rounded-lg text-sm text-center border inline-block ${
              uploadStatus === "error"
                ? "bg-red-500/10 border-red-500/20 text-red-600"
                : uploadStatus === "success"
                  ? "bg-blue-500/10 border-blue-500/20 text-red-600 font-bold"
                  : "bg-surfaceHighlight border-black/5 text-textMuted"
            }`}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
