// Save data in browser
function saveData() {
  localStorage.setItem("name", document.getElementById("name").value);
  localStorage.setItem("email", document.getElementById("email").value);
  localStorage.setItem("phone", document.getElementById("phone").value);
  localStorage.setItem("education", document.getElementById("education").value);
  localStorage.setItem("experience", document.getElementById("experience").value);
  localStorage.setItem("projects", document.getElementById("projects").value);
  alert("Data Saved!");
}

// Load data back into form
function loadData() {
  document.getElementById("name").value = localStorage.getItem("name") || "";
  document.getElementById("email").value = localStorage.getItem("email") || "";
  document.getElementById("phone").value = localStorage.getItem("phone") || "";
  document.getElementById("education").value = localStorage.getItem("education") || "";
  document.getElementById("experience").value = localStorage.getItem("experience") || "";
  document.getElementById("projects").value = localStorage.getItem("projects") || "";
  alert("Data Loaded!");
}

// Generate PDF
function generatePDF() {
  const { jsPDF } = window.jspdf;
  let doc = new jsPDF();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let education = document.getElementById("education").value;
  let experience = document.getElementById("experience").value;
  let projects = document.getElementById("projects").value;

  doc.setFontSize(18);
  doc.text(name, 20, 20);

  doc.setFontSize(12);
  doc.text("Email: " + email, 20, 30);
  doc.text("Phone: " + phone, 20, 40);

  doc.text("Education:", 20, 60);
  doc.text(education, 20, 70);

  doc.text("Experience:", 20, 90);
  doc.text(experience, 20, 100);

  doc.text("Projects:", 20, 120);
  doc.text(projects, 20, 130);

  doc.save("resume.pdf");
}
