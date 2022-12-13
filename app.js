const columns = document.querySelectorAll(".column");


document.addEventListener("keydown", (event) => {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    setRandomPalette();
  }
});



function generateRandomColor() {
  // RGB
  // #FF0000
  // #00FF00
  // #0000FF

  const hexCodes = "0123456789ABCDEF";
  let color = "";

  for (let i = 0; i < 6; i++) {
    color += hexCodes[Math.floor(Math.random() * hexCodes.length)];
  }
  return "#" + color;
}

function copyToClipBoard(text) {
  return navigator.clipboard.writeText(text);
}

document.addEventListener("click", (event) => {
  const type = event.target.dataset.type;

  if (type === "lock") {
    const node =
      event.target.tagName.toLowerCase() === "i"
        ? event.target
        : event.target.children[0];
    node.classList.toggle("fa-lock-open");
    node.classList.toggle("fa-lock");
  } else if (type === "copy") {
    copyToClipBoard(event.target.textContent);
  } else if (type === "copy-pallete") {
    copyToClipBoard(event.target.colors);
  }
});

function setRandomPalette(isInitial) {
  const colors = isInitial ? getPaletteFromHash() : [];

  columns.forEach((column, index) => {
    const isLocked = column.querySelector("i").classList.contains("fa-lock");
    const text = column.querySelector("h2");
    const button = column.querySelector("button");

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }

    const color = isInitial
      ? colors[index]
        ? colors[index]
        : chroma.random()
      : chroma.random();

    if (!isInitial) {
      colors.push(color);
      
    }

    text.textContent = color;

    column.style.background = color;

    setTextColor(text, color);
    setTextColor(button, color);
  });
  updatePaletteHash(colors);
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function updatePaletteHash(colors = []) {
  document.location.hash = colors
    .map((col) => {
      return col.toString().substring(1);
    })
    .join("-");
}

function getPaletteFromHash() {
  if (document.location.hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}

setRandomPalette(true);
