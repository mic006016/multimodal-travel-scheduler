import axios from "axios";
import { useState } from "react";
import Loading from "../../components/Loading";
import PageNation from "../../components/common/pagination/PagiNation";
const Ai = () => {
  const [value, setValues] = useState({});

  const onChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const [poem, setPoem] = useState(null);
  const [loading, setLoading] = useState(false);

  const sendRequest = async () => {
    console.log(value);
    setLoading(true);
    await axios
      .post("/ai/poem", {
        topic: value.topic,
        style: value.style,
      })
      .then((res) => {
        console.log(res.data);
        setPoem(res.data.summary);
        setLoading(false);
      })
      .catch((e) => {
        console.error(e);
      });
  };
  return (
    <div className="album container">
      <div style={{ display: "flex", marginTop: "50px" }}>
        <div style={{ marginRight: "10px" }}>
          <div
            style={{
              width: "250px",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>제목</label>
            <input
              type="text"
              id="title"
              name="topic"
              value={value.topic}
              onChange={onChange}
            ></input>
          </div>
          <div
            style={{
              width: "250px",

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <label>스타일</label>
            <input
              type="text"
              name="style"
              onChange={onChange}
              value={value.style}
            ></input>
          </div>
        </div>
        <button
          style={{ background: "#88ac73", color: "#333", cursor: "pointer" }}
          onClick={sendRequest}
        >
          전송
        </button>
      </div>
      <div style={{ margin: "100px" }}>
        <textarea value={poem} rows="40" cols="40"></textarea>
      </div>
      <PageNation />
      {loading && <Loading />}
    </div>
  );
};

export default Ai;
