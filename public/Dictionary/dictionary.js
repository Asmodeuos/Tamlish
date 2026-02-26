// TODO create words+ prhases datset and searhcing capabilites
// TODO database structre - when fetchign all words and thier profocinecies for user -  use topic statusues to only fetch active topics by getting ids starting with (.startswith) t(topicnumber)

const wordsTableBody = document.getElementById("wordsTable").querySelector("tbody");
const phrasesTableBody = document.getElementById("phrasesTable").querySelector("tbody");
const wordsTable = document.getElementById("wordsTable");
const phrasesTable = document.getElementById("phrasesTable");
const wordsSwitchBtn = document.getElementById("wordsSwitchBtn");
const phrasesSwitchBtn = document.getElementById("phrasesSwitchBtn");
const backBtn = document.getElementById("backBtn");


wordsSwitchBtn.addEventListener("click", () => {
  wordsTable.style.display = "block";
  phrasesTable.style.display = "none";
});

phrasesSwitchBtn.addEventListener("click", () => {
  wordsTable.style.display = "none";
  phrasesTable.style.display = "block";
});

let vocab = {}; 
let wordsArray = [];
let phrasesArray = [];
let fuseWords;
let fusePhrases;
fetch("dictionary.json")
  .then(res => res.json())
  .then(data => {
    vocab = data;
    for (let id in vocab){
        if (id.includes("w")){
            wordsArray.push({ id: id, english: vocab[id].english, tamlish: vocab[id].tamlish });
        }
        else if (id.includes("p")){
            phrasesArray.push({ id: id, english: vocab[id].english, tamlish: vocab[id].tamlish });
        }
    }
    populateTable(wordsArray, wordsTableBody);
    populateTable(phrasesArray, phrasesTableBody);
    fuseWords = new Fuse(wordsArray, options);
    fusePhrases = new Fuse(phrasesArray, options);
  });


function populateTable(array, table) {
    table.innerHTML = "";

    array.forEach(item => {
        const row = document.createElement("tr");
        row.id = item.id;

        const listenCell = document.createElement("td");
        row.appendChild(listenCell);

        const englishCell = document.createElement("td");
        englishCell.textContent = item.english;
        row.appendChild(englishCell);

        const tamlishCell = document.createElement("td");
        tamlishCell.textContent = item.tamlish;
        row.appendChild(tamlishCell);

        const proficencyCell = document.createElement("td");
        row.appendChild(proficencyCell);
        
        table.appendChild(row);
    });
};  

const options = {
  keys: ["english", "tamlish"],
//   threshold: 0.9, 
};



function search(query){
    const wordsResults = fuseWords.search(query).map(result => result.item); // only gets the results not other data like score
    const phrasesResults = fusePhrases.search(query).map(result => result.item);
    populateTable(wordsResults, wordsTableBody);
    populateTable(phrasesResults, phrasesTableBody);
    backBtn.style.display = "block";

  console.log("Words:", wordsResults);
  console.log("Phrases:", phrasesResults);
}


const searchBtn = document.getElementById("searchBtn");
const searchQuery = document.getElementById("searchBox");

searchBtn.addEventListener("click", () => {
    if (searchQuery.value){
        search(searchQuery.value);
    }
    else{
        console.log("no search value inputted");
    }
});

backBtn.addEventListener("click", () => {
    populateTable(wordsArray, wordsTableBody);
    populateTable(phrasesArray, phrasesTableBody);
    backBtn.style.display = "none";
})