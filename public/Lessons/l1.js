import { switchSection, oneElementSelector, markSection, switchedSectionTo, lessonLength, timer } from "./lessonFunctions.js"; 

const continueBtn = document.querySelector(".nextSectionBtn");
const imageSection = document.querySelector(".choose_picture");
const pickHeardWord = document.querySelector(".choose_heard_word");
const writeEnglishWord = document.querySelector(".write_EnglishWord")
const lessonEnd  = document.querySelector(".lesson_end");
const lessonTime = document.getElementById("lessonTime");
const resultBox = document.querySelector(".resultBox");
let time;

lessonLength(3);
timer("start");
// Pick the correct image section

switchSection(lessonEnd,imageSection)
oneElementSelector("imgs");
markSection("img2", "selection", "pickHeardWord");

function continueLesson(){
    if (switchedSectionTo() === "pickHeardWord"){
        // Pick the correct heard word section
        switchSection(imageSection, pickHeardWord)
        oneElementSelector("heardWords")
        markSection("heardWord2","selection", "writeWord")
    }
    else if (switchedSectionTo() === "writeWord"){
        // Write the english word section
        switchSection(pickHeardWord, writeEnglishWord)
        markSection("this is a test","typedEnglishInput","lessonEnd")
    }
    else if (switchedSectionTo() === "lessonEnd"){
        // End of the lesson
        time = Math.floor(timer("stop")/1000);
        lessonTime.textContent = time + 's';
        switchSection(writeEnglishWord, lessonEnd)
    }
};

continueBtn.addEventListener("click", () => {
    continueLesson();
});

window.addEventListener("enterKeyPressed", () => {
    continueLesson();
});


