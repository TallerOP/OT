const API_URL = "https://script.google.com/macros/s/AKfycbzXnyxpeiVWnmjgFX9d1n2pONOvv0lBziCQHsCxNJha-VEOYpx6vOrZtDHoKOP1pzTg/exec";

// ================= PROTECCIÓN =================
const user = localStorage.getItem("user");

if (!user) {
  window.location.href = "index.html";
}

// ================= INIT =================
window.onload = function () {

  document.getElementById("welcome").innerText =
    "Usuario: " + user;

  controlarPermisos();
  cargarListas();
  cargarAvisos();
};

// ================= PERMISOS =================
function controlarPermisos() {

  // Producción NO puede generar OT
  if (user.toLowerCase() === "produccion") {
    document.getElementById("btnOT").style.display = "none";
  }
}

// ================= LISTAS =================
async function cargarListas() {

  try {

    const res = await fetch(API_URL + "?tipo=listas");
    const data = await res.json();

    llenar("maquina", data.MAQUINA, "Seleccionar máquina");
    llenar("proyecto", data.PROYECTO, "Seleccionar proyecto");
    llenar("tipo", data.AVERIA, "Tipo de avería");
    llenar("hora", data.HORA, "Seleccionar hora");

  } catch (err) {
    console.error("Error listas:", err);
  }
}

function llenar(id, valores, texto) {

  const select = document.getElementById(id);

  select.innerHTML = `<option value="">${texto}</option>`;

  valores.forEach(v => {
    let opt = document.createElement("option");
    opt.value = v;
    opt.textContent = v;
    select.appendChild(opt);
  });
}

// ================= AVISOS =================
async function crearAviso() {

  const data = {
    tipo: "AVISO",
    id: Date.now(),
    fecha: new Date().toISOString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    tipoAveria: document.getElementById("tipo").value,
    hora: document.getElementById("hora").value,
    descripcion: document.getElementById("desc").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("Aviso creado");
  cargarAvisos();
}

// ================= OT =================
async function crearOT() {

  if (user.toLowerCase() === "produccion") {
    alert("No tienes permisos");
    return;
  }

  const data = {
    tipo: "OT",
    fecha: new Date().toISOString(),
    hora: document.getElementById("hora").value,
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    tipoAveria: document.getElementById("tipo").value,
    descripcion: document.getElementById("desc").value
  };

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data)
  });

  alert("OT creada");
}

// ================= LISTAR AVISOS =================
async function cargarAvisos() {

  try {

    const res = await fetch(API_URL + "?tipo=avisos");
    const avisos = await res.json();

    let html = "";

    avisos.forEach(a => {

      html += `
        <div class="card">
          <b>${a.maquina}</b> - ${a.tipoAveria}<br>
          ${a.descripcion}<br><br>
          <button onclick="convertir('${a.id}')">Convertir a OT</button>
          <button onclick="rechazar('${a.id}')">Rechazar</button>
        </div>
      `;
    });

    document.getElementById("lista").innerHTML = html;

  } catch (err) {
    console.error("Error avisos:", err);
  }
}

// ================= CONVERTIR =================
async function convertir(id) {

  if (user.toLowerCase() === "produccion") {
    alert("No tienes permisos");
    return;
  }

  // Crear OT usando formulario actual
  await crearOT();

  // Marcar aviso
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "UPDATE_AVISO",
      id: id,
      estado: "CONVERTIDO"
    })
  });

  alert("Aviso convertido en OT");
  cargarAvisos();
}

// ================= RECHAZAR =================
async function rechazar(id) {

  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      tipo: "UPDATE_AVISO",
      id: id,
      estado: "RECHAZADO"
    })
  });

  alert("Aviso rechazado");
  cargarAvisos();
}
