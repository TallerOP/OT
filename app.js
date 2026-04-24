const API_URL = "https://script.google.com/macros/s/AKfycbysMXoxitxDHVGDXUZeFgejxfsVQo0-7iLBipX32VTPA6y229RbryRExdsyyVgYShIb/exec";

// ================= LOGIN =================
async function login() {

  let user = document.getElementById("user").value.trim();
  let pass = document.getElementById("pass").value.trim();

  try {

    let res = await fetch(API_URL);
    let users = await res.json();

    let found = users.find(u =>
      u.usuario === user &&
      u.password === pass
    );

    if (!found) {
      document.getElementById("msg").innerText = "Usuario o contraseña incorrectos";
      return;
    }

    if (found.activo !== "SI") {
      document.getElementById("msg").innerText = "Usuario desactivado";
      return;
    }

    localStorage.setItem("user", user);

    window.location.href = "app.html";

  } catch (err) {
    console.error(err);
    document.getElementById("msg").innerText = "Error conexión API";
  }
}

// ================= INIT =================
window.onload = function () {

  if (window.location.pathname.includes("app.html")) {
    initApp();
  }
};

function initApp() {

  let user = localStorage.getItem("user");

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("welcome").innerText =
    "Usuario: " + user;

  controlarUI(user);
  cargarAvisos();
}

// ================= UI =================
function controlarUI(user) {

  document.getElementById("btnAviso").style.display = "inline";

  // Producción no puede generar OT
  if (user === "produccion") {
    document.getElementById("btnOT").style.display = "none";
  }
}

// ================= AVISO =================
async function crearAviso() {

  let user = localStorage.getItem("user");

  let data = {
    tipo: "AVISO",
    id: Date.now(),
    fecha: new Date().toISOString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    descripcion: document.getElementById("desc").value
  };

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("Aviso creado correctamente");

  } catch (err) {
    console.error(err);
    alert("Error al crear aviso");
  }
}

// ================= OT =================
async function crearOT() {

  let user = localStorage.getItem("user");

  if (user === "produccion") {
    alert("No tienes permisos para crear OT");
    return;
  }

  let data = {
    tipo: "OT",
    fecha: new Date().toISOString(),
    hora: new Date().toLocaleTimeString(),
    usuario: user,
    maquina: document.getElementById("maquina").value,
    proyecto: document.getElementById("proyecto").value,
    tipoAveria: document.getElementById("tipo").value,
    descripcion: document.getElementById("desc").value
  };

  try {

    await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(data)
    });

    alert("OT creada correctamente");

  } catch (err) {
    console.error(err);
    alert("Error al crear OT");
  }
}

// ================= AVISOS =================
async function cargarAvisos() {

  try {

    let res = await fetch(API_URL);
    let users = await res.json();

    // (esto solo es placeholder si luego separas endpoint de avisos)
    document.getElementById("lista").innerHTML =
      "Avisos cargados (pendiente endpoint específico)";

  } catch (err) {
    console.log("No se pudieron cargar avisos");
  }
}