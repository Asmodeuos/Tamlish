import { auth, doc, setDoc, db } from "../firebase-config.js";

let answered = false;
let switchedTo;
const root = document.documentElement;

// TODO make ids for eahc typed word and prhase, and list of englosh + trnlaiton in lists (e.g.index 0 englsh index1 tamlish)

// TODO for selection sections make seprate lists with each option id as well as type e.g. image or sound - for each item use indidvial id and check selcted elemtn id against actual id (perhaps set html elemetns id to word id)

// * lesson section types {current: imagesection, pickheardword, writeEnglishWord, lessonEnd } (new: writeTamlishWord, pickwrittenword, picksoundheardword)


// Fetching vocabulary IDs
let vocab;

fetch("../Dictionary/dictionary.json")
  .then(response => response.json())
  .then(data => {
    vocab = data;
    console.log("fetched vocab ids");
  });


// Lesson length
let lessonLengthValue;

function lessonLength(length){
    lessonLengthValue = length;
};

// Timer

let time;
let startTime;
let finalTime;

function timer(command){
    if (command === "start"){
        startTime = Date.now();
    }
    else if (command === "stop"){
        finalTime = Date.now();
        time = finalTime - startTime;
        return time;
    }
}

// Change Lesson Section

const lessonHud = document.getElementById("hud");
const lessonEnd  = document.querySelector(".lesson_end");
const lessonOverlay = document.getElementById("lessonOverlay");

function switchSection(currentSection, nextSection) {
        currentSection.style.display = "none"
        nextSection.style.display = "block"
        answered = false;
        resultBox.classList.remove("animated");
        resultBox.classList.add("notAnimated");
        sectionState = "answering";
        lessonOverlay.style.display = "none";
        if (nextSection === lessonEnd){
            lessonHud.style.display = "none";
            checkBtn.style.display = "none";
        }
};


// Singular correct element selection logic
let selectedElement;
let answerOption;

function oneElementSelector(elementsClass, answeroption) {
    answerOption = answeroption; // * temp varabile till selction storgare sorted out
    const elements = document.querySelectorAll(`.${elementsClass}`);
    elements.forEach(element => {
        element.addEventListener("click", () => {
            elements.forEach(elmnt => {
                elmnt.classList.remove("clicked");
            });
            element.classList.add("clicked");
            selectedElement = element.id;
            console.log(selectedElement);
            answered = true;
            console.log("answered:", answered)
        });
    });
    window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && lessonOverlay.style.display !== "block" && currentQuestionType !== "typedeEnglishInput"){
            elements.forEach(elmnt => {
                elmnt.classList.remove("clicked");
            });
            answered = false;
            selectedElement = null;
        };
    });
};

// Section Marker
let currentAnswerID;
let currentAnswer;
let currentQuestionType;
let typedValue;
let switchedToSection;
let editDistance;
let currentEditDistance;
let correctLength;
let clicked = 0;
let sectionState = "answering";
let vocabData;
const checkBtn = document.querySelector(".checkBtn");
const typedEnglishWordPointer = document.querySelector(".EnglishTypedWord");
const resultBox = document.querySelector(".resultBox");
const messageOverview = document.getElementById("messageBox");
const answerMessage = document.getElementById("answerMessage");
const userFeedbackBox = document.getElementById("userFeedbackBox");

function markSection(answerID, questionType, switchedToSectionpointer) {
    currentAnswerID = answerID;
    currentQuestionType = questionType;
    switchedToSection = switchedToSectionpointer;
};

function setResultsBoxColour(colour){
    root.style.setProperty('--resultBox-bg-colour', colour);
}

function setMessages(messageoverview, answermessage){
    console.log("message set");
    messageOverview.textContent = messageoverview;
    answerMessage.textContent = answermessage;
}

async function addWordtoTopic(answerstatus, topic, vocabID){
    const feedbackBtns = document.querySelectorAll(".feedbackBtn");

    if (answerstatus === "correct"){
        vocabData = "good"
    }
    else if (answerstatus === "mostlyCorrect"){
        vocabData = "neutral"
    }
    else{
        feedbackBtns.forEach(button => {
            button.addEventListener("click", (event) =>{
                const btnID = event.target.id;
                if (btnID = "goodProficiencyBtn"){
                    vocabData = "good";
                }
                else if (btnID = "neutralProficiencyBtn"){
                    vocabData = "neutral";
                }
                else if (btnID = "badProficiencyBtn"){
                    vocabData = "bad";
                }
            })
        })
    }
    const user = auth.currentUser;
    if (user){
        const userId = user.uid;
        const wordsDocRef = doc(db, "users", userId, "topics", topic, "vocab", "words");
        await setDoc(wordsDocRef, {
            [vocabID]: vocabData
        }, { merge: true });
        console.log(`added proficency of ${vocabData} to ${vocabID}`);
    }
}

