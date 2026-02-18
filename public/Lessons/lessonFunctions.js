let answered = false;
let switchedTo;

// Change Lesson Section

function switchSection(currentSection, nextSection) {
        currentSection.style.display = "none"
        nextSection.style.display = "block"
        answered = false;
        continueBtn.style.display = "none"
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
let accuracy;
let switchedToSection;
let resultList;
let closestMatch;
const checkBtn = document.querySelector(".checkBtn");
const continueBtn = document.querySelector(".nextSectionBtn");
const typedEnglishWordPointer = document.querySelector(".EnglishTypedWord");

function markSection(answer, questionType, switchedToSectionpointer) {
    currentAnswer = answer;
    currentQuestionType = questionType;
    switchedToSection = switchedToSectionpointer
};

checkBtn.addEventListener("click", () => {
    typedValue = typedEnglishWordPointer.value.trim();
    if (typedValue !== ""){
        answered = true;
    }
    if (answered){
        continueBtn.style.display = "block";
        switchedTo = switchedToSection;
        if (currentQuestionType === "selection"){
            if (currentAnswer === selectedElement) {
            console.log("correct");
            }
            else{
                console.log("incorrect");
            }
        }
        else if (currentQuestionType === "typedEnglishInput"){
            // let wordSet = FuzzySet([currentAnswer]);
            // console.log(typedValue)
            // resultList = wordSet.get(typedValue,0,0.0);
            // if (resultList === 0){
            //     accuracy = 0
            //     closestMatch = "n/a"
            // }
            // else{
            //     accuracy = resultList[0][0] // closest match accuracy value
            //     closestMatch = resultList[0][1] // closest match
            // }
            
            // if (accuracy >= 0.8){
            //     console.log("correct")
            //     console.log("accuracy: ", accuracy);
            //     console.log("closest match: ", closestMatch);
            
 
        
            }
            else{
                // console.log("incorrect")
                // console.log("accuracy: ", accuracy);
                // console.log("closest match: ", closestMatch);
            }
        }
        }
            

    

);


function switchedSectionTo(){
    return switchedTo;
}



// Exporting Functions
export { switchSection, oneElementSelector, markSection, switchedSectionTo };



