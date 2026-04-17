const API_KEY = "36d388bdc814eebbb8a829ab";

const container = document.getElementById("cardsContainer");
const input = document.getElementById("amount");

const monedas = [
  "USD","EUR","GBP","JPY","CNY","AUD",
  "CAD","CHF","MXN","BRL","INR","KRW"
];

let rates = {};

async function cargarDatos() {
  const res = await fetch(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/DOP`);
  const data = await res.json();

  rates = data.conversion_rates;

  renderCards();
}

function renderCards() {
  container.innerHTML = "";

  monedas.forEach(moneda => {
    const tasa = rates[moneda];

    const col = document.createElement("div");
    col.className = "col-md-4";

    col.innerHTML = `
      <div class="card-cyber">
        <h5>${moneda}</h5>
        <p>Tasa: ${tasa}</p>
        <p class="result">0</p>
        <div id="chart-${moneda}"></div>
      </div>
    `;

    container.appendChild(col);

    crearGrafico(moneda);
  });
}

function crearGrafico(moneda) {
  const opciones = {
    chart: { type: 'line', height: 150 },
    series: [{
      name: moneda,
      data: generarFakeData()
    }],
    xaxis: {
      categories: ["Ene","Feb","Mar","Abr","May","Jun"]
    }
  };

  new ApexCharts(
    document.querySelector(`#chart-${moneda}`),
    opciones
  ).render();
}

// Simulación de tendencia (porque la API gratis no da histórico)
function generarFakeData() {
  return Array.from({length: 6}, () =>
    Math.floor(Math.random() * 100)
  );
}

// Calculadora
input.addEventListener("input", () => {
  const valor = input.value;

  document.querySelectorAll(".card-cyber").forEach((card, i) => {
    const moneda = monedas[i];
    const resultado = valor * rates[moneda];

    card.querySelector(".result").innerText =
      resultado.toFixed(2);
  });
});

cargarDatos();