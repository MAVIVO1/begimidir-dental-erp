import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/patient/:patientId", (req, res) => {
  res.json(db.prepare("SELECT * FROM treatments WHERE patientId = ? ORDER BY performedAt DESC").all(req.params.patientId));
});

router.post("/", requireRole("admin", "doctor"), (req, res) => {
  const { patientId, toothNumberFDI, description, priceETB, performedBy } = req.body;
  const info = db
    .prepare(
      "INSERT INTO treatments (patientId, toothNumberFDI, description, priceETB, performedBy) VALUES (?, ?, ?, ?, ?)"
    )
    .run(patientId, toothNumberFDI || null, description, priceETB, performedBy || req.user.id);
  res.status(201).json({ id: Number(info.lastInsertRowid) });
});

export default router;
