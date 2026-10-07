import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/", (req, res) => {
  res.json(db.prepare("SELECT * FROM patients ORDER BY createdAt DESC").all());
});

router.get("/:id", (req, res) => {
  const patient = db.prepare("SELECT * FROM patients WHERE id = ?").get(req.params.id);
  if (!patient) return res.status(404).json({ message: "Not found" });
  const teeth = db.prepare("SELECT * FROM tooth_records WHERE patientId = ?").all(req.params.id);
  const treatments = db.prepare("SELECT * FROM treatments WHERE patientId = ?").all(req.params.id);
  res.json({ ...patient, teeth, treatments });
});

router.post("/", requireRole("admin", "receptionist"), (req, res) => {
  const { fullName, phone, region, dateOfBirth } = req.body;
  const info = db
    .prepare("INSERT INTO patients (fullName, phone, region, dateOfBirth) VALUES (?, ?, ?, ?)")
    .run(fullName, phone || null, region || null, dateOfBirth || null);
  res.status(201).json({ id: Number(info.lastInsertRowid), fullName, phone, region, dateOfBirth });
});

export default router;
