

AOS.init();

const horarios = ["10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00"];
const reservas = JSON.parse(localStorage.getItem("reservas")) || {};
const horarioSelect = document.getElementById("horario");
const listaHorarios = document.getElementById("listaHorarios");

// Modales
const modal = document.getElementById("modalReserva");
const modalHora = document.getElementById("modalHora");
const modalNombre = document.getElementById("modalNombre");
const modalTelefono = document.getElementById("modalTelefono");
const modalBtn = document.getElementById("modalReservarBtn");
const modalClose = document.querySelector("#modalReserva .close");
let horaSeleccionada = "";

const modalConfirm = document.getElementById("modalConfirm");
const confirmText = document.getElementById("confirmText");
const confirmYes = document.getElementById("confirmYes");
const confirmNo = document.getElementById("confirmNo");
let accionConfirm = null;

// Admin modal
const modalAdmin = document.getElementById("modalAdmin");
const adminBtn = document.getElementById("adminBtn");
let modoAdmin = false;

function mostrarToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.className = "toast show";
  setTimeout(() => toast.className = "toast", 3000);
}

function cargarSelect() {
  horarioSelect.innerHTML = '<option value="">Selecciona un horario</option>';
  horarios.forEach(hora => {
    const option = document.createElement("option");
    option.value = hora;
    if (reservas[hora]) {
      option.textContent = `${hora} - Ocupado (${reservas[hora].nombre})`;
      option.disabled = true;
    } else {
      option.textContent = `${hora} - Disponible`;
    }
    horarioSelect.appendChild(option);
  });
}

function renderHorarios() {
  listaHorarios.innerHTML = "";
  horarios.forEach(hora => {
    const div = document.createElement("div");
    div.classList.add("slot");

    if (reservas[hora]) {
      div.classList.add("ocupado");
      div.innerHTML = `<div>${hora} - ${reservas[hora].nombre} <span class="admin-hidden">(${reservas[hora].telefono})</span></div>
                       <button class="admin-hidden" onclick="abrirConfirmEliminar('${hora}')">Cancelar turno</button>`;
    } else {
      div.classList.add("disponible");
      div.textContent = `${hora} - Disponible`;
      div.addEventListener("click", () => abrirModal(hora));
    }
    listaHorarios.appendChild(div);
  });
}

function abrirModal(hora) {
  horaSeleccionada = hora;
  modalHora.textContent = `Reserva para las ${hora}`;
  modalNombre.value = "";
  modalTelefono.value = "";
  modal.style.display = "block";
}

modalClose.onclick = () => modal.style.display = "none";
window.onclick = (e) => { 
  if (e.target == modal) modal.style.display = "none"; 
  if (e.target == modalAdmin) cerrarModalAdmin();
  if (e.target == modalConfirm) modalConfirm.style.display = "none";
};

modalBtn.onclick = () => {
  const nombre = modalNombre.value.trim();
  const telefono = modalTelefono.value.trim();
  if (!nombre || !telefono) { mostrarToast("⚠️ Completa todos los campos"); return; }
  reservas[horaSeleccionada] = { nombre, telefono };
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarToast(`✅ Turno reservado a las ${horaSeleccionada} para ${nombre}`);
  modal.style.display = "none";
  renderHorarios();
  cargarSelect();
};

function reservarFormulario() {
  const nombre = document.getElementById("nombreForm").value.trim();
  const telefono = document.getElementById("telefonoForm").value.trim();
  const hora = horarioSelect.value;
  if (!nombre || !telefono || !hora) { mostrarToast("⚠️ Completa todos los campos"); return; }
  if (reservas[hora]) { mostrarToast(`❌ Ese horario ya está ocupado por ${reservas[hora].nombre}`); return; }
  reservas[hora] = { nombre, telefono };
  localStorage.setItem("reservas", JSON.stringify(reservas));
  mostrarToast(`✅ Turno reservado a las ${hora} para ${nombre}`);
  document.getElementById("nombreForm").value = "";
  document.getElementById("telefonoForm").value = "";
  horarioSelect.value = "";
  renderHorarios();
  cargarSelect();
}

function abrirConfirmEliminar(hora) {
  confirmText.textContent = `¿Eliminar el turno de ${hora}?`;
  modalConfirm.style.display = "block";
  accionConfirm = () => {
    delete reservas[hora];
    localStorage.setItem("reservas", JSON.stringify(reservas));
    mostrarToast(`🗑️ Turno de ${hora} eliminado`);
    renderHorarios();
    cargarSelect();
    modalConfirm.style.display = "none";
  };
}

function abrirConfirmReset() {
  confirmText.textContent = `¿Eliminar todos los turnos?`;
  modalConfirm.style.display = "block";
  accionConfirm = () => {
    for (let h in reservas) delete reservas[h];
    localStorage.removeItem("reservas");
    mostrarToast(`🗑️ Todos los turnos han sido eliminados`);
    renderHorarios();
    cargarSelect();
    modalConfirm.style.display = "none";
  };
}

confirmYes.onclick = () => { if (accionConfirm) accionConfirm(); };
confirmNo.onclick = () => { modalConfirm.style.display = "none"; };

// ==========================
// ADMIN
// ==========================
function abrirModalAdmin() { modalAdmin.style.display = "block"; }
function cerrarModalAdmin() {
  modalAdmin.style.display = "none";
  document.getElementById("codigoAdmin").value = "";
}

function verificarCodigo() {
  const codigo = document.getElementById("codigoAdmin").value;
  if(codigo === "1234") {
    modoAdmin = true;
    document.querySelectorAll(".admin-hidden").forEach(el => el.style.display = "inline-block");
    adminBtn.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i>';
    mostrarToast("🔑 Acceso concedido");
    cerrarModalAdmin();
  } else {
    mostrarToast("❌ Código incorrecto");
  }
}

adminBtn.addEventListener("click", () => {
  if(modoAdmin) {
    modoAdmin = false;
    document.querySelectorAll(".admin-hidden").forEach(el => el.style.display = "none");
    adminBtn.innerHTML = '<i class="fa-solid fa-user"></i>';
    mostrarToast("🔒 Sesión de admin cerrada");
  }
});

cargarSelect();
renderHorarios();
