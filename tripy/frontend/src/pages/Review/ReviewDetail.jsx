import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Loading from "../../components/Loading"
import styles from "./ReviewDetail.module.scss"

const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://3.25.11.158:5000"
const API_URL = import.meta.env.VITE_API_URL || "/api"
const instance = axios.create({ withCredentials: true })

function ReviewDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)
  const [currentUserId, setCurrentUserId] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [descriptions, setDescriptions] = useState({})
  const [aiSummary, setAiSummary] = useState("")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await instance.get(`${API_URL}/review/${id}`)
        setPost(res.data)
        setCurrentUserId(res.data.currentUserId)

        if (res.data.plan) {
          setPrompt(res.data.plan)
        }

        if (res.data.images) {
          const initialDesc = {}
          res.data.images.forEach((img) => {
            if (img.post) {
              initialDesc[img.id] = img.post
            }
          })
          setDescriptions(initialDesc)
        }
      } catch (e) {
        console.error("로딩 실패:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchPost()
  }, [id])

  const handleDescChange = (imgId, value) => {
    setDescriptions((prev) => ({ ...prev, [imgId]: value }))
  }

  const handleSaveIndividual = async (imgId) => {
    try {
      await instance.post(`${API_URL}/review/${id}/descriptions/${imgId}`, {
        post: descriptions[imgId] || "",
      })
      alert("내용이 성공적으로 업데이트되었습니다.")
    } catch (e) {
      if (e.response?.status === 403) {
        alert("본인이 작성한 글만 수정할 수 있습니다.")
      } else {
        alert("저장/수정 실패")
      }
    }
  }

  const handleEdit = (imgId) => {
    handleSaveIndividual(imgId)
  }

  const handleDelete = (imgId) => {
    if (window.confirm("설명을 삭제하시겠습니까?")) {
      setDescriptions((prev) => {
        const newDesc = { ...prev }
        delete newDesc[imgId]
        return newDesc
      })
    }
  }

  const handleAiSummary = () => {
    const allTexts = Object.values(descriptions).join(" ")
    const tripId = `${id}`

    alert("AI 요약을 생성 중입니다... 잠시만 기다려주세요.")
    try {
      instance
        .post(`/ai/review/`, {
          post: allTexts,
          tripId: tripId,
        })
        .then(async (res) => {
          const summaryText = res.data.summary
          setAiSummary(`[AI 요약 결과]: ${summaryText}`)
          try {
            await instance.put(`${API_URL}/review/${tripId}/description`, {
              description: summaryText,
            })
            alert("AI 요약이 생성되고 저장되었습니다.")
          } catch (saveError) {
            console.error(saveError)
            alert("요약은 생성되었으나 저장에 실패했습니다.")
          }
        })
    } catch (e) {
      console.error(e)
      alert("AI 요청 실패")
    }
  }

  if (loading) return <Loading />
  if (!post)
    return <div className={styles.container}>게시글을 찾을 수 없습니다.</div>

  return (
    <div className={styles.container}>
      {/* 기존 header 제거하고 main 안으로 통합 */}

      <main className={styles.mainContent}>
        {/* 1. 좌측: 프롬프트 영역 (사이드바 형태로 변경) */}
        <aside className={styles.promptSection}>
          <div className={styles.sidebarTitle}>AI 여행 계획</div>
          <textarea
            placeholder="AI가 생성한 여행 계획이 여기에 표시됩니다."
            value={prompt}
            readOnly={true}
            // 인라인 height 삭제 -> CSS에서 제어
          />
        </aside>

        {/* 2. 중앙: 이미지 리스트 */}
        <section className={styles.editorWrapper}>
          <div className={styles.imageList}>
            {post.images?.map((img, index) => {
              // 1. URL이 http로 시작하면 그대로 사용
              // 2. 아니면 서버 주소 + DB 저장 경로 결합
              // 3. ★핵심★ 한글 파일명이 깨지지 않도록 encodeURI 사용
              // 4. replace(/\\/g, "/")는 윈도우 역슬래시(\)를 슬래시(/)로 바꿔줌

              let imageUrl = ""
              if (img.url) {
                if (img.url.startsWith("http")) {
                  imageUrl = img.url
                } else {
                  // DB에 'uploads/파일명'으로 저장되어 있으므로
                  // SERVER_URL + "/" + img.url 형태가 되어야 함
                  // 예: http://3.25.11.158 + / + uploads/파일명
                  const cleanUrl = img.url.replace(/\\/g, "/")
                  imageUrl = `${SERVER_URL}/${encodeURI(cleanUrl)}`
                }
              }

              const isMyPost = !img.authorId || img.authorId === currentUserId

              return (
                <div key={img.id || index} className={styles.imageRow}>
                  <div className={styles.imageBox}>
                    <img src={imageUrl} alt={`리뷰 이미지 ${index}`} />
                  </div>

                  <div className={styles.textBox}>
                    <textarea
                      placeholder={
                        isMyPost
                          ? "사진 설명을 입력하세요."
                          : "다른 사용자가 작성한 글입니다."
                      }
                      value={descriptions[img.id] || ""}
                      onChange={(e) => handleDescChange(img.id, e.target.value)}
                      readOnly={!isMyPost}
                      className={!isMyPost ? styles.readOnlyTextarea : ""}
                    />

                    {isMyPost && (
                      <div className={styles.buttonGroup}>
                        <button
                          className={styles.btnBlue}
                          onClick={() => handleSaveIndividual(img.id)}
                        >
                          저장
                        </button>
                        <button
                          className={styles.btnGray}
                          onClick={() => handleEdit(img.id)}
                        >
                          수정
                        </button>
                        <button
                          className={styles.btnRed}
                          onClick={() => handleDelete(img.id)}
                        >
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. 우측: AI 요약 영역 */}
        <aside className={styles.sideSummary}>
          <div className={styles.sidebarTitle}>AI 요약 결과</div>
          <div className={styles.summaryDisplay}>
            {aiSummary || "이미지 설명을 기반으로 요약이 생성됩니다."}
          </div>
          <button className={styles.summaryBtn} onClick={handleAiSummary}>
            요약 버튼
          </button>
        </aside>
      </main>
    </div>
  )
}

export default ReviewDetail
