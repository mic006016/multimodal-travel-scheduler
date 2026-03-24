const RecommendCard = ({ data }) => {
  return (
    <div className="card mb-4 shadow-sm border-0">
      <div className="row g-0 align-items-center">
        {/* 이미지 */}
        <div className="col-md-4">
          <img
            src={data.image}
            alt={data.title}
            className="img-fluid rounded-start"
            style={{
              height: "220px",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>

        {/* 내용 */}
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="fw-bold">{data.title}</h5>

            <p className="text-danger fw-semibold mb-1">추천 이유</p>
            <p className="mb-2">{data.reason}</p>

            <p className="text-muted">{data.description}</p>

            <div className="bg-light rounded p-2 mb-3 small">
              추천 기간: {data.period} | 베스트 시즌: {data.season} | 예상 비용:{" "}
              {data.cost}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-success flex-fill">
                ☆ 즐겨찾기에 추가
              </button>
              <button className="btn btn-success flex-fill">
                📅 이 여행으로 계획 세우기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendCard;
