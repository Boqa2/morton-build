const city = document.querySelector(".xs");
const km = document.querySelector(".xl");
const state = document.querySelectorAll(".state");
const adres_line = document.querySelector(".m");
const zip = document.querySelector(".zip");
const search = document.querySelector("#searchInput");

let map;
let placemark;
let locations = [];

// Загружаем данные из Google Sheets
async function loadGoogleSheet() {
  const sheetUrl =
    "https://docs.google.com/spreadsheets/d/1fvefUw8hHH0r1VR2puCmqHygW9pL91L3/gviz/tq?tqx=out:json";

  try {
    const response = await fetch(sheetUrl);
    const text = await response.text();
    const jsonText = text.match(/\{.*\}/s);
    if (!jsonText) throw new Error("Ошибка парсинга JSON!");

    const json = JSON.parse(jsonText[0]);
    const headers = json.table.cols
      .map((col) => col.label)
      .filter((col) => col !== "");

    const rows = json.table.rows
      .map((row) => row.c.map((cell) => (cell ? cell.v : "")))
      .filter((row) => row[0] !== "");

    locations = rows.map((row) => ({
      zip: row[3], // ZIP-код
      city: row[1], // Город
      state: row[2], // Штат
      address: row[1], // Адрес
      region: row[4],
      distance: row[6], // Расстояние
    }));

    console.log("Данные загружены:", locations);
    return rows;
  } catch (error) {
    console.error("Ошибка загрузки данных:", error);
  }
}
async function initMap() {
  await ymaps3;

  const { YMap, YMapDefaultSchemeLayer } = ymaps3;

  const map = new YMap(document.getElementById("app"), {
    location: {
      center: [37.588144, 55.733842],
      zoom: 10,
    },
  });

  map.addChild(new YMapDefaultSchemeLayer());
}

initMap();

// Функция поиска по ZIP-коду
function searchByZip(zipCode) {
  const result = locations.find((loc) => loc.zip === zipCode);

  if (!result) {
    city.textContent = result.city;
    adres_line.textContent = result.address;
    zip.textContent = result.zip;
    km.textContent = result.distance;

    state.forEach((el) => (el.textContent = result.state));

    updateMapMarker(result.latitude, result.longitude);
  } else {
    alert("Местоположение не найдено!");
  }
}

// Обновление маркера на карте
function updateMapMarker(lat, lon) {
  if (!map) return;

  if (placemark) {
    placemark.remove();
  }

  ymaps3.import("@yandex/ymaps3").then(({ YMapMarker }) => {
    placemark = new YMapMarker({ coordinates: [lon, lat] });
    map.addChild(placemark);
    map.update({ location: { center: [lon, lat], zoom: 12 } });
  });
}

// Обработчик поиска
search.addEventListener("change", () => {
  const zipCode = search.value.trim();
  if (zipCode) {
    searchByZip(zipCode);
  }
});

// Загружаем данные и инициализируем карту
loadGoogleSheet().then(initMap());
