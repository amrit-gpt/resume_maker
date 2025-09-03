// Live preview for quick check
function updatePreview() {
  document.getElementById("prev-name").innerText = document.getElementById("name").value || "Your Name";
  document.getElementById("prev-email").innerText = document.getElementById("email").value || "your@email.com";
  document.getElementById("prev-phone").innerText = document.getElementById("phone").value || "+91-0000000000";
  document.getElementById("prev-edu").innerText = document.getElementById("education").value;
  document.getElementById("prev-work").innerText = document.getElementById("work").value;
  document.getElementById("prev-projects").innerText = document.getElementById("projects").value;
}

// Attach preview updates
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("dark");
}

// Save form data
function saveData() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    education: document.getElementById("education").value,
    work: document.getElementById("work").value,
    projects: document.getElementById("projects").value,
    summary: document.getElementById("summary").value,
    certifications: document.getElementById("certifications").value,
    skills: document.getElementById("skills").value,
    languages: document.getElementById("languages").value,
    links: document.getElementById("links").value,
  };
  localStorage.setItem("resumeData", JSON.stringify(data));
  alert("Data saved!");
}

// Load form data
function loadData() {
  const data = JSON.parse(localStorage.getItem("resumeData"));
  if (data) {
    document.getElementById("name").value = data.name || "";
    document.getElementById("email").value = data.email || "";
    document.getElementById("phone").value = data.phone || "";
    document.getElementById("education").value = data.education || "";
    document.getElementById("work").value = data.work || "";
    document.getElementById("projects").value = data.projects || "";
    document.getElementById("summary").value = data.summary || "";
    document.getElementById("certifications").value = data.certifications || "";
    document.getElementById("skills").value = data.skills || "";
    document.getElementById("languages").value = data.languages || "";
    document.getElementById("links").value = data.links || "";
    updatePreview();
  } else {
    alert("No saved data found.");
  }
}

// Generate PDF using hidden template
function generatePDF() {
  // Copy values to export template
  document.getElementById("r-name").innerText = document.getElementById("name").value || "Your Name";
  document.getElementById("r-contact").innerText =
    (document.getElementById("email").value || "email") + " | " +
    (document.getElementById("phone").value || "phone");
  document.getElementById("r-summary").innerText = document.getElementById("summary").value || "";

  // Helper for textarea-to-list
  function fillList(textareaId, listId) {
    const val = document.getElementById(textareaId).value.trim();
    const ul = document.getElementById(listId);
    ul.innerHTML = "";
    if (val) {
      val.split("\n").forEach(line => {
        if (line.trim() !== "") {
          const li = document.createElement("li");
          li.innerText = line.trim();
          ul.appendChild(li);
        }
      });
    }
  }

  fillList("education", "r-edu");
  fillList("work", "r-exp");
  fillList("projects", "r-projects");
  fillList("certifications", "r-certs");

  // Skills, Languages, Links (comma separated lists)
  function fillCommaList(inputId, targetId) {
    const val = document.getElementById(inputId).value.trim();
    const target = document.getElementById(targetId);
    target.innerHTML = "";
    if (val) {
      val.split(",").forEach(item => {
        const span = document.createElement("span");
        span.innerText = item.trim();
        target.appendChild(span);
        target.appendChild(document.createTextNode(" "));
      });
    }
  }

  fillCommaList("skills", "r-skills");
  fillCommaList("languages", "r-langs");
  fillCommaList("links", "r-links");

  // Export only the resume template
  const element = document.getElementById("resume-template");
  element.style.display = "block";
  const opt = {
    margin: 0,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save().then(() => {
    element.style.display = "none";
  });
}