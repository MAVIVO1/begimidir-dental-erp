# Begimidir Dental ERP

> A full-stack dental clinic management system built for **Begimidir Clinic** in Debre Tabor, Ethiopia. Patients, appointments, treatments, billing, and pharmacy in one place, localized for Ethiopian clinics.

![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-node%3Asqlite-003B57?logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## Overview

Begimidir Dental ERP replaces paper records and scattered spreadsheets with a single system the whole clinic team can use. Each staff member signs in with a role (admin, doctor, receptionist, or pharmacist) and sees only what their job requires.

The system is built around how clinics in Ethiopia actually work: prices are in **ETB**, patient records include **Ethiopian regional fields**, and payments support **Telebirr** and **CBE** alongside cash.

## Features

- **Role-based access control** with four roles: Admin, Doctor, Receptionist, and Pharmacist
- **Secure authentication** using JSON Web Tokens (JWT)
- **Interactive dental chart** with both **FDI** and **Universal** tooth numbering
- **Ethiopian localization**: ETB currency, regional address fields, and local payment methods (Telebirr, CBE)
- **Dashboard analytics** with custom-built SVG charts (no heavy chart library)
- **Modular REST API** organized into nine route modules
- **Zero native build steps**: uses Node's built-in `node:sqlite`, so there are no compilation issues on install
- **Lightweight frontend**: a vanilla JavaScript single-page app with hash-based routing

## User Roles

| Role | Typical responsibilities |
| --- | --- |
| **Admin** | Manage staff accounts, view reports and clinic-wide analytics |
| **Doctor** | Clinical records, treatment plans, dental chart |
| **Receptionist** | Patient registration, appointments, billing and payments |
| **Pharmacist** | Dispense and track medications and stock |

## Tech Stack

| Layer | Technology |
| --- | --- |
| Backend | Node.js, Express |
| Database | SQLite via the built-in `node:sqlite` module |
| Auth | JWT with role-based middleware |
| Frontend | Vanilla HTML, CSS, and JavaScript (SPA, hash routing) |
| Charts | Custom SVG |
| Typography | Space Grotesk, JetBrains Mono |

## Project Structure

```
begimidir-dental-erp/
├── backend/      # Express API, database, auth, and route modules
├── frontend/     # Single-page app (HTML, CSS, JS)
├── .gitattributes
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js 22.13 or later** (required for the built-in `node:sqlite` module)
- npm
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/MAVIVO1/begimidir-dental-erp.git
cd begimidir-dental-erp

# 2. Install backend dependencies
cd backend
npm install
```

### Configuration

Create a `.env` file inside `backend/`:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-string
```

> **Never commit your `.env` file or database file.** Both are listed in `.gitignore`.

### Run the app

```bash
# From the backend folder
npm start
```

Then open the app in your browser at `http://localhost:3000`.

> If the frontend is served separately, open `frontend/index.html` with a local server such as the VS Code Live Server extension.

## API Overview

The REST API is protected by JWT. Send the token with each request:


Routes are grouped into nine modules, and every route is checked against the signed-in user's role before it runs.

## Security Notes

- Passwords are hashed before storage
- Routes are protected by JWT and role checks
- Change the default `JWT_SECRET` before deploying
- Use HTTPS in production

## Roadmap

- [ ] SMS appointment reminders
- [ ] PDF invoices and prescriptions
- [ ] Amharic language interface
- [ ] Automated database backups
- [ ] Docker setup

## Contributing

Contributions, issues, and feature requests are welcome. Fork the repo, create a feature branch, and open a pull request.


## License

Distributed under the MIT License. Add a `LICENSE` file to the repository to make this official.
