document.getElementById('uploadForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const fileInput = document.getElementById('fileInput');
  const languageSelect = document.getElementById('languageSelect');
  const messageDiv = document.getElementById('message');

  const file = fileInput.files[0];
  const targetLang = languageSelect.value;

  if (!file) {
    messageDiv.textContent = 'Bitte wähle eine Datei aus.';
    messageDiv.style.color = 'red';
    return;
  }

  messageDiv.textContent = 'Übersetzung wird durchgeführt...';
  messageDiv.style.color = 'black';

  const formData = new FormData();
  formData.append('file', file);
  formData.append('targetLang', targetLang);

  fetch('http://localhost:3000/translate', {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    messageDiv.textContent = 'Übersetzung erfolgreich!';
    messageDiv.style.color = 'green';
  })
  .catch(error => {
    messageDiv.textContent = 'Fehler bei der Übersetzung: ' + error.message;
    messageDiv.style.color = 'red';
  });
});