function mark(){
    if (sectionState !== "answering") return; //exits if mark has already been called once
    if (currentQuestionType === "typedEnglishInput"){
        currentAnswer = vocab[currentAnswerID].tamlish.split(" ");
    }
    else if (currentQuestionType === "selection"){
        currentAnswer = answerOption;
    }
    typedValue = typedEnglishWordPointer.value.trim();
    typedEnglishWordPointer.blur(); // deselects input box
    if (currentQuestionType === "typedEnglishInput" && typedValue.length > 0){
        answered = true;
        typedValue = typedValue.split(" ");
    }
    if (answered){
        switchedTo = switchedToSection;
        if (currentQuestionType === "selection"){
            if (currentAnswer[0] === selectedElement) {
                console.log("correct");
                setResultsBoxColour("green");
                setMessages("Well Done!","");
                userFeedbackBox.style.display = "none";
                addWordtoTopic("correct", )
            }
            else{
                console.log("incorrect");
                setResultsBoxColour("red");
                setMessages("Incorrect",`The correct answer was "${currentAnswer[0]}"`);
                userFeedbackBox.style.display = "block";
            }
        }
        else if (currentQuestionType === "typedEnglishInput"){
            // TODO use vocab ids to get actual vocab to cmpare and do markign logic

            if (typedValue.length === currentAnswer.length){
                correctLength = true;
            }
            else{
                correctLength = false;
                console.log("incorrect");
                setResultsBoxColour("red");
                setMessages("Incorrect",`The correct answer was "${currentAnswer.join(" ")}"`);
                userFeedbackBox.style.display = "block";

            }
            if (correctLength){
                let arrayDistances = [];
                for (let i = 0; i < typedValue.length; i++){
                    const wordI = typedValue[i];
                    const wordA = currentAnswer[i];
                    currentEditDistance = levenshtein(wordA, wordI).steps;
                    arrayDistances.push(currentEditDistance);
                }
                editDistance = Math.max(...arrayDistances) // ... spread operator converts array    into individual numbers
                console.log("edit distance: ", editDistance);
                if (editDistance === 1){
                    console.log("correct");
                    setResultsBoxColour("green");
                    setMessages("Well Done!","");
                    userFeedbackBox.style.display = "none";
                }
                else if (editDistance === 0){
                    console.log("correct");
                    setResultsBoxColour("green");
                    setMessages("Perfect","");
                    userFeedbackBox.style.display = "none";
                }
                else{
                    console.log("incorrect");
                    setResultsBoxColour("red");
                    setMessages("Incorrect",`The correct answer was "${currentAnswer.join(" ")}"`);
                    userFeedbackBox.style.display = "block";

                }
            }
        }
        resultBox.classList.remove("notAnimated");
        resultBox.classList.add("animated");
        lessonOverlay.style.display = "block";
        clicked ++
        if (clicked === 1){
            increaseProgress(lessonLengthValue);
        }
        sectionState = "marked";
    }
    
};

checkBtn.addEventListener("click", () => {
    mark();
});


window.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && sectionState === "answering"){
        mark();
    }
    else if(event.key === "Enter" && sectionState === "marked"){
        window.dispatchEvent(new CustomEvent("enterKeyPressed"));
        if (switchedTo !== "lessonEnd"){
            sectionState = "answering"; // To allow more clicks for next sections
        }
        else{
            sectionState = "finished";
        }
    }
})

// Progress bar

const progressBar = document.getElementById("progressBar");
let progress = 0;

function increaseProgress(lessonLength) {
    if (progress < 100){
        progress += (100/lessonLength);
        progressBar.style.width = progress + '%';
    }
};

// End of the lesson

const endLessonBtn = document.getElementById("endLessonBtn");

endLessonBtn.addEventListener("click", () =>{
    window.location.href = "lessons.html";
    // add lesson num status "completed"
})


function switchedSectionTo(){
    return switchedTo;
}

// Exporting Functions
export { switchSection, oneElementSelector, markSection, switchedSectionTo, lessonLength, timer };



