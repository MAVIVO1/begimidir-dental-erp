import { DatabaseSync } from "node:sqlite";
import path from "path";

const db = new DatabaseSync(path.resolve("clinic.db"));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    passwordHash TEXT NOT NULL,
    role TEXT NOT NULL CHECK(role IN ('admin','doctor','receptionist','pharmacist'))
  );

  CREATE TABLE IF NOT EXISTS patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT NOT NULL,
    phone TEXT,
    region TEXT,
    dateOfBirth TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    doctorId INTEGER,
    scheduledAt TEXT NOT NULL,
    status TEXT DEFAULT 'scheduled' CHECK(status IN ('scheduled','completed','cancelled','no-show')),
    notes TEXT,
    FOREIGN KEY(patientId) REFERENCES patients(id),
    FOREIGN KEY(doctorId) REFERENCES users(id)
  );

  -- FDI/Universal tooth chart: one row per tooth per patient
  CREATE TABLE IF NOT EXISTS tooth_records (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    toothNumberFDI TEXT NOT NULL,
    condition TEXT DEFAULT 'healthy',
    notes TEXT,
    updatedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patientId) REFERENCES patients(id)
  );

  CREATE TABLE IF NOT EXISTS treatments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    toothNumberFDI TEXT,
    description TEXT NOT NULL,
    priceETB REAL NOT NULL,
    performedBy INTEGER,
    performedAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patientId) REFERENCES patients(id),
    FOREIGN KEY(performedBy) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS invoices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patientId INTEGER NOT NULL,
    totalETB REAL NOT NULL,
    paymentMethod TEXT CHECK(paymentMethod IN ('cash','telebirr','cbe')),
    status TEXT DEFAULT 'unpaid' CHECK(status IN ('unpaid','paid')),
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patientId) REFERENCES patients(id)
  );
`);

export default db;
