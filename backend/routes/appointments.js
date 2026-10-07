import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(
    db
      .prepare(
        `SELECT a.*, p.fullName as patientName, u.name as doctorName
         FROM appointments a
         JOIN patients p ON p.id = a.patientId
         LEFT JOIN users u ON u.id = a.doctorId
         ORDER BY a.scheduledAt DESC`
      )
      .all()
  );
});

router.post("/", requireRole("admin", "receptionist"), (req, res) => {
  const { patientId, doctorId, scheduledAt, notes } = req.body;
  const info = db
    .prepare("INSERT INTO appointments (patientId, doctorId, scheduledAt, notes) VALUES (?, ?, ?, ?)")
    .run(patientId, doctorId || null, scheduledAt, notes || null);
  res.status(201).json({ id: Number(info.lastInsertRowid) });
});

router.patch("/:id/status", requireRole("admin", "doctor", "receptionist"), (req, res) => {
  const { status } = req.body;
  db.prepare("UPDATE appointments SET status = ? WHERE id = ?").run(status, req.params.id);
  res.json({ id: Number(req.params.id), status });
});

export default router;
