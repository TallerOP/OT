
const URL = "https://script.google.com/macros/s/AKfycbyfw5mqcyCBujW385mjh9kc8ciE0pKEuPcfMSINsLun0uW7fuI8QniOlIwH1-fKHDAI/exec";

function toast(msg) {
  const t = document.getElementById("toast");
  t.innerText = msg;
  t.style.display = "block";

  setTimeout(() => t.style.display = "none", 2500);
}

// =========================
// CARGAR AVISOS
// =========================
function loadAvisos() {

  fetch("?action=getAvisos")
    .then(r => r.json())
    .then(data => {

      const div = document.getElementById("avisos");
      div.innerHTML = "";

      data.forEach(a => {

        div.innerHTML += `
          <div class="card">
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
// CREAR AVISO
// =========================
function crearAviso() {

  const data = {
    type: "aviso",
    id: "AV-" + Date.now(),
    usuario: "WEB",
    maquina: maq.value,
    proyecto: proy.value,
    tipo: tipo.value,
    descripcion: desc.value
  };

  fetch("", {
    method: "POST",
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(() => {
    toast("Aviso creado");
    loadAvisos();
  });

}

// =========================
// CONVERTIR A OT
// =========================
function crearOT(row) {

  fetch("", {
    method: "POST",
    body: JSON.stringify({
      type: "convertir_ot",
      row: row
    })
  })
  .then(r => r.json())
  .then(res => {
    toast("OT creada: " + res.ot);
    loadAvisos();
  });

}

// INIT
loadAvisos();