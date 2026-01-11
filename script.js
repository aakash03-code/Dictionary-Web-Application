const searchBtn = document.getElementById("searchBtn");
const wordInput = document.getElementById("wordInput");
const resultDiv = document.getElementById("result");

// Search on button click
searchBtn.addEventListener("click", searchWord);

// Search on Enter key
wordInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        searchWord();
    }
});

function searchWord() {
    const word = wordInput.value.trim();

    // Empty input handling
    if (word === "") {
        alert("Please enter a word");
        return;
    }

    resultDiv.innerHTML = "<p>Loading...</p>";

    // API call
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Word not found");
            }
            return response.json();
        })
        .then(data => displayResult(data))
        .catch(() => {
            resultDiv.innerHTML =
                "<p>❌ Word not found. Please try another word.</p>";
        });
}

function displayResult(data) {
    const wordData = data[0];
    const meaningData = wordData.meanings[0];
    const definitionData = meaningData.definitions[0];

    const meaning = definitionData.definition;
    const example = definitionData.example || "Example not available";
    const partOfSpeech = meaningData.partOfSpeech;
    const phonetic = wordData.phonetic || "Not available";

    // Audio pronunciation (if available)
    let audio = "";
    if (wordData.phonetics.length > 0) {
        const audioObj = wordData.phonetics.find(p => p.audio);
        if (audioObj) {
            audio = `<audio controls src="${audioObj.audio}"></audio>`;
        }
    }

    resultDiv.innerHTML = `
        <h2>${wordData.word}</h2>
        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>
        <p><strong>Meaning:</strong> ${meaning}</p>
        <p><strong>Example:</strong> ${example}</p>
        <p><strong>Phonetic:</strong> ${phonetic}</p>
        ${audio}
    `;
}
