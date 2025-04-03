const express = require('express');
const axios = require('axios');
const formData = require('form-data');
const cors = require('cors');  // CORS-Modul importieren

const app = express();
const port = 3000;

// CORS aktivieren
app.use(cors());  // Hiermit erlauben wir alle Ursprünge (Origins), auf den Server zuzugreifen.

// DeepL API-Konfiguration
const DEEPL_API_URL = 'https://api.deepl.com/v2/document'; // für den kostenlosen Plan
const API_KEY = '2f537ba7-215a-42be-8dea-3e1106021bbb'; // Ersetze mit deinem API-Schlüssel

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/translate', async (req, res) => {
  try {
    const { file, targetLang } = req.body;

    // FormData für die Datei und die API-Anfrage erstellen
    const form = new formData();
    form.append('file', file);
    form.append('target_lang', targetLang);
    form.append('auth_key', API_KEY);

    // Anfrage an DeepL weiterleiten
    const response = await axios.post(DEEPL_API_URL, form, {
      headers: form.getHeaders(),
    });

    // Überprüfe, ob die Antwort im richtigen Format vorliegt
    if (response.headers['content-type'] && response.headers['content-type'].includes('application/json')) {
      console.log('Antwort von DeepL:', response.data);
      res.json(response.data);
    } else {
      console.error('Erwartetes JSON, aber erhalten: ', response.data);
      res.status(500).send('Fehler: Ungültiges Format von DeepL erhalten');
    }
  } catch (error) {
    console.error('Fehler bei der Übersetzung:', error);
    res.status(500).send('Fehler bei der Übersetzung');
  }
});


// Server starten
app.listen(port, () => {
  console.log(`Server läuft auf http://localhost:${port}`);
});