// Update preview live
function updatePreview() {
  document.getElementById("prev-name").innerText = document.getElementById("name").value || "Your Name";
  document.getElementById("prev-email").innerText = document.getElementById("email").value || "your@email.com";
  document.getElementById("prev-phone").innerText = document.getElementById("phone").value || "+91-0000000000";
  document.getElementById("prev-edu").innerText = document.getElementById("education").value;
  document.getElementById("prev-work").innerText = document.getElementById("work").value;
  document.getElementById("prev-projects").innerText = document.getElementById("projects").value;
}

// Attach live update
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Save form data to localStorage
function saveData() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    education: document.getElementById("education").value,
    work: document.getElementById("work").value,
    projects: document.getElementById("projects").value,
  };
  localStorage.setItem("resumeData", JSON.stringify(data));
  alert("Data saved!");
}

// Load form data from localStorage
function loadData() {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (data) {
    document.getElementById("name").value = data.name;
    document.getElementById("email").value = data.email;
    document.getElementById("phone").value = data.phone;
    document.getElementById("education").value = data.education;
    document.getElementById("work").value = data.work;
    document.getElementById("projects").value = data.projects;
    updatePreview();
  } else {
    alert("No saved data found.");
  }
}

// Generate PDF
function generatePDF() {
  window.print(); // Simple way (prints resume preview)
}