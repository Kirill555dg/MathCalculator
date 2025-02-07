(()=>{"use strict";const display=document.querySelector("#screen"),keyboard=document.querySelector(".calculator__keyboard");let openBrackets=0;function updateDisplay(e){const t=display.textContent.slice(-1),a=display.textContent.match(/(\d+(\.\d*)?)$/)?.[0]||"";if("+-×÷^.".includes(e)&&"+-×÷^.".includes(t))return display.textContent=display.textContent.slice(0,-1)+e,void saveToLocalStorage();"0"!==a||"."===e||t.includes(".")||/\d/.test(e)&&(display.textContent=display.textContent.slice(0,-1)),"."===e&&a.includes(".")||("0"!==display.textContent||!/\d/.test(e)&&"("!==e?display.textContent+=e:display.textContent=e,saveToLocalStorage())}function insertPower(e){const t=display.textContent.slice(-1);(/\d$/.test(t)||")"===t)&&(display.textContent+="^"+e,saveToLocalStorage())}function insertBracket(e){const t=display.textContent.slice(-1);if("("===e)("0"===display.textContent||"+-×÷^(".includes(t))&&(display.textContent="0"===display.textContent?"(":display.textContent+"(",openBrackets++);else if(")"===e){if(0===openBrackets||"+-×÷^(".includes(t))return;display.textContent+=")",openBrackets--}saveToLocalStorage()}function calculate(){let expression=display.textContent.replace(/×/g,"*").replace(/÷/g,"/").replace(/\^/g,"**");if(expression=expression.replace(/[\+\-\*\/\^\.]+$/,""),expression){try{let result=eval(expression);display.textContent=Number.isFinite(result)?result:"Infinity",openBrackets=0}catch{display.textContent="Ошибка"}saveToLocalStorage()}else display.textContent="0"}function clearDisplay(){display.textContent="0",openBrackets=0,saveToLocalStorage()}function deleteLastChar(){const e=display.textContent.slice(-1);"("===e?openBrackets--:")"===e&&openBrackets++,display.textContent=display.textContent.slice(0,-1)||"0",saveToLocalStorage()}function saveToLocalStorage(){localStorage.setItem("calculatorDisplay",display.textContent),localStorage.setItem("openBrackets",openBrackets)}function loadFromLocalStorage(){const e=localStorage.getItem("calculatorDisplay"),t=localStorage.getItem("openBrackets");null!==e&&(display.textContent=e),null!==t&&(openBrackets=parseInt(t))}loadFromLocalStorage(),keyboard.addEventListener("click",(e=>{const t=e.target;if(!t.classList.contains("calculator__button"))return;const a=t.dataset.action,n=t.textContent;"number"===a||["add","subtract","multiply","divide"].includes(a)?updateDisplay(n):"power"===a?insertPower(""):"square"===a?insertPower("2"):"sqrt"===a?insertPower("0.5"):"clear"===a?clearDisplay():"delete"===a?deleteLastChar():"bracket"===a?insertBracket(n):"calculate"===a&&calculate()})),document.addEventListener("keydown",(e=>{const t=e.key;"Ошибка"===display.textContent&&clearDisplay(),!isNaN(t)||"+-*/.".includes(t)?updateDisplay(t.replace("*","×").replace("/","÷")):"^"===t?insertPower(""):"("===t||")"===t?insertBracket(t):"Enter"===t?(e.preventDefault(),calculate()):"Backspace"===t?deleteLastChar():"Escape"===t&&clearDisplay()}))})();