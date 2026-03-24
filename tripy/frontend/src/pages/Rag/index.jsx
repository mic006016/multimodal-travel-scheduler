import DocumentList from "./DocumentList"
import FileUpload from "./FileUpload"
import React from "react"
import { Sparkles, Heart, Sun, Cloud, Star, Zap } from "lucide-react"

const Rag = () => {
  const [lastUpdated, setLastUpdated] = React.useState(Date.now())

  const handleUploadSuccess = () => {
    setLastUpdated(Date.now())
  }

  return (
    <>
      <div className="rag-container">
        <h3 className="rag-title">RAG</h3>
        <div className="knowledge-card">
          <h4>지식 베이스</h4>

          {/* 문서 업로드 카드 */}
          <div className="inner-card upload-card">
            <div className="upload-content">
              <FileUpload onUploadSuccess={handleUploadSuccess} />
            </div>
          </div>

          <div className="inner-card saved-doc-card">
            <DocumentList refreshTrigger={lastUpdated} />
          </div>

          <div className="usage-guide">
            <div className="usage-title">사용법:</div>
            <ul>
              <li>내부 문서 파일을 업로드하세요.</li>
              <li>
                파일이 크면 처리 시간이 길어질 수 있습니다. (약 30초 소요)
              </li>
              <li>제목 영역에서 질문하세요.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ===== 스타일은 JSX 맨 아래 ===== */}
      <style>
        {`
          body {
            background: #f5f6f7;
            font-family: Pretendard, Arial, sans-serif;
          }

          .rag-container {
            min-height: 100vh;
            margin-top: 150px;   /* fixed 메뉴 대응 */
            display: flex;
            flex-direction: column;
            align-items: center; /* ⭐ 가운데 정렬 핵심 */
          }

           /* RAG 타이틀 */
          .rag-title {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 24px;
            color: #222;
          }

          /* 지식베이스 카드 */
          .knowledge-card {
            width: 800px;
            background: #ffffff;
            border-radius: 12px;
            padding: 24px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          }

          .knowledge-card > h4 {
            margin-bottom: 16px;
            font-size: 20px;
            color: #88AC73;
          }

          /* 내부 카드 공통 */
          .inner-card {
            border: 1px dashed #dcdcdc;
            border-radius: 10px;
           
            margin-bottom: 16px;
            background: #fafafa;
          }

          /* 문서 업로드 카드 */
          .upload-card {
            height: 220px; /* ✅ 높이 증가 */
            margin-top: 30px;
            cursor: pointer;
          }

          .upload-content {
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
          }

          .upload-icon {
            font-size: 32px;
            margin-bottom: 8px;
          }

       
          /* 저장된 문서 카드 */
          .saved-doc-card {
            border: 1px dashed #dcdcdc;   /* 점선 */
            background: #fafafa;          /* 업로드 카드랑 통일 */
            margin-top: 20px;             /* ⭐ 아래로 내리기 */
          }

          

          .saved-doc-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
          }

          .saved-doc-title span {
            font-weight: 400;
            color: #777;
          }

          .saved-doc-actions {
            font-size: 16px;
            color: #999;
            cursor: pointer;
          }

          .saved-doc-empty {
            font-size: 13px;
            color: #999;
            padding-top: 4px;
          }

          .usage-guide {
            margin-top: 20px;
            font-size: 13px;   /* 동일 */
            color: #999;       /* 동일 */
          }
        `}
      </style>
    </>
  )
}

export default Rag
