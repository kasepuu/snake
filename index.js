import { drawMenu } from "./src/menu.js"

const backbutton = document.getElementById("backbtn");
backbutton.onclick = () => exit();

const init = () => {
    drawMenu()
    console.log("Initialized")
}

const exit = () => {
    console.log("Exiting...")
    window.location.href = "https://kasepuu.github.io";
}

init()