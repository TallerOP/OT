
const BASE_URL = "https://script.google.com/macros/s/AKfycbz8LTXfv_Zc0fluOR6ntqwQWSkDCEkm4yasthm4L9kNOwsVfd1sNz2je37SMWun7ldY/exec";

let EMISOR = "";

// =========================
// LOGIN
// =========================
function login() {

  fetch(`${BASE_URL}?action=login&user=${user.value}&pass=${pass.value}`)
    .then(r => r.json())
    .then(res => {

      if (!res.ok) {
        alert("Login incorrecto");
        return;
      }

      EMISOR = res.emisor;

      document.getElementById("loginBox").style.display = "none";
      document.getElementById("app").style.display = "block";

      loadLists();
      loadAvisos();

    })
    .catch(err => {
      console.error(err);
      alert("Error de conexión");
    });

}

// =========================
// LISTAS DROPDOWN
// =========================
function loadLists() {

  fetch(`${BASE_URL}?action=listas`)
    .then(r => r.json())
    .then(data => {

      fill("maq", data.maquinas);
      fill("proy", data.proyectos);
      fill("tipo", data.averias);

    });

}

function fill(id, arr) {

  const sel = document.getElementById(id);
  sel.innerHTML = "";

  arr.forEach(x => {
    let opt = document.createElement("option");
    opt.text = x;
    opt.value = x;
    sel.add(opt);
  });

}

// =========================
// CREAR AVISO
// =========================
function crearAviso() {

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "aviso",
      id: "AV-" + Date.now(),
      usuario: EMISOR,
      maquina: maq.value,
      proyecto: proy.value,
      tipo: tipo.value,
      descripcion: desc.value
    })
  })
  .then(r => r.json())
  .then(res => {

    if (!res.ok) {
      alert("Error creando aviso");
      return;
    }

    alert("Aviso creado correctamente");

    desc.value = "";

    loadAvisos();

  })
  .catch(err => {
    console.error(err);
    alert("Error de red");
  });

}

// =========================
// LISTAR AVISOS
// =========================
function loadAvisos() {

  fetch(`${BASE_URL}?action=avisos`)
    .then(r => r.json())
    .then(data => {

      const div = document.getElementById("avisos");
      div.innerHTML = "";

      data.forEach(a => {

        div.innerHTML += `
          <div style="border:1px solid #ccc; padding:8px; margin:5px;">
            <b>${a.maquina}</b><br>
            ${a.descripcion}<br>

            <button onclick="crearOT(${a.row})">
              Generar OT
            </button>
          </div>
        `;

      });

    });

}

// =========================
// CONVERTIR OT
// =========================
function crearOT(row) {

  fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify({
      type: "ot",
      row: row,
      emisor: EMISOR
    })
  })
  .then(r => r.json())
  .then(res => {

    if (!res.ok) {
      alert("Error creando OT");
      return;
    }

    alert("OT creada: " + res.ot);

    loadAvisos();

  });

}