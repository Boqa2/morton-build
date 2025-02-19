let locations = [];
let isDragging = false;
let startX,
  startY,
  mapX = 0,
  mapY = 0;
const sheetId = "1fvefUw8hHH0r1VR2puCmqHygW9pL91L3";
const sheetName = "ADDRESS_LINE_1";
const apiUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&tq=&sheet=${sheetName}`;

async function loadData() {
  const response = await fetch(apiUrl);
  const text = await response.text();
  const json = JSON.parse(text.substring(47, text.length - 2));

  locations = json.table.rows.map((row) => {
    return {
      name: row.c[0]?.v || "",
      lat: parseFloat(row.c[1]?.v) || 0,
      lon: parseFloat(row.c[2]?.v) || 0,
      address: row.c[3]?.v || "",
    };
  });

  renderMap(locations);
}

console.log(locations);

function renderMap(data) {
  const map = document.getElementById("map");
  const info = document.getElementById("info");
  const mapWidth = map.clientWidth;
  const mapHeight = map.clientHeight;
  map.innerHTML = "";

  data.forEach(({ name, lat, lon, address }) => {
    const x = (lon + 180) * (mapWidth / 360);
    const y = (90 - lat) * (mapHeight / 180);

    const point = document.createElement("div");
    point.className = "point";
    point.style.left = `${x}px`;
    point.style.top = `${y}px`;
    point.onclick = () => {
      info.innerHTML = `<h3>${name}</h3><p>${address}</p>`;
    };

    map.appendChild(point);
  });
}

document.getElementById("searchInput").addEventListener("input", function () {
  const query = this.value.toLowerCase();
  const filtered = locations.filter(
    (loc) =>
      loc.name.toLowerCase().includes(query) ||
      loc.address.toLowerCase().includes(query)
  );
  renderMap(filtered);
});

const map = document.getElementById("map");
map.addEventListener("mousedown", (e) => {
  isDragging = true;
  startX = e.clientX - mapX;
  startY = e.clientY - mapY;
  map.style.cursor = "grabbing";
});

document.addEventListener("mousemove", (e) => {
  if (!isDragging) return;
  mapX = e.clientX - startX;
  mapY = e.clientY - startY;
  map.style.transform = `translate(${mapX}px, ${mapY}px)`;
});

document.addEventListener("mouseup", () => {
  isDragging = false;
  map.style.cursor = "grab";
});

loadData();
