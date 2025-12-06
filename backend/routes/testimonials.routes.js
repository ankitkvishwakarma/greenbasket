import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.json([
    { id: 1, name: "Rahul Kumar", message: "Great service!" },
    { id: 2, name: "Anjali Singh", message: "Fresh vegetables delivered!" },
    { id: 2, name: "Anjali Singh", message: "Fresh vegetables delivered!" },
    { id: 2, name: "Anjali Singh", message: "Fresh vegetables delivered!" }
  ]);
});

export default router;
