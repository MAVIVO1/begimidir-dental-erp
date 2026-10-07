const API_URL = "http://localhost:5001/api";

function authHeaders() {
  const token = localStorage.getItem("dental_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

const Api = {
  async login(email, password) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error((await res.json()).message);
    return res.json();
  },
  async getPatients() {
    const res = await fetch(`${API_URL}/patients`, { headers: authHeaders() });
    return res.json();
  },
  async getPatient(id) {
    const res = await fetch(`${API_URL}/patients/${id}`, { headers: authHeaders() });
    return res.json();
  },
  async createPatient(data) {
    const res = await fetch(`${API_URL}/patients`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(data),
    });
    return res.json();
  },
  async updateTooth(patientId, toothNumberFDI, condition, notes) {
    const res = await fetch(`${API_URL}/tooth-chart/${patientId}/${toothNumberFDI}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ condition, notes }),
    });
    return res.json();
  },
  async createInvoice(patientId, paymentMethod) {
    const res = await fetch(`${API_URL}/invoices`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ patientId, paymentMethod }),
    });
    return res.json();
  },
};
