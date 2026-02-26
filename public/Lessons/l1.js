import { switchSection, oneElementSelector, markSection, switchedSectionTo, lessonLength, timer } from "./lessonFunctions.js"; 

const continueBtn = document.querySelector(".nextSectionBtn");
const imageSection = document.querySelector(".choose_picture");
const pickHeardWord = document.querySelector(".choose_heard_word");
const writeEnglishWord = document.querySelector(".write_EnglishWord")
const lessonEnd  = document.querySelector(".lesson_end");
const lessonTime = document.getElementById("lessonTime");
let time;


// TODO replace vocab and elemtns ids with vocab ids

lessonLength(3,"topic1");
timer("start");
// Pick the correct image section

switchSection(lessonEnd,imageSection)
oneElementSelector("imgs","img2");
markSection("", "selection", "pickHeardWord");

function continueLesson(){
    if (switchedSectionTo() === "pickHeardWord"){
        // Pick the correct heard word section
        switchSection(imageSection, pickHeardWord)
        oneElementSelector("heardWords","heardWord2")
        markSection("","selection", "writeEnglishWord")
    }
    else if (switchedSectionTo() === "writeEnglishWord"){
        // Write the english word section
        switchSection(pickHeardWord, writeEnglishWord)
        markSection("t1w1","typedEnglishInput","lessonEnd")
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


