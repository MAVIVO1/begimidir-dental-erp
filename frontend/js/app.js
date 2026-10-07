const app = document.getElementById("app");
let currentUser = null;
let currentPatientId = null;

function getUser() {
  const raw = localStorage.getItem("dental_user");
  return raw ? JSON.parse(raw) : null;
}

function render() {
  currentUser = getUser();
  if (!currentUser) return renderLogin();
  const route = location.hash.replace("#", "") || "patients";
  renderLayout(route);
}

function renderLogin() {
  app.innerHTML = `
    <div class="login-wrap card">
      <h2>Begimidir Dental ERP</h2>
      <p style="opacity:0.8">Clinic management — sign in</p>
      <div id="loginError" class="error"></div>
      <input id="email" placeholder="Email" value="admin@begimidir.local" />
      <input id="password" type="password" placeholder="Password" value="admin123" />
      <button id="loginBtn">Sign In</button>
      <p style="font-size:12px; opacity:0.6; margin-top:14px;">
        Try: admin@begimidir.local / admin123, doctor@begimidir.local / doctor123,
        reception@begimidir.local / reception123, pharmacy@begimidir.local / pharmacy123
      </p>
    </div>
  `;

  document.getElementById("loginBtn").onclick = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    try {
      const data = await Api.login(email, password);
      localStorage.setItem("dental_token", data.token);
      localStorage.setItem("dental_user", JSON.stringify(data.user));
      location.hash = "patients";
      render();
    } catch (err) {
      document.getElementById("loginError").textContent = err.message;
    }
  };
}

function renderLayout(route) {
  app.innerHTML = `
    <header>
      <h1>🦷 Begimidir Dental ERP</h1>
      <div>
        <nav style="display:inline-block; margin-right:20px;">
          <a href="#patients">Patients</a>
          <a href="#new-patient">New Patient</a>
        </nav>
        <span style="margin-right:14px; opacity:0.8;">${currentUser.name} (${currentUser.role})</span>
        <button class="secondary" id="logoutBtn">Log out</button>
      </div>
    </header>
    <main id="main"></main>
  `;
  document.getElementById("logoutBtn").onclick = () => {
    localStorage.removeItem("dental_token");
    localStorage.removeItem("dental_user");
    render();
  };

  if (route === "new-patient") renderNewPatient();
  else if (route.startsWith("patient/")) renderPatientDetail(route.split("/")[1]);
  else renderPatientList();
}

async function renderPatientList() {
  const main = document.getElementById("main");
  main.innerHTML = `<div class="card"><h2>Patients</h2><table id="patientsTable"></table></div>`;
  const patients = await Api.getPatients();
  const table = document.getElementById("patientsTable");
  table.innerHTML = `
    <tr><th>Name</th><th>Phone</th><th>Region</th><th></th></tr>
    ${patients
      .map(
        (p) => `
      <tr>
        <td>${p.fullName}</td>
        <td>${p.phone || "-"}</td>
        <td>${p.region || "-"}</td>
        <td><a href="#patient/${p.id}" style="color:#5edeb2">Open chart →</a></td>
      </tr>`
      )
      .join("")}
  `;
}

function renderNewPatient() {
  const main = document.getElementById("main");
  main.innerHTML = `
    <div class="card">
      <h2>New Patient</h2>
      <input id="fullName" placeholder="Full name" />
      <input id="phone" placeholder="Phone" />
      <input id="region" placeholder="Region (e.g. Debre Tabor)" />
      <input id="dob" type="date" placeholder="Date of birth" />
      <button id="createBtn">Create Patient</button>
    </div>
  `;
  document.getElementById("createBtn").onclick = async () => {
    const fullName = document.getElementById("fullName").value;
    const phone = document.getElementById("phone").value;
    const region = document.getElementById("region").value;
    const dateOfBirth = document.getElementById("dob").value;
    const patient = await Api.createPatient({ fullName, phone, region, dateOfBirth });
    location.hash = `patient/${patient.id}`;
  };
}

async function renderPatientDetail(patientId) {
  currentPatientId = patientId;
  const main = document.getElementById("main");
  const patient = await Api.getPatient(patientId);

  main.innerHTML = `
    <div class="card">
      <h2>${patient.fullName}</h2>
      <p style="opacity:0.75">${patient.phone || "-"} • ${patient.region || "-"}</p>
    </div>
    <div class="card">
      <h3>FDI Tooth Chart <span style="font-size:12px; opacity:0.6;">(click a tooth to cycle its condition)</span></h3>
      <div id="toothChart"></div>
    </div>
    <div class="card">
      <h3>Treatments</h3>
      <table>
        <tr><th>Tooth</th><th>Description</th><th>Price (ETB)</th></tr>
        ${patient.treatments
          .map((t) => `<tr><td>${t.toothNumberFDI || "-"}</td><td>${t.description}</td><td>${t.priceETB}</td></tr>`)
          .join("")}
      </table>
    </div>
    <div class="card">
      <h3>Generate Invoice</h3>
      <select id="paymentMethod">
        <option value="cash">Cash</option>
        <option value="telebirr">Telebirr</option>
        <option value="cbe">CBE Birr</option>
      </select>
      <button id="invoiceBtn">Generate Invoice</button>
      <p id="invoiceResult"></p>
    </div>
  `;

  const chartContainer = document.getElementById("toothChart");
  renderToothChart(chartContainer, patient.teeth, async (toothNumberFDI, currentCondition) => {
    const nextCondition = cycleCondition(currentCondition);
    await Api.updateTooth(patientId, toothNumberFDI, nextCondition);
    renderPatientDetail(patientId);
  });

  document.getElementById("invoiceBtn").onclick = async () => {
    const method = document.getElementById("paymentMethod").value;
    const invoice = await Api.createInvoice(patientId, method);
    document.getElementById("invoiceResult").textContent =
      `Invoice #${invoice.id} — ETB ${invoice.totalETB} via ${invoice.paymentMethod} (${invoice.status})`;
  };
}

window.addEventListener("hashchange", render);
render();
