let answered = false;
let switchedTo;
const root = document.documentElement;

// Lesson length

function lessonLength(length){
    lessonLength = length;
};

// Change Lesson Section

const lessonHud = document.getElementById("hud");
const lessonEnd  = document.querySelector(".lesson_end");

function switchSection(currentSection, nextSection) {
        currentSection.style.display = "none"
        nextSection.style.display = "block"
        answered = false;
        resultBox.classList.remove("animated");
        resultBox.classList.add("notAnimated");
        if (nextSection === lessonEnd){
            lessonHud.style.display = "none";
            checkBtn.style.display = "none";
        }
};


// Singular correct element selection logic
let selectedElement;

function oneElementSelector(elementsClass) {
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
    })
};

// Section Marker
let currentAnswer;
let currentQuestionType;
let typedValue;
let switchedToSection;
let editDistance;
let currentEditDistance;
let correctLength;
const checkBtn = document.querySelector(".checkBtn");
const typedEnglishWordPointer = document.querySelector(".EnglishTypedWord");
const resultBox = document.querySelector(".resultBox");

function markSection(answer, questionType, switchedToSectionpointer) {
    currentAnswer = answer.split(" ");
    currentQuestionType = questionType;
    switchedToSection = switchedToSectionpointer
};

function setResultsBoxColour(colour){
    root.style.setProperty('--resultBox-bg-colour', colour);
}

checkBtn.addEventListener("click", () => {
    typedValue = typedEnglishWordPointer.value.trim().split(" ");
    if (currentQuestionType === "typedEnglishInput" && typedValue.length > 0){
        answered = true;
    }
    if (answered){
        switchedTo = switchedToSection;
        if (currentQuestionType === "selection"){
            if (currentAnswer[0] === selectedElement) {
                console.log("correct");
                setResultsBoxColour("green");
            }
            else{
                console.log("incorrect");
                setResultsBoxColour("red");
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
            }
            if (correctLength){
                let arrayDistances = [];
                for (let i = 0; i < typedValue.length; i++){
                    const wordI = typedValue[i];
                    const wordA = currentAnswer[i];
                    currentEditDistance = levenshtein(wordA, wordI).steps;
                    arrayDistances.push(currentEditDistance);
                }
                editDistance = Math.max(...arrayDistances) // ... spread operator converts array into individual numbers
                console.log("edit distance: ", editDistance);
                if (editDistance <= 1){
                    console.log("correct");
                    setResultsBoxColour("green");
                }
                else{
                    console.log("incorrect");
                    setResultsBoxColour("red");
                }
            }
        }
        resultBox.classList.remove("notAnimated");
        resultBox.classList.add("animated");
        increaseProgress(lessonLength);
    }
});
            

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
})


function switchedSectionTo(){
    return switchedTo;
}

// Exporting Functions
export { switchSection, oneElementSelector, markSection, switchedSectionTo, lessonLength };



