const DEEPL_API_KEY = "DEIN_API_KEY"; // Hier den API-Schlüssel einfügen
const API_URL_TEXT = "https://api.deepl.com/v2/translate";
const API_URL_DOC = "https://api.deepl.com/v2/document";
const API_URL_DOC_STATUS = "https://api.deepl.com/v2/document/{document_id}";

// 🔹 TEXTÜBERSETZUNG FIX
async function translateText() {
    let text = document.getElementById("text").value;
    let targetLang = document.getElementById("target-lang").value;

    if (!text) {
        alert("Bitte einen Text eingeben!");
        return;
    }

    try {
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
        if (data.translations && data.translations.length > 0) {
            document.getElementById("translated-text").innerText = data.translations[0].text;
        } else {
            document.getElementById("translated-text").innerText = "Fehler: Keine Übersetzung erhalten.";
        }
    } catch (error) {
        console.error("Fehler bei der Übersetzung:", error);
        document.getElementById("translated-text").innerText = "Übersetzung fehlgeschlagen.";
    }
}

// 🔹 DOKUMENTÜBERSETZUNG MIT STATUSABFRAGE
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

    try {
        let response = await fetch(API_URL_DOC, {
            method: "POST",
            body: formData
        });

        let data = await response.json();
        
        if (data.document_id && data.document_key) {
            document.getElementById("file-response").innerText = "Übersetzung gestartet... Bitte warten.";
            checkDocumentStatus(data.document_id, data.document_key);
        } else {
            document.getElementById("file-response").innerText = "Fehler beim Hochladen des Dokuments.";
        }
    } catch (error) {
        console.error("Fehler bei der Dokumentübersetzung:", error);
        document.getElementById("file-response").innerText = "Übersetzung fehlgeschlagen.";
    }
}

// 🔹 STATUSABFRAGE UND DOWNLOAD DES DOKUMENTS
async function checkDocumentStatus(documentId, documentKey) {
    let statusUrl = API_URL_DOC_STATUS.replace("{document_id}", documentId);
    
    try {
        let response = await fetch(statusUrl, {
            method: "POST",
            headers: {
                "Authorization": `DeepL-Auth-Key ${DEEPL_API_KEY}`,
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: new URLSearchParams({
                "document_key": documentKey
            })
        });

        let data = await response.json();

        if (data.status === "done") {
            let downloadUrl = `https://api-free.deepl.com/v2/document/${documentId}/result`;
            document.getElementById("file-response").innerHTML = `<a href="${downloadUrl}" target="_blank">📥 Übersetztes Dokument herunterladen</a>`;
        } else if (data.status === "translating") {
            setTimeout(() => checkDocumentStatus(documentId, documentKey), 5000);
        } else {
            document.getElementById("file-response").innerText = "Fehler bei der Übersetzung.";
        }
    } catch (error) {
        console.error("Fehler bei der Statusabfrage:", error);
        document.getElementById("file-response").innerText = "Fehler beim Abrufen des Übersetzungsstatus.";
    }
}
