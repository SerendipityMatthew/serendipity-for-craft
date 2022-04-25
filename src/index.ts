
import { BlockLocation, CraftBlock, CraftBlockUpdate, CraftTextBlock, IndexLocation } from "@craftdocs/craft-extension-api";
import "./style.css";

/* ---- ENSURE DEV MODE WORKS ----- 
You can run this extension locally with `npm run dev` in order to have faster iteration cycles.
When running this way, the craft object won't be available and JS exception will occur
With this helper function you can ensure that no exceptions occur for craft api related calls.
/* ---------------------------------*/

function isCraftLibAvailable() {
  return typeof craft !== 'undefined'
}
/* ---------------------------------*/
/* ---- DARK/LIGHT MODE ----------- */
/* ---------------------------------*/

/*
According to tailwind documentation, see : https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
*/
if (isCraftLibAvailable() == true) {
  craft.env.setListener((env) => {
    if (env.colorScheme === 'dark' ) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  });
}
  
/* ---------------------------------*/
/* ------------ CONSOLE ----------- */
/* ---------------------------------*/

function showConsole() {
  let element = document.getElementById("consoleContent")
  let clearBtn = document.getElementById("consoleClear")
  element.style.display = "block"
  clearBtn.style.visibility = "visible"
  document.getElementById("console").style.minHeight = "50%"
  document.getElementById("console").classList.add("surfaceShadow")
}

function hideConsole() {
  let element = document.getElementById("consoleContent")
  let clearBtn = document.getElementById("consoleClear")
  element.style.display = "none"
  clearBtn.style.visibility = "hidden"
  document.getElementById("console").style.minHeight = "0"
  document.getElementById("console").classList.remove("surfaceShadow")
}

function clearConsole() {
  document.getElementById("consoleItems").innerHTML = ""
  document.getElementById("consoleItemCount").style.visibility = "hidden"
}


function logInPageConsoleMessage(msg : string) {
  console.log("InPageConsole: " + msg)
  let newElement = document.createElement("div")
  newElement.className = "consoleContentItem"
  newElement.innerHTML = msg
  let consoleItemDiv = document.getElementById("consoleItems")
  let consoleMsgCountDiv = document.getElementById("consoleItemCount")
  consoleItemDiv.append(newElement)
  consoleMsgCountDiv.style.visibility = "visible"
  consoleMsgCountDiv.style.visibility = "visible"
  consoleMsgCountDiv.innerHTML = document.getElementById("consoleItems").childNodes.length.toString()
}


document.getElementById("openConsole").onclick = async () => {
  let element = document.getElementById("consoleContent")
  if (element.style.display == "none") {
    showConsole()
  } else { 
   }
}

document.getElementById("consoleClear").onclick = async () => {
  clearConsole()
}


/* ---------------------------------*/
/* ---------- NAVIGATION ---------- */
/* ---------------------------------*/

/*
Store the id of the DIV  currently displayed
*/
var currentSubPageDiv : string

function navigateToPage(divId : string, title:string) {
  currentSubPageDiv = divId
  document.getElementById("navBar_title").innerHTML = title
  document.getElementById("mainMenu").style.display = "none"
  document.getElementById(currentSubPageDiv).style.display = "block"
  document.getElementById("navBar_backButton").style.visibility = "visible"
}

function navigateBackFromPage() {
  document.getElementById("navBar_title").innerHTML = "Craft X Example"
  document.getElementById("mainMenu").style.display = "block"
  document.getElementById(currentSubPageDiv).style.display = "none"
  document.getElementById("navBar_backButton").style.visibility = "hidden"
  currentSubPageDiv = ""
}
document.getElementById("mainMenu_dataApi").onclick = async () => {
  navigateToPage("dataApiDetails", "Data APIs")
}


document.getElementById("navBar_backButton").onclick = async() => {
  navigateBackFromPage()
}

/* ---------------------------------*/
/* ---------- DATA API ------------ */
/* ---------------------------------*/
let loadedBlocks : CraftBlock[] = []


// document.getElementById("get_page_button").onclick = async () => {
//   logInPageConsoleMessage("Get Page Button Pressed")
//   const result = await craft.dataApi.getCurrentPage();
//   const pageBlock = result.data;
//   loadedBlocks = pageBlock.subblocks;
//   const titleBlocks = loadedBlocks.filter(block =>
//       {
//         var textStyle = ""
//         if ("style" in block) {
//           if(block.style.textStyle !== undefined){
//             textStyle = block.style.textStyle
//           }
//         }
//         return textStyle == "subtitle" || textStyle == "title" || textStyle == "heading"
//       }
//     )
//     var title = ""
//     titleBlocks.forEach(element => {
//       if ("content" in element) {
//         element.content.forEach(textContent => {
//           title += textContent.text + "\n";
//         });
//       }});
//     logInPageConsoleMessage("Get Page Result: " + title )
// }

document.getElementById("mainMenu_dataApi").onclick = async () => {
  const result = await craft.dataApi.getCurrentPage();
  const pageBlock = result.data;
  loadedBlocks = pageBlock.subblocks;
  const titleBlocks = loadedBlocks.filter((block) => {
    var textStyle = "";
    console.log("InPageConsole: block " + block);

    if ("style" in block) {
      if (block.style.textStyle !== undefined) {
        textStyle = block.style.textStyle;
      }
    }
    return (
      textStyle == "title" || textStyle == "subtitle" || textStyle == "heading"
    );
  });
  let stringArray = ["Matthew", "John", "Luke", "Mark", "Peter", "Paul", "John"];
  stringArray.forEach(element => {
      console.log("stringArray: element = " + element);
      logInPageConsoleMessage(element.toString());
  });

  var title = "";
  titleBlocks.forEach((element) => {
    if ("content" in element) {
      var space = "";
      element.content.forEach((textContent) => {
        title += space + textContent.text;
        logInPageConsoleMessage(space + title + " " + titleBlocks.length);
      });
    }
  });
  document.getElementById("openConsole").click();
};