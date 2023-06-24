const canvas = document.getElementById("mapa");
const ctx = canvas.getContext("2d");

const extremos = pegarExtremos(municipios);

const alturaMapa = extremos.latitude.max - extremos.latitude.min;
const larguraMapa = extremos.longitude.max - extremos.longitude.min;

function criarMapa() {
  ctx.fillStyle = "lightblue";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function pegarExtremos(municipios) {
  let extremos = {
    latitude: { min: Infinity, max: -Infinity },
    longitude: { min: Infinity, max: -Infinity },
  };
  for (const municipio of municipios) {
    if (municipio.latitude < extremos.latitude.min) {
      extremos.latitude.min = municipio.latitude;
    }
    if (municipio.latitude > extremos.latitude.max) {
      extremos.latitude.max = municipio.latitude;
    }
    if (municipio.longitude < extremos.longitude.min) {
      extremos.longitude.min = municipio.longitude;
    }
    if (municipio.longitude > extremos.longitude.max) {
      extremos.longitude.max = municipio.longitude;
    }
  }
  return extremos;
}

function converterCoordenadas(latitude, longitude) {
  const padding = 10;
  const x =
    padding +
    (longitude - extremos.longitude.min) *
      ((canvas.width - 2 * padding) / larguraMapa);
  const y =
    canvas.height -
    (padding +
      (latitude - extremos.latitude.min) *
        ((canvas.height - 2 * padding) / alturaMapa));
  return { x, y };
}

function pegarCor() {
  const possibilidades = [
    'rgb(0, 85, 164)',
    'rgb(0, 155, 58)',
    'rgb(255, 204, 0)',
    'rgb(0, 120, 215)',
    'rgb(46, 204, 64)',
    'rgb(255, 230, 0)',
    'rgb(0, 46, 88)',
    'rgb(0, 83, 30)',
    'rgb(186, 161, 0)',
    'rgb(0, 38, 71)',
    'rgb(0, 134, 46)',
    'rgb(255, 179, 0)'
  ];
  return possibilidades[Math.floor(Math.random() * possibilidades.length)];
}

function criarPonto(municipio) {
  const { x, y } = converterCoordenadas(
    municipio.latitude,
    municipio.longitude
  );
  ctx.fillStyle = pegarCor();
  ctx.beginPath();
  ctx.arc(x, y, 4, 0, 2 * Math.PI);
  ctx.fill();
}

function ordenarMunicipiosPorCoordenadas(municipios, ordem) {
  return municipios.sort((a, b) => {
    const condicao1 =
      ordem === "asc" ? a.latitude < b.latitude : a.latitude > b.latitude;
    const condicao2 =
      ordem === "asc" ? a.longitude < b.longitude : a.longitude > b.longitude;
    if (condicao1) {
      return -1;
    }
    if (condicao2) {
      return 1;
    }
    return 0;
  });
}

function ordenarMunicipiosAleatoriamente(municipios) {
  return municipios.sort(() => Math.random() - 0.5);
}

async function carregarPontos() {
  const opcao = document.getElementById("opcao").value;
  let municipios_;
  if (opcao === "aleatorio") {
    municipios_ = ordenarMunicipiosAleatoriamente(municipios);
  } else if (opcao === "asc" || opcao === "desc") {
    municipios_ = ordenarMunicipiosPorCoordenadas(municipios, opcao);
  }
  await renderizarPontos(municipios_);
}

async function renderizarPontos(municipios) {
  criarMapa();
  for (const municipio of municipios) {
    setTimeout(() => {
      criarPonto(municipio);
    }, 100);
  }
}

criarMapa();
