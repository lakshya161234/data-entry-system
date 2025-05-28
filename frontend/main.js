document.getElementById('entryForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const age = parseInt(document.getElementById('age').value);
  const gender = document.getElementById('gender').value;
  const charges = document.getElementById('charges').value;
  const payment = document.getElementById('payment').value;

  const entry = { name, age, gender, charges, payment };

  try {
    const response = await fetch('data-entry-system.lakshyaupreti16.workers.dev/entries', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry)
    });

    const result = await response.json();

    if (response.ok) {
      document.getElementById('entryForm').reset();
      const formContainer = document.getElementById("form-container");
      hideForm();
      loadEntries();
    } else {
      alert('Error: ' + result.error);
    }
  } catch (error) {
    alert('Could not connect to server. Is it running?');
    console.error(error);
  }
});


document.getElementById("form-btn").onclick = function () {
  const formContainer = document.getElementById("form-container");
      formContainer.style.display = "block";
      requestAnimationFrame(() => {
      formContainer.classList.add("show");
      });
};


window.onclick = function (event) {
  const modal = document.getElementById("form-container");
  if (event.target === modal) {
    hideForm();
  }
};

async function loadEntries() {
  try {
    const response = await fetch('data-entry-system.lakshyaupreti16.workers.dev/entries');
    const data = await response.json();

    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = ''; 

    data.forEach(entry => {
      //const localTime= entry.timestamp.toLocaleString();
      //console.log(localTime);
      const iso = entry.timestamp;
      const localTime = new Date(iso).toLocaleString();
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${entry.name}</td>
        <td>${entry.age}</td>
        <td>${entry.gender}</td>
        <td>${localTime}</td>
        <td>${entry.charges}</td>
        <td>${entry.payment}</td>
      `;
      tableBody.appendChild(row);
    });
  } catch (err) {
    console.error('Error loading entries:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadEntries);

function hideForm() {
  const formContainer = document.getElementById("form-container");
  formContainer.classList.remove("show");
  setTimeout(() => {
    formContainer.style.display = "none";
  }, 300); // Match transition time
}
