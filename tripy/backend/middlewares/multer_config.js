const multer = require("multer");
const fs = require("fs");
const path = require("path");

// 1. 폴더 확인 및 생성
const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// 2. 스토리지 설정
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // 한글 파일명 깨짐 방지 처리 (Buffer 사용)
    const decodedFileName = Buffer.from(file.originalname, "latin1").toString(
      "utf8",
    );

    // 파일명 중복 방지를 위해 타임스탬프 추가
    cb(null, Date.now() + "-" + decodedFileName);
  },
});

// 3. Multer 객체 생성
const upload = multer({
  storage: storage,
  // (선택) 파일 크기 제한: 10MB
  limits: { fileSize: 10 * 1024 * 1024 },
});

// 4. upload 객체 자체 내보내기.
module.exports = upload;
