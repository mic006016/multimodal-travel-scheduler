// server/routes/users.js
const express = require("express");
const {
  jointrip,
  withdrawtrip,
  getUsers,
  toggleAction,
  getUserByEmail,
} = require("../db/join_db");
const router = express.Router();

// POST /api/users/jointrip - 유저가 여행 참가
router.post("/", async (req, res, next) => {
  const { tripId, userId } = req.body;
  console.log("tripId", tripId, "userId", userId);
  try {
    const result = await jointrip(userId, tripId);
    return res.status(200).json({ success: true, message: result });
  } catch (e) {
    console.error(e);
    console.log("e", e);
    return res.status(400).json({ success: false, message: e });
  }
});
router.post("/withdraw", async (req, res, next) => {
  const { tripId, userId } = req.body;
  console.log("tripId", tripId, "userId", userId);
  try {
    const result = await withdrawtrip(userId, tripId);
    console.log("result", result);
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e);
    console.log("e", e);
    return res.status(400).json({ success: false, message: e });
  }
});

router.get("/getUsers", async (req, res) => {
  // console.log("getUsers");
  try {
    const result = await getUsers();
    console.log(result);
    return res.status(200).json({ success: "OK", users: result });
  } catch (e) {}
});
router.post("/toggle", async (req, res) => {
  // console.log("aaaa");
  const { userId, toggle } = req.body;
  // console.log("userId", userId, "toggle", toggle);
  try {
    await toggleAction(userId, toggle);
    return res.status(200).json({ success: "OK" });
  } catch (e) {
    console.error(e);
  }
});
router.post("/getUserByEmail", async (req, res) => {
  const { toUserEmail } = req.body;
  console.log("email", toUserEmail);
  try {
    const result = await getUserByEmail(toUserEmail);
    console.log(result);
    return res.status(200).json({ success: "OK", users: result });
  } catch (e) {}
});
module.exports = router;
