import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./db.js"; // ensures schema is created on boot

import authRoutes from "./routes/auth.js";
import patientRoutes from "./routes/patients.js";
import appointmentRoutes from "./routes/appointments.js";
import toothChartRoutes from "./routes/toothChart.js";
import treatmentRoutes from "./routes/treatments.js";
import invoiceRoutes from "./routes/invoices.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/tooth-chart", toothChartRoutes);
app.use("/api/treatments", treatmentRoutes);
app.use("/api/invoices", invoiceRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Begimidir Dental ERP API running on port ${PORT}`));

export default app;
