const RedSlider = document.getElementById("RedSlider");
const GreenSlider = document.getElementById("GreenSlider");
const BlueSlider = document.getElementById("BlueSlider");
const SliderDiv = document.getElementById("SlidersDiv");
const ValueRGB = document.getElementById("ColorValueRGB");
const ColorPreview = document.getElementById("colorPreview");
const ModeToggle = document.getElementById("modeToggle");
const CopyButton = document.getElementById("CopyButton");

let HexMode = localStorage.getItem("HexMode") === "true";
ModeToggle.checked = HexMode;

let copyTimeout = null;

// Restore saved RGB values
["Red", "Green", "Blue"].forEach(color => {
  const savedValue = localStorage.getItem(`${color}Value`);
  if (savedValue !== null) {
    document.getElementById(`${color}Slider`).value = Number(savedValue);
  }
});

updateUI();

function updateUI() {
  const r = Number(RedSlider.value);
  const g = Number(GreenSlider.value);
  const b = Number(BlueSlider.value);
  const rgbString = `rgb(${r}, ${g}, ${b})`;

  ColorPreview.style.backgroundColor = rgbString;
  ValueRGB.textContent = HexMode ? RGBToHEX(r, g, b) : rgbString;

  RedSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`);
  GreenSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`);
  BlueSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`);
}

function RGBToHEX(r, g, b) {
  const toHex = n => Number(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Event delegation for sliders and toggle
let rafPending = false;

SliderDiv.addEventListener("input", (event) => {
  const target = event.target;

  if (target === ModeToggle) {
    HexMode = ModeToggle.checked;
    localStorage.setItem("HexMode", HexMode.toString());
  }

  if (!rafPending) {
    rafPending = true;
    requestAnimationFrame(() => {
      updateUI();
      rafPending = false;
    });
  }
});

// Save to localStorage when sliders are released
SliderDiv.addEventListener("change", (event) => {
  const target = event.target;
  if (target.type === "range") {
    const id = target.id; // e.g., "RedSlider"
    const color = id.replace("Slider", "Value"); // → "RedValue"
    localStorage.setItem(color, target.value);
  }
});

// Slider grab effect
SliderDiv.addEventListener("mousedown", () => {
  ["RedSlider", "GreenSlider", "BlueSlider"].forEach(id => {
    document.getElementById(id).style.setProperty("--cursor-state", "grabbing");
  });
});

SliderDiv.addEventListener("mouseup", () => {
  ["RedSlider", "GreenSlider", "BlueSlider"].forEach(id => {
    document.getElementById(id).style.setProperty("--cursor-state", "grab");
  });
});

// Copy to clipboard button
CopyButton.addEventListener("click", () => {
  if (copyTimeout) return;

  navigator.clipboard.writeText(ValueRGB.textContent).then(() => {
    CopyButton.textContent = "Copied!";
    copyTimeout = setTimeout(() => {
      CopyButton.textContent = "Copy";
      copyTimeout = null;
    }, 1000);
  }).catch(() => {
    CopyButton.textContent = "Failed :(";
  });
});
