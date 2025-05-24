async function loadEntries() {
  const response = await fetch('http://localhost:8787/entries');
  const data = await response.json();

  const tableBody = document.querySelector('#dataTable tbody');
  tableBody.innerHTML = '';

  data.forEach(entry => {
    const row = document.createElement('tr');
    row.setAttribute('data-id', entry.id);
    row.innerHTML = `
      <td contenteditable="true">${entry.name}</td>
      <td contenteditable="true">${entry.age}</td>
      <td contenteditable="true">${entry.gender}</td>
      <td>${new Date(entry.timestamp).toLocaleString()}</td>
      <td contenteditable="true">${entry.charges}</td>
      <td contenteditable="true">${entry.payment}</td>
    `;
    tableBody.appendChild(row);
  });
}

document.addEventListener('DOMContentLoaded', loadEntries);

document.getElementById('updateAllBtn').addEventListener('click', async () => {
  const rows = document.querySelectorAll('#dataTable tbody tr');

  for (let row of rows) {
    const cells = row.querySelectorAll('td');

    if (cells.length < 6) {
      console.error('Row has missing cells:', row);
      continue;
    }

    const updatedEntry = {
      id: row.dataset.id,
      name: cells[0].textContent.trim(),
      age: parseInt(cells[1].textContent.trim()),
      gender: cells[2].textContent.trim(),
      charges: cells[4].textContent.trim(),
      payment: cells[5].textContent.trim()
    };

    await fetch(`http://localhost:8787/entries/${updatedEntry.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEntry)
    });
  }

  alert('Changes updated!');
  loadEntries(); 
});

