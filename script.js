const RedSlider = document.getElementById("RedSlider")
const GreenSlider = document.getElementById("GreenSlider")
const BlueSlider = document.getElementById("BlueSlider")
const SliderDiv = document.getElementById("SlidersDiv")
const ValueRGB = document.getElementById("ColorValueRGB")
const ColorPreview = document.getElementById("colorPreview")
const Title = document.getElementById("EpicTitle")
const ModeToggle = document.getElementById("modeToggle")
const CopyButton = document.getElementById("CopyButton")

const RedValue = localStorage.getItem("RedValue")
if (RedValue) {
  RedSlider.value = Number(RedValue)
}

const GreenValue = localStorage.getItem("GreenValue")
if (GreenValue) {
  GreenSlider.value = Number(GreenValue)
}

const BlueValue = localStorage.getItem("BlueValue")
if (BlueValue) {
  BlueSlider.value = Number(BlueValue)
}

let HexMode = false

const SavedHexMode = localStorage.getItem("HexMode")
if (SavedHexMode !== null) {
  const ToBool = SavedHexMode === "true"
  HexMode = ToBool
  ModeToggle.checked = ToBool
}

// Update the value display once at the end using actual HexMode state
const CurrentColor = `rgb(${RedSlider.value}, ${GreenSlider.value}, ${BlueSlider.value})`
if (HexMode) {
  ValueRGB.textContent = RGBToHEX(RedSlider.value, GreenSlider.value, BlueSlider.value)
} else {
  ValueRGB.textContent = CurrentColor
}

ColorPreview.style.backgroundColor = CurrentColor

const r = RedSlider.value
const g = GreenSlider.value
const b = BlueSlider.value

let copyTimeout = null;

RedSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`)
GreenSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`)
BlueSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`)

RedSlider.style.setProperty("--cursor-state", "grab")
GreenSlider.style.setProperty("--cursor-state", "grab")
BlueSlider.style.setProperty("--cursor-state", "grab")

SliderDiv.addEventListener('input', function(event) {
    if (event.target.type === "checkbox") {
      if (ModeToggle.checked) {
        HexMode = true

      } else {
        HexMode = false
      }
      localStorage.setItem("HexMode", HexMode.toString())
    }
    const CurrentColor = `rgb(${RedSlider.value}, ${GreenSlider.value}, ${BlueSlider.value})`
    if (HexMode == true) {
      ValueRGB.textContent = RGBToHEX(RedSlider.value, GreenSlider.value, BlueSlider.value)
    } else {
      ValueRGB.textContent = CurrentColor
    }
    ColorPreview.style.backgroundColor = CurrentColor
    

    UpdateSliderGradients()
})

SliderDiv.addEventListener('change', (event) => {
  if (event.target.type === "range") {
    const id = event.target.id
    const clr = id.replace("Slider", "Value")
    console.log(clr)
    const element = window[id]
    console.log(element)
    localStorage.setItem(clr.toString(), element.value.toString())
  }
})

SliderDiv.addEventListener('mousedown', () => {
  RedSlider.style.setProperty("--cursor-state", "grabbing")
  GreenSlider.style.setProperty("--cursor-state", "grabbing")
  BlueSlider.style.setProperty("--cursor-state", "grabbing")
})

SliderDiv.addEventListener('mouseup', () => {
  RedSlider.style.setProperty("--cursor-state", "grab")
  GreenSlider.style.setProperty("--cursor-state", "grab")
  BlueSlider.style.setProperty("--cursor-state", "grab")
})

function UpdateSliderGradients() {
  const r = RedSlider.value
  const g = GreenSlider.value
  const b = BlueSlider.value

  RedSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(0, ${g}, ${b}), rgb(255, ${g}, ${b}))`)
  GreenSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, 0, ${b}), rgb(${r}, 255, ${b}))`)
  BlueSlider.style.setProperty("--track-color", `linear-gradient(to right, rgb(${r}, ${g}, 0), rgb(${r}, ${g}, 255))`)
}

function RGBToHEX(r, g, b) {
  const GetHex = n => Number(n).toString(16).padStart(2, '0')
  return `#${GetHex(r)}${GetHex(g)}${GetHex(b)}`
}

CopyButton.addEventListener("click", () => {
  // Don't do anything if the timeout is already active
  if (copyTimeout !== null) return;

  navigator.clipboard.writeText(ValueRGB.textContent)
    .then(() => {
      CopyButton.textContent = "Copied!";

      copyTimeout = setTimeout(() => {
        CopyButton.textContent = "Copy";
        copyTimeout = null; // Reset after it's done
      }, 1000);
    })
    .catch(() => {
      CopyButton.textContent = "Failed :(";
    });
});