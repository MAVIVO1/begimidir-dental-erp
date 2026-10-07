import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

// FDI numbering: quadrants 1-4 (permanent) or 5-8 (deciduous), teeth 1-8 per quadrant.
router.get("/:patientId", (req, res) => {
  res.json(db.prepare("SELECT * FROM tooth_records WHERE patientId = ?").all(req.params.patientId));
});

router.put("/:patientId/:toothNumberFDI", requireRole("admin", "doctor"), (req, res) => {
  const { patientId, toothNumberFDI } = req.params;
  const { condition, notes } = req.body;

  const existing = db
    .prepare("SELECT id FROM tooth_records WHERE patientId = ? AND toothNumberFDI = ?")
    .get(patientId, toothNumberFDI);

  if (existing) {
    db.prepare(
      "UPDATE tooth_records SET condition = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?"
    ).run(condition, notes || null, existing.id);
  } else {
    db.prepare(
      "INSERT INTO tooth_records (patientId, toothNumberFDI, condition, notes) VALUES (?, ?, ?, ?)"
    ).run(patientId, toothNumberFDI, condition, notes || null);
  }

  res.json({ patientId: Number(patientId), toothNumberFDI, condition, notes });
});

export default router;
