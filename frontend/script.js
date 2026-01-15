let editingId = null;

/* ---------------- LOAD ALL ---------------- */
function loadPasswords() {
  fetch("http://127.0.0.1:5000/passwords")
    .then(res => res.json())
    .then(data => renderPasswords(data))
    .catch(err => console.error(err));
}

/* ---------------- ADD / UPDATE ---------------- */
function addPassword() {
  const website = document.getElementById("website").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const notes = document.getElementById("notes").value;

  if (editingId) {
    fetch(`http://127.0.0.1:5000/update/${editingId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ website, username, password, notes })
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        editingId = null;
        loadPasswords();
      });
    return;
  }

  fetch("http://127.0.0.1:5000/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ website, username, password, notes })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      loadPasswords();

      document.getElementById("website").value = "";
      document.getElementById("username").value = "";
      document.getElementById("password").value = "";
      document.getElementById("notes").value = "";
    });
}

/* ---------------- DELETE ---------------- */
function deletePassword(id) {
  if (!confirm("Are you sure?")) return;

  fetch(`http://127.0.0.1:5000/delete/${id}`, { method: "DELETE" })
    .then(res => res.json())
    .then(() => loadPasswords());
}

/* ---------------- COPY ---------------- */
function copyPassword(password) {
  navigator.clipboard.writeText(password)
    .then(() => alert("Password copied"));
}

/* ---------------- SHOW / HIDE ---------------- */
function togglePassword(btn, realPassword) {
  const span = btn.previousElementSibling;

  if (span.textContent === "••••••") {
    span.textContent = realPassword;
    btn.textContent = "Hide";
  } else {
    span.textContent = "••••••";
    btn.textContent = "Show";
  }
}

/* ---------------- SEARCH (FIXED) ---------------- */
function searchPasswords() {
  const query = document.getElementById("search").value.trim();

  // If empty → show full list
  if (query === "") {
    loadPasswords();
    return;
  }

  fetch(`http://127.0.0.1:5000/search?query=${query}`)
    .then(res => res.json())
    .then(data => renderPasswords(data))
    .catch(err => console.error(err));
}

/* ---------------- RENDER ---------------- */
function renderPasswords(data) {
  const container = document.getElementById("password-list");
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No passwords found</p>";
    return;
  }

  data.forEach(item => {
    const div = document.createElement("div");
    div.className = "card";

    div.innerHTML = `
      <p><b>Website:</b> ${item.website}</p>
      <p><b>Username:</b> ${item.username}</p>

      <p>
        <b>Password:</b>
        <span>••••••</span>
        <button onclick="togglePassword(this, '${item.password}')">Show</button>
        <button onclick="copyPassword('${item.password}')">Copy</button>
      </p>

      <p><b>Notes:</b> ${item.notes}</p>

      <button onclick="deletePassword(${item.id})">Delete</button>
      <button onclick="editPassword(${item.id}, '${item.website}', '${item.username}', '${item.password}', '${item.notes}')">Edit</button>
    `;

    container.appendChild(div);
  });
}

/* ---------------- EDIT ---------------- */
function editPassword(id, website, username, password, notes) {
  editingId = id;
  document.getElementById("website").value = website;
  document.getElementById("username").value = username;
  document.getElementById("password").value = password;
  document.getElementById("notes").value = notes;
}
