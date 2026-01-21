let editingId = null;
const API_URL = "http://password-manager-avd8.onrender.com";

/* ---------------- NEW: PASSWORD GENERATOR ---------------- */
function generatePass() {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let pass = "";
    for (let i = 0; i < 16; i++) {
        pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    document.getElementById("password").value = pass;
    checkStrength(pass);
}

/* ---------------- NEW: STRENGTH METER ---------------- */
function checkStrength(pass) {
    const meter = document.getElementById("strength-meter");
    if (pass.length === 0) meter.style.width = "0";
    else if (pass.length < 6) { meter.style.width = "30%"; meter.style.background = "red"; }
    else if (pass.length < 10) { meter.style.width = "60%"; meter.style.background = "orange"; }
    else { meter.style.width = "100%"; meter.style.background = "#00e676"; }
}

/* ---------------- LOAD & RENDER ---------------- */
async function loadPasswords() {
    try {
        const res = await fetch(`${API_URL}/passwords`);
        const data = await res.json();
        renderPasswords(data);
    } catch (err) { console.error("Fetch error:", err); }
}

function renderPasswords(data) {
    const container = document.getElementById("password-list");
    container.innerHTML = data.length === 0 ? "<p>No entries found in vault.</p>" : "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";
        div.innerHTML = `
            <h4><i class="fas fa-globe"></i> ${item.website}</h4>
            <p><small>User:</small> ${item.username}</p>
            <div class="password-field">
                <span class="pass-mask">••••••••</span>
                <button class="btn-small" onclick="togglePass(this, '${item.password}')">Show</button>
            </div>
            <div class="card-actions">
                <button class="btn-small copy-btn" onclick="copyPassword('${item.password}')"><i class="fas fa-copy"></i></button>
                <button class="btn-small edit-btn" onclick="editPassword(${item.id}, '${item.website}', '${item.username}', '${item.password}', '${item.notes}')"><i class="fas fa-edit"></i></button>
                <button class="btn-small delete-btn" onclick="deletePassword(${item.id})"><i class="fas fa-trash"></i></button>
            </div>
        `;
        container.appendChild(div);
    });
}

/* ---------------- ADD / UPDATE (MODIFIED) ---------------- */
async function addPassword() {
    const payload = {
        website: document.getElementById("website").value,
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        notes: document.getElementById("notes").value
    };

    const endpoint = editingId ? `${API_URL}/update/${editingId}` : `${API_URL}/add`;
    const method = editingId ? "PUT" : "POST";

    const res = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    alert(data.message);
    
    // Reset form
    editingId = null;
    document.getElementById("main-btn").innerText = "Add Password";
    ["website", "username", "password", "notes"].forEach(id => document.getElementById(id).value = "");
    loadPasswords();
}

/* ---------------- HELPERS ---------------- */
function togglePass(btn, realPass) {
    const span = btn.previousElementSibling;
    if (span.innerText === "••••••••") {
        span.innerText = realPass;
        btn.innerText = "Hide";
    } else {
        span.innerText = "••••••••";
        btn.innerText = "Show";
    }
}

function copyPassword(pass) {
    navigator.clipboard.writeText(pass);
    // Simple toast notification replacement
    const btn = event.currentTarget;
    const original = btn.innerHTML;
    btn.innerHTML = "<i class='fas fa-check'></i>";
    setTimeout(() => btn.innerHTML = original, 2000);
}

function editPassword(id, website, username, password, notes) {
    editingId = id;
    document.getElementById("website").value = website;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("notes").value = notes;
    document.getElementById("main-btn").innerText = "Update Entry";
    window.scrollTo({top: 0, behavior: 'smooth'});
}

async function deletePassword(id) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`${API_URL}/delete/${id}`, { method: "DELETE" });
    loadPasswords();
}

async function searchPasswords() {
    const query = document.getElementById("search").value;
    if (!query) return loadPasswords();
    const res = await fetch(`${API_URL}/search?query=${query}`);
    const data = await res.json();
    renderPasswords(data);
}

// Initial Load
loadPasswords();