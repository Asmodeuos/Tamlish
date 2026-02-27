import { auth, doc, setDoc, db, onAuthStateChanged } from "../firebase-config.js";

let answered = false;
let switchedTo;
const root = document.documentElement;

// TODO make ids for eahc typed word and prhase, and list of englosh + trnlaiton in lists (e.g.index 0 englsh index1 tamlish)

// TODO for selection sections make seprate lists with each option id as well as type e.g. image or sound - for each item use indidvial id and check selcted elemtn id against actual id (perhaps set html elemetns id to word id)

// * lesson section types {current: imagesection, pickheardword, writeEnglishWord, lessonEnd } (new: writeTamlishWord, pickwrittenword, picksoundheardword)


let currentUser = null;

onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    }
});

// Fetching vocabulary IDs
let vocab;

fetch("../Dictionary/dictionary.json")
  .then(response => response.json())
  .then(data => {
    vocab = data;
    console.log("fetched vocab ids");
  });


// Lesson length and topic number
let lessonLengthValue;
let topic;
let lesson;

function lessonDetails(length, topicnum, lessonnum){
    lessonLengthValue = length;
    topic = topicnum;
    lesson = lessonnum; 

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
        clicked = 0;
        selectedFeedback = null;
        selectedElement = null;
        typedEnglishWordPointer.value = "";
        if (nextSection === lessonEnd){
            lessonHud.style.display = "none";
            checkBtn.style.display = "none";
        }
};


// Singular correct element selection logic
let selectedElement;
let answerOption;
let elements;

function oneElementSelector(elementsClass, answeroption) {
    answerOption = answeroption; // * temp varabile till selction storgare sorted out
    elements = document.querySelectorAll(`.${elementsClass}`);
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
};

// Escape key logic
const cancelLessonBox = document.getElementById("cancelLessonBox");
const quitLessonBtn = document.getElementById("quitLessonBtn");
const continueBtn = document.getElementById("cancelBtn");
const exitBtn = document.getElementById("exitbtn");

window.addEventListener("keydown", (event) => {
    if (event.key === "Escape"){
        if (selectedElement && elements){
            elements.forEach(elmnt => {
            elmnt.classList.remove("clicked");
            });
            answered = false;
            selectedElement = null;
        } 
        else if (document.activeElement.tagName === "INPUT"){
            document.activeElement.blur();
        }
        else{
            cancelLessonBox.classList.remove("notAnimated");
            cancelLessonBox.classList.add("animated");
            console.log("tried to escape lesson");
        }
    }
});

quitLessonBtn.addEventListener("click", () =>{
    window.location.href = "lessons.html";
})

continueBtn.addEventListener("click", () =>{
    cancelLessonBox.classList.remove("animated");
    cancelLessonBox.classList.add("notAnimated");
})

exitBtn.addEventListener("click", () => {
    cancelLessonBox.classList.remove("notAnimated");
    cancelLessonBox.classList.add("animated");
})

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
let selectedFeedback;
const checkBtn = document.querySelector(".checkBtn");
const typedEnglishWordPointer = document.querySelector(".EnglishTypedWord");
const resultBox = document.querySelector(".resultBox");
const messageOverview = document.getElementById("messageBox");
const answerMessage = document.getElementById("answerMessage");
const userFeedbackBox = document.getElementById("userFeedbackBox");
const feedbackBtns = document.querySelectorAll(".feedbackBtn");

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

feedbackBtns.forEach(button => {
    button.addEventListener("click", (event) =>{
        const btnID = event.target.id;
        if (btnID === "goodProficiencyBtn"){
            selectedFeedback = "good";
        }
        else if (btnID === "neutralProficiencyBtn"){
            selectedFeedback = "neutral";
        }
        else if (btnID === "badProficiencyBtn"){
            selectedFeedback = "bad";
        }
    })
})


async function addWordtoTopic(answerstatus, vocabID){
    if (answerstatus === "correct"){
        vocabData = "good";
    }
    else if (answerstatus === "mostlyCorrect"){
        vocabData = "neutral"
    }
    else if (answerstatus === "incorrect"){
        vocabData = selectedFeedback ?? "bad";
    }
    else{
        vocabData = "bad";
    }
    const userID = currentUser.uid;
    if (currentUser){
        try{
            const wordsDocRef = doc(db, "users", userID, "topics", topic, "vocab", "words");
            await setDoc(wordsDocRef, {
                [vocabID]: vocabData
            }, { merge: true });
            console.log(`added proficency of ${vocabData} to ${vocabID}`);
            const topicDocRef = doc(db, "users", userID, "topics", topic);
            await setDoc(topicDocRef, {
                "status": "active"
            }, { merge: true });
        }
        catch (error){
            console.log("error with database", error)
        }
    }
};

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
            // TODO add selector ids and apply marking logic for that
            if (currentAnswer === selectedElement) {
                console.log("correct");
                setResultsBoxColour("green");
                setMessages("Well Done!","");
                userFeedbackBox.style.display = "none";
            }
            else{
                console.log("incorrect");
                setResultsBoxColour("red");
                setMessages("Incorrect",`The correct answer was "${currentAnswer[0]}"`);
                userFeedbackBox.style.display = "block";
            }
        }
        else if (currentQuestionType === "typedEnglishInput"){
            if (typedValue.length === currentAnswer.length){
                correctLength = true;
            }
            else{
                correctLength = false;
                console.log("incorrect");
                setResultsBoxColour("red");
                setMessages("Incorrect",`The correct answer was "${currentAnswer.join(" ")}"`);
                userFeedbackBox.style.display = "block";
                addWordtoTopic("incorrect", currentAnswerID);
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
                    addWordtoTopic("mostlyCorrect", currentAnswerID);
                }
                else if (editDistance === 0){
                    console.log("correct");
                    setResultsBoxColour("green");
                    setMessages("Perfect","");
                    userFeedbackBox.style.display = "none";
                    addWordtoTopic("correct", currentAnswerID);
                }
                else{
                    console.log("incorrect");
                    setResultsBoxColour("red");
                    setMessages("Incorrect",`The correct answer was "${currentAnswer.join(" ")}"`);
                    userFeedbackBox.style.display = "block";
                    addWordtoTopic("incorrect", currentAnswerID);
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

endLessonBtn.addEventListener("click", async () =>{
    if (currentUser){
        try{
            const userID = currentUser.uid;
            const lessonStatusDocRef = doc(db, "users", userID, "lessonStatuses", "lessonStatus")
            await setDoc(lessonStatusDocRef, {
                [lesson]: "completed"
            }, { merge: true });
        }   
        catch (error){
            console.log("error",error);
        }
    }
    window.location.href = "lessons.html";
});

function switchedSectionTo(){
    return switchedTo;
}

// Exporting Functions
export { switchSection, oneElementSelector, markSection, switchedSectionTo, lessonDetails, timer };



