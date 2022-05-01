import {
  BlockLocation,
  CraftBlock,
  CraftBlockUpdate,
  CraftTextBlock,
  ApiResponseError,
  CraftBlockInsert,
  ApiResponse,
  IndexLocation,
  CraftDataApi,
} from "@craftdocs/craft-extension-api";
import "./style.css";
import { DocumentDataService } from "./mock/document_data";

export const DocumentDataServiceInstance = new DocumentDataService();

export class SerendipityCraftDataApi implements CraftDataApi {
  constructor(private documentData = DocumentDataServiceInstance) {}

  public async addBlocks(
    blocks: CraftBlockInsert[],
    location?: BlockLocation
  ): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const addedBlocks = this.documentData.addBlocks(blocks, location);

      return {
        status: "success",
        data: addedBlocks,
      };
    } catch (err: unknown) {
      return createResponseError(err);
    }
  }

  public async updateBlocks(
    blockModels: CraftBlockUpdate[]
  ): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const updatedBlocks = this.documentData.updateBlocks(blockModels);

      return {
        status: "success",
        data: updatedBlocks,
      };
    } catch (err: unknown) {
      return createResponseError(err);
    }
  }

  public async moveBlocks(
    blockIds: string[],
    location: BlockLocation
  ): Promise<ApiResponse<CraftBlock[]>> {
    try {
      const blocks = this.documentData.moveBlocks(blockIds, location);

      return {
        status: "success",
        data: blocks,
      };
    } catch (err: unknown) {
      return createResponseError(err);
    }
  }

  public async deleteBlocks(
    blockIds: string[]
  ): Promise<ApiResponse<string[]>> {
    try {
      const deletedBlockIds = this.documentData.deleteBlocks(blockIds);

      return {
        status: "success",
        data: deletedBlockIds,
      };
    } catch (err: unknown) {
      return createResponseError(err);
    }
  }

  public async getCurrentPage(): Promise<ApiResponse<CraftTextBlock>> {
    try {
      const page = this.documentData.getCurrentPage();

      return {
        status: "success",
        data: page,
      };
    } catch (err: unknown) {
      return createResponseError(err);
    }
  }
}

function createResponseError<T>(err: unknown): ApiResponseError<T> {
  const message =
    err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : "Failure";

  return {
    status: "error",
    message,
  };
}

/* ---- ENSURE DEV MODE WORKS ----- 
You can run this extension locally with `npm run dev` in order to have faster iteration cycles.
When running this way, the craft object won't be available and JS exception will occur
With this helper function you can ensure that no exceptions occur for craft api related calls.
/* ---------------------------------*/

function isCraftLibAvailable() {
  return typeof craft !== "undefined";
}
/* ---------------------------------*/
/* ---- DARK/LIGHT MODE ----------- */
/* ---------------------------------*/

/*
According to tailwind documentation, see : https://tailwindcss.com/docs/dark-mode#toggling-dark-mode-manually
*/
if (isCraftLibAvailable() == true) {
  craft.env.setListener((env) => {
    if (env.colorScheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  });
}

/* ---------------------------------*/
/* ------------ CONSOLE ----------- */
/* ---------------------------------*/

function showConsole() {
  let element = document.getElementById("consoleContent");
  let clearBtn = document.getElementById("consoleClear");
  element.style.display = "block";
  clearBtn.style.visibility = "visible";
  // document.getElementById("console").style.minHeight = "50%"
  // document.getElementById("console").classList.add("surfaceShadow")
}

function hideConsole() {
  let element = document.getElementById("consoleContent");
  let clearBtn = document.getElementById("consoleClear");
  element.style.display = "none";
  clearBtn.style.visibility = "hidden";
  // document.getElementById("console").style.minHeight = "0"
  // document.getElementById("console").classList.remove("surfaceShadow")
}

function clearConsole() {
  document.getElementById("consoleItems").innerHTML = "";
}

function logInPageConsoleMessage(msg: string) {
  console.log("InPageConsole: " + msg);
  let newElement = document.createElement("div");
  newElement.className = "consoleContentItem";
  newElement.innerHTML = msg;
  let consoleItemDiv = document.getElementById("consoleItems");
  consoleItemDiv.append(newElement);
}

document.getElementById("consoleClear").onclick = async () => {
  clearConsole();
};

/* ---------------------------------*/
/* ---------- NAVIGATION ---------- */
/* ---------------------------------*/

/*
Store the id of the DIV  currently displayed
*/
var currentSubPageDiv: string;

function navigateToPage(divId: string, title: string) {
  currentSubPageDiv = divId;
  document.getElementById("navBar_title").innerHTML = title;
  document.getElementById("mainMenu").style.display = "none";
  document.getElementById(currentSubPageDiv).style.display = "block";
  document.getElementById("navBar_backButton").style.visibility = "visible";
}

function navigateBackFromPage() {
  document.getElementById("navBar_title").innerHTML = "Craft X Example";
  document.getElementById("mainMenu").style.display = "block";
  document.getElementById(currentSubPageDiv).style.display = "none";
  document.getElementById("navBar_backButton").style.visibility = "hidden";
  currentSubPageDiv = "";
}
// document.getElementById("mainMenu_dataApi").onclick = async () => {
//   navigateToPage("dataApiDetails", "Data APIs")
// }

document.getElementById("navBar_backButton").onclick = async () => {
  navigateBackFromPage();
};

/* ---------------------------------*/
/* ---------- DATA API ------------ */
/* ---------------------------------*/
let loadedBlocks: CraftBlock[] = [];

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
  let mockCraftDataApi = new SerendipityCraftDataApi();
  const result = await mockCraftDataApi.getCurrentPage();
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
  // let stringArray = [
  //   "Matthew",
  //   "John",
  //   "Luke",
  //   "Mark",
  //   "Peter",
  //   "Paul",
  //   "John",
  // ];
  // stringArray.forEach((element) => {
  //   logInPageConsoleMessage(element.toString());
  // });

  var title = "";
  console.log("stringArray: titleBlocks.length = " + titleBlocks.length);

  titleBlocks.forEach((element) => {
    if ("content" in element) {
      if ("style" in element) {
        if ("textStyle" in element.style) {
          var textStyle = element.style.textStyle;
          console.log(
            "InPageConsole: textStyle = " +
              textStyle +
              " for element " +
              element
          );

          var space = "";
          if (textStyle == "title") {
            space += "";
          }
          if (textStyle == "subtitle") {
            space += "&nbsp;&nbsp;";
          }
          if (textStyle == "heading") {
            space += "&nbsp;&nbsp;&nbsp;&nbsp;";
          }
          element.content.forEach((textContent) => {
            console.log("stringArray: title 11111111 = " + space + textContent.text);
            logInPageConsoleMessage( space + textContent.text);
          });
        }
      }
    }
  });
  let element = document.getElementById("consoleContent");
  if (element.style.display == "none") {
    showConsole();
  } else {
  }
};
