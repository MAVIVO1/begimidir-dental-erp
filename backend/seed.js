import bcrypt from "bcryptjs";
import db from "./db.js";

async function seed() {
  db.exec("DELETE FROM invoices; DELETE FROM treatments; DELETE FROM tooth_records; DELETE FROM appointments; DELETE FROM patients; DELETE FROM users;");

  const users = [
    { name: "Dr. Amanuel Fikre", email: "admin@begimidir.local", role: "admin", password: "admin123" },
    { name: "Dr. Selam Worku", email: "doctor@begimidir.local", role: "doctor", password: "doctor123" },
    { name: "Ruth Ayele", email: "reception@begimidir.local", role: "receptionist", password: "reception123" },
    { name: "Tesfaye Molla", email: "pharmacy@begimidir.local", role: "pharmacist", password: "pharmacy123" },
  ];

  for (const u of users) {
    const passwordHash = await bcrypt.hash(u.password, 10);
    db.prepare("INSERT INTO users (name, email, passwordHash, role) VALUES (?, ?, ?, ?)").run(
      u.name,
      u.email,
      passwordHash,
      u.role
    );
  }

  const patientInfo = db
    .prepare("INSERT INTO patients (fullName, phone, region, dateOfBirth) VALUES (?, ?, ?, ?)")
    .run("Meron Getachew", "0911223344", "Debre Tabor", "1996-03-14");

  db.prepare("INSERT INTO tooth_records (patientId, toothNumberFDI, condition) VALUES (?, ?, ?)").run(
    patientInfo.lastInsertRowid,
    "16",
    "cavity"
  );

  db.prepare(
    "INSERT INTO treatments (patientId, toothNumberFDI, description, priceETB, performedBy) VALUES (?, ?, ?, ?, ?)"
  ).run(patientInfo.lastInsertRowid, "16", "Composite filling", 850, 2);

  console.log("Seed complete.");
  console.log("Logins: admin@begimidir.local / admin123, doctor@begimidir.local / doctor123,");
  console.log("        reception@begimidir.local / reception123, pharmacy@begimidir.local / pharmacy123");
}

seed();
