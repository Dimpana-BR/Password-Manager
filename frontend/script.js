let editingId = null;
const API_URL = "http://password-manager-avd8.onrender.com";

// Load data on start
document.addEventListener('DOMContentLoaded', loadPasswords);

function generatePass() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
    let pass = Array.from({length: 14}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    document.getElementById("password").value = pass;
    checkStrength(pass);
}

function checkStrength(pass) {
    const meter = document.getElementById("strength-meter");
    let w = pass.length * 10;
    meter.style.width = Math.min(w, 100) + "%";
    meter.style.background = w < 50 ? "#ff7675" : w < 80 ? "#fdcb6e" : "#55efc4";
}

async function loadPasswords() {
    const res = await fetch(`${API_URL}/passwords`);
    const data = await res.json();
    renderPasswords(data);
}

function renderPasswords(data) {
    const container = document.getElementById("password-list");
    container.innerHTML = "";
    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h4><i class="fas fa-link"></i> ${item.website}</h4>
            <p><strong>User:</strong> ${item.username}</p>
            <p><strong>Pass:</strong> <span class="mask">••••••••</span></p>
            <div class="card-btns">
                <button class="copy-btn" onclick="copyText('${item.password}')">Copy</button>
                <button onclick="editItem(${item.id},'${item.website}','${item.username}','${item.password}','${item.notes}')">Edit</button>
                <button class="del-btn" onclick="deleteItem(${item.id})">Delete</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function copyText(text) {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
}

async function addPassword() {
    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const notes = document.getElementById("notes").value;

    const method = editingId ? "PUT" : "POST";
    const path = editingId ? `/update/${editingId}` : "/add";

    await fetch(API_URL + path, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ website, username, password, notes })
    });

    editingId = null;
    document.getElementById("main-btn").innerText = "Save Password";
    loadPasswords();
    ["website", "username", "password", "notes"].forEach(id => document.getElementById(id).value = "");
}

function editItem(id, site, user, pass, note) {
    editingId = id;
    document.getElementById("website").value = site;
    document.getElementById("username").value = user;
    document.getElementById("password").value = pass;
    document.getElementById("notes").value = note;
    document.getElementById("main-btn").innerText = "Update Password";
}

async function deleteItem(id) {
    if(confirm("Delete this entry?")) {
        await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
        loadPasswords();
    }
}

async function searchPasswords() {
    const q = document.getElementById("search").value;
    const res = await fetch(`${API_URL}/search?query=${q}`);
    const data = await res.json();
    renderPasswords(data);
}