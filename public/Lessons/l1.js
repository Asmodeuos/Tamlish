import { switchSection, oneElementSelector, markSection, switchedSectionTo } from "./lessonFunctions.js"; 

const continueBtn = document.querySelector(".nextSectionBtn");
const imageSection = document.querySelector(".choose_picture");
const pickHeardWord = document.querySelector(".choose_heard_word");
const writeEnglishWord = document.querySelector(".write_EnglishWord")
const lessonEnd  = document.querySelector(".lesson_end");

// Pick the correct image section

switchSection(lessonEnd,imageSection)
oneElementSelector("imgs");
markSection("img2", "selection", "pickHeardWord");

continueBtn.addEventListener("click", () => {
    if (switchedSectionTo() === "pickHeardWord"){
        // Pick the correct heard word section
        switchSection(imageSection, pickHeardWord)
        oneElementSelector("heardWords")
        markSection("heardWord2","selection", "writeWord")
    }
    else if (switchedSectionTo() === "writeWord"){
        // Write the english word section
        switchSection(pickHeardWord, writeEnglishWord)
        markSection("test","typedEnglishInput","na")
    }
})


