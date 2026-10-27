(() => {
  "use strict";
  const STORAGE_KEY = "asistefacil_records_v1";
  const $ = (selector) => document.querySelector(selector);
  const form = $("#attendance-form");
  const nameInput = $("#person-name");
  const dateInput = $("#attendance-date");
  const statusInput = $("#attendance-status");
  const nameError = $("#name-error");
  const formMessage = $("#form-message");
  const toast = $("#toast");
  let records = loadRecords();
  let toastTimer;

  function localDateString(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function loadRecords() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved.filter(r => r && typeof r.name === "string" && r.date && r.status) : [];
    } catch (error) {
      return [];
    }
  }
  function saveRecords() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
      return true;
    } catch (error) {
      showToast("No se pudieron guardar los datos. Revisa el almacenamiento del navegador.");
      return false;
    }
  }
  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, char => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    })[char]);
  }
  function readableDate(value) {
    if (!value) return "—";
    const parts = value.split("-").map(Number);
    if (parts.length !== 3 || parts.some(Number.isNaN)) return value;
    return new Date(parts[0], parts[1] - 1, parts[2]).toLocaleDateString("es-CO", {day:"2-digit", month:"short", year:"numeric"});
  }
  function initials(name) {
    return name.trim().split(/\s+/).slice(0, 2).map(word => word[0] || "").join("").toUpperCase();
  }
  function personCell(name) {
    return `<div class="person-cell"><span class="avatar">${escapeHtml(initials(name))}</span><span>${escapeHtml(name)}</span></div>`;
  }
  function statusBadge(status) {
    const present = status === "Presente";
    return `<span class="status ${present ? "present" : "absent"}">${present ? "Presente" : "Ausente"}</span>`;
  }
  function sortNewest(list) {
    return [...list].sort((a, b) => b.createdAt - a.createdAt);
  }
  function renderDashboard() {
    const today = localDateString();
    const todayRecords = records.filter(record => record.date === today);
    $("#stat-total").textContent = todayRecords.length;
    $("#stat-present").textContent = todayRecords.filter(r => r.status === "Presente").length;
    $("#stat-absent").textContent = todayRecords.filter(r => r.status === "Ausente").length;
    const recent = sortNewest(records).slice(0, 5);
    $("#recent-body").innerHTML = recent.map(r => `<tr><td>${personCell(r.name)}</td><td>${readableDate(r.date)}</td><td>${statusBadge(r.status)}</td></tr>`).join("");
    $("#recent-empty").hidden = recent.length > 0;
    $("#recent-body").parentElement.parentElement.style.display = recent.length ? "" : "none";
  }
  function renderAttendance() {
    const query = $("#search-input").value.trim().toLocaleLowerCase("es");
    const filtered = sortNewest(records).filter(r => r.name.toLocaleLowerCase("es").includes(query));
    $("#attendance-body").innerHTML = filtered.map(r => `<tr><td>${personCell(r.name)}</td><td>${readableDate(r.date)}</td><td>${statusBadge(r.status)}</td><td><button class="delete-btn" data-delete="${escapeHtml(r.id)}" aria-label="Eliminar registro de ${escapeHtml(r.name)}">Eliminar</button></td></tr>`).join("");
    $("#list-empty").hidden = filtered.length > 0;
    $("#attendance-body").parentElement.parentElement.style.display = filtered.length ? "" : "none";
  }
  function renderAll() {
    renderDashboard();
    renderAttendance();
  }
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 3000);
  }
  function showView(view) {
    const dashboard = view === "dashboard";
    $("#dashboard-view").classList.toggle("hidden", !dashboard);
    $("#attendance-view").classList.toggle("hidden", dashboard);
    $("#page-title").textContent = dashboard ? "Resumen" : "Asistencia";
    document.querySelectorAll(".nav-item").forEach(btn => btn.classList.toggle("active", btn.dataset.view === view));
    if (!dashboard) renderAttendance();
    window.scrollTo({top: 0, behavior: "smooth"});
  }
  function clearForm() {
    form.reset();
    dateInput.value = localDateString();
    nameError.textContent = "";
    nameInput.classList.remove("invalid");
    formMessage.textContent = "";
    nameInput.focus();
  }

  $("#today-label").textContent = new Date().toLocaleDateString("es-CO", {weekday:"short", day:"numeric", month:"short", year:"numeric"});
  dateInput.value = localDateString();
  document.querySelectorAll(".nav-item").forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));
  $("#go-register").addEventListener("click", () => showView("attendance"));
  $("#empty-register").addEventListener("click", () => showView("attendance"));
  $("#see-all").addEventListener("click", () => showView("attendance"));
  $("#clear-form").addEventListener("click", clearForm);
  $("#search-input").addEventListener("input", renderAttendance);
  nameInput.addEventListener("input", () => {
    if (nameInput.value.trim()) {
      nameError.textContent = "";
      nameInput.classList.remove("invalid");
    }
  });

  form.addEventListener("submit", event => {
    event.preventDefault();
    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const date = dateInput.value;
    const status = statusInput.value;
    if (!name) {
      nameError.textContent = "Escribe el nombre para poder guardar el registro.";
      nameInput.classList.add("invalid");
      nameInput.focus();
      formMessage.textContent = "";
      return;
    }
    if (!date) {
      formMessage.style.color = "var(--red)";
      formMessage.textContent = "Selecciona una fecha antes de guardar.";
      dateInput.focus();
      return;
    }
    if (name.length < 2) {
      nameError.textContent = "El nombre debe tener al menos 2 caracteres.";
      nameInput.classList.add("invalid");
      nameInput.focus();
      return;
    }
    const record = {id: (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`, name, date, status, createdAt: Date.now()};
    records.push(record);
    if (!saveRecords()) {
      records = records.filter(r => r.id !== record.id);
      return;
    }
    nameError.textContent = "";
    nameInput.classList.remove("invalid");
    formMessage.style.color = "var(--green)";
    formMessage.textContent = `Registro guardado correctamente para ${name}.`;
    showToast("✓ Asistencia guardada correctamente");
    renderAll();
    nameInput.value = "";
    nameInput.focus();
  });

  $("#attendance-body").addEventListener("click", event => {
    const button = event.target.closest("[data-delete]");
    if (!button) return;
    const record = records.find(r => r.id === button.dataset.delete);
    if (!record) return;
    if (!window.confirm(`¿Deseas eliminar el registro de ${record.name}?`)) return;
    const previous = records;
    records = records.filter(r => r.id !== record.id);
    if (!saveRecords()) {
      records = previous;
      return;
    }
    renderAll();
    showToast("Registro eliminado.");
  });

  renderAll();
})();
