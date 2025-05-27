async function loadEntries() {
  const response = await fetch('http://localhost:8787/entries');
  const data = await response.json();

  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = '';

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.dataset.id = entry.id;
    row.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.age}</td>
      <td>${entry.gender}</td>
      <td>${new Date(entry.timestamp).toLocaleString()}</td>
      <td>${entry.charges}</td>
      <td>${entry.payment}</td>
      <td><button class="editBtn">Edit</button></td>
    `;
    tableBody.appendChild(row);
  });
  
  document.querySelectorAll('.editBtn').forEach(button => {
    button.addEventListener('click', (e) => {
      const row = e.target.closest('tr');
      document.getElementById('entryId').value = row.dataset.id;
      document.getElementById('name').value = row.children[0].textContent;
      document.getElementById('age').value = row.children[1].textContent;
      document.getElementById('gender').value = row.children[2].textContent;
      document.getElementById('charges').value = row.children[4].textContent;
      document.getElementById('payment').value = row.children[5].textContent;
  
      
      const formContainer = document.getElementById("form-container");
      formContainer.style.display = "block"; // First set display to block
      requestAnimationFrame(() => {
      formContainer.classList.add("show");
      });
    });
  });
  
  
}

document.addEventListener('DOMContentLoaded', loadEntries);


document.getElementById('entryForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('entryId').value;
  const entry = {
    name: document.getElementById('name').value.trim(),
    age: parseInt(document.getElementById('age').value.trim()),
    gender: document.getElementById('gender').value.trim(),
    charges: document.getElementById('charges').value.trim(),
    payment: document.getElementById('payment').value.trim()
  };

  const url = id ? `http://localhost:8787/entries/${id}` : 'http://localhost:8787/entries';
  const method = id ? 'PUT' : 'POST';

  await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });

  e.target.reset();
  document.getElementById('entryId').value = '';
  loadEntries();
  hideForm();
});

window.onclick = function (event) {
  const modal = document.getElementById("form-container");
  if (event.target === modal) {
    hideForm();
  }
};

function hideForm() {
  const formContainer = document.getElementById("form-container");
  formContainer.classList.remove("show");
  setTimeout(() => {
    formContainer.style.display = "none";
  }, 300); // Match transition time
}
