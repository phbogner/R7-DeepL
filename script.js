const DEEPL_API_KEY = "2f537ba7-215a-42be-8dea-3e1106021bbb"; // Hier den API-Schlüssel einfügen
const API_URL_TEXT = "https://api.deepl.com/v2/translate";
const API_URL_DOC = "https://api.deepl.com/v2/document";

// 🔹 TEXTÜBERSETZUNG
async function translateText() {
    let text = document.getElementById("text").value;
    let targetLang = document.getElementById("target-lang").value;

    let response = await fetch(API_URL_TEXT, {
        method: "POST",
        headers: {
            "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
            "text": text,
            "target_lang": targetLang
        })
    });

    let data = await response.json();
    document.getElementById("translated-text").innerText = data.translations[0].text;
}

// 🔹 DOKUMENTÜBERSETZUNG
async function translateDocument() {
    let fileInput = document.getElementById("file");
    let targetLang = document.getElementById("target-lang").value;
    
    if (fileInput.files.length === 0) {
        alert("Bitte eine Datei hochladen!");
        return;
    }

    let file = fileInput.files[0];
    let formData = new FormData();
    formData.append("auth_key", DEEPL_API_KEY);
    formData.append("file", file);
    formData.append("target_lang", targetLang);

    let response = await fetch(API_URL_DOC, {
        method: "POST",
        body: formData
    });

    let data = await response.json();
    
    if (data.document_id) {
        document.getElementById("file-response").innerText = "Übersetzung gestartet. Dokument-ID: " + data.document_id;
    } else {
        document.getElementById("file-response").innerText = "Fehler bei der Übersetzung.";
    }
}
