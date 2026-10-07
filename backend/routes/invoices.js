import express from "express";
import db from "../db.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();
router.use(requireAuth);

router.get("/patient/:patientId", (req, res) => {
  res.json(db.prepare("SELECT * FROM invoices WHERE patientId = ? ORDER BY createdAt DESC").all(req.params.patientId));
});

// Generate an invoice by summing unbilled treatments for a patient (ETB).
router.post("/", requireRole("admin", "receptionist", "pharmacist"), (req, res) => {
  const { patientId, paymentMethod } = req.body;
  const validMethods = ["cash", "telebirr", "cbe"];
  if (!validMethods.includes(paymentMethod)) {
    return res.status(400).json({ message: "paymentMethod must be cash, telebirr, or cbe" });
  }

  const treatments = db.prepare("SELECT priceETB FROM treatments WHERE patientId = ?").all(patientId);
  const totalETB = treatments.reduce((sum, t) => sum + t.priceETB, 0);

  const info = db
    .prepare("INSERT INTO invoices (patientId, totalETB, paymentMethod) VALUES (?, ?, ?)")
    .run(patientId, totalETB, paymentMethod);

  res.status(201).json({ id: Number(info.lastInsertRowid), patientId, totalETB, paymentMethod, status: "unpaid" });
});

router.patch("/:id/pay", requireRole("admin", "receptionist"), (req, res) => {
  db.prepare("UPDATE invoices SET status = 'paid' WHERE id = ?").run(req.params.id);
  res.json({ id: Number(req.params.id), status: "paid" });
});

export default router;
