const eventDate = new Date("2026-12-20T10:00:00+05:30");
const maxSeats = 24;

const form = document.querySelector("#registrationForm");
const gamertag = document.querySelector("#gamertag");
const email = document.querySelector("#email");
const college = document.querySelector("#college");
const role = document.querySelector("#role");
const teamSize = document.querySelector("#teamSize");
const experience = document.querySelector("#experience");
const rules = document.querySelector("#rules");
const registrationList = document.querySelector("#registrationList");
const clearList = document.querySelector("#clearList");
const toast = document.querySelector("#toast");

const previewName = document.querySelector("#previewName");
const previewRole = document.querySelector("#previewRole");
const previewColor = document.querySelector("#previewColor");
const previewTeam = document.querySelector("#previewTeam");
const previewSkill = document.querySelector("#previewSkill");
const avatar = document.querySelector("#avatar");
const seatsLeft = document.querySelector("#seatsLeft");
const experienceValue = document.querySelector("#experienceValue");

let registrations = JSON.parse(localStorage.getItem("amongUsRegistrations")) || [];

updateCountdown();
setInterval(updateCountdown, 1000);
updatePreview();
renderRegistrations();

form.addEventListener("input", updatePreview);
form.addEventListener("change", updatePreview);

form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    if (registrations.length >= maxSeats) {
        showToast("Registration is full. No seats left.", true);
        return;
    }

    const selectedColor = getSelectedColor();
    const registration = {
        name: gamertag.value.trim(),
        email: email.value.trim(),
        college: college.value.trim(),
        role: role.value,
        team: teamSize.options[teamSize.selectedIndex].text,
        color: selectedColor.name,
        colorCode: selectedColor.code,
        skill: experience.value,
        ticket: `AUE-${Date.now().toString().slice(-6)}`
    };

    registrations.unshift(registration);
    registrations = registrations.slice(0, maxSeats);
    saveRegistrations();
    renderRegistrations();
    showToast(`Registered! Ticket ID: ${registration.ticket}`);
    form.reset();
    updatePreview();
});

clearList.addEventListener("click", () => {
    registrations = [];
    saveRegistrations();
    renderRegistrations();
    showToast("Registration list cleared.");
});

function validateForm() {
    let isValid = true;

    isValid = setError("nameError", gamertag.value.trim().length < 3, "Gamertag must be at least 3 characters.") && isValid;
    isValid = setError("emailError", !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim()), "Enter a valid email address.") && isValid;
    isValid = setError("collegeError", college.value.trim().length < 2, "Enter your college or department.") && isValid;
    isValid = setError("rulesError", !rules.checked, "Please accept the event rules.") && isValid;

    return isValid;
}

function setError(id, hasError, message) {
    const element = document.querySelector(`#${id}`);
    element.textContent = hasError ? message : "";
    return !hasError;
}

function updatePreview() {
    const selectedColor = getSelectedColor();
    const name = gamertag.value.trim() || "Your gamertag";
    const teamText = teamSize.options[teamSize.selectedIndex]?.text || "Solo";

    previewName.textContent = name;
    previewRole.textContent = role.value;
    previewColor.textContent = selectedColor.name;
    previewTeam.textContent = teamText;
    previewSkill.textContent = `${experience.value}/10`;
    experienceValue.textContent = `${experience.value}/10`;
    avatar.textContent = name === "Your gamertag" ? "?" : name.charAt(0).toUpperCase();
    avatar.style.background = selectedColor.code;
}

function getSelectedColor() {
    const input = document.querySelector("input[name='color']:checked");
    return {
        name: input.value,
        code: input.dataset.color
    };
}

function renderRegistrations() {
    registrationList.innerHTML = "";
    seatsLeft.textContent = Math.max(maxSeats - registrations.length, 0);

    if (registrations.length === 0) {
        const item = document.createElement("li");
        item.innerHTML = "<strong>No players yet</strong><span>Be the first crewmate to join.</span>";
        registrationList.appendChild(item);
        return;
    }

    registrations.forEach((registration) => {
        const item = document.createElement("li");
        item.style.borderLeft = `5px solid ${registration.colorCode}`;
        item.innerHTML = `
            <strong>${registration.name}</strong>
            <span>${registration.role} · ${registration.team} · Ticket ${registration.ticket}</span>
        `;
        registrationList.appendChild(item);
    });
}

function saveRegistrations() {
    localStorage.setItem("amongUsRegistrations", JSON.stringify(registrations));
}

function updateCountdown() {
    const diff = Math.max(eventDate - new Date(), 0);
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff / 3600000) % 24);
    const minutes = Math.floor((diff / 60000) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    document.querySelector("#days").textContent = String(days).padStart(2, "0");
    document.querySelector("#hours").textContent = String(hours).padStart(2, "0");
    document.querySelector("#minutes").textContent = String(minutes).padStart(2, "0");
    document.querySelector("#seconds").textContent = String(seconds).padStart(2, "0");
}

function showToast(message, isError = false) {
    toast.textContent = message;
    toast.style.background = isError ? "#ff4d6d" : "#10b981";
    toast.classList.add("show");

    window.setTimeout(() => {
        toast.classList.remove("show");
    }, 2600);
}