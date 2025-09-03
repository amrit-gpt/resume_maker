const { jsPDF } = window.jspdf;

// Containers
const eduList = document.getElementById("educationList");
const expList = document.getElementById("experienceList");
const projList = document.getElementById("projectsList");

// Field creators
function addEdu() {
  const div = document.createElement("div");
  div.innerHTML = `<input placeholder="Degree, Institute, Duration" class="edu" />`;
  eduList.appendChild(div);
}
function addExp() {
  const div = document.createElement("div");
  div.innerHTML = `<input placeholder="Role, Company, Duration" class="exp" />`;
  expList.appendChild(div);
}
function addProj() {
  const div = document.createElement("div");
  div.innerHTML = `<input placeholder="Project, Tech, Description" class="proj" />`;
  projList.appendChild(div);
}

// Buttons
document.getElementById("addEdu").onclick = () => addEdu();
document.getElementById("addExp").onclick = () => addExp();
document.getElementById("addProj").onclick = () => addProj();

// Default one field each
addEdu();
addExp();
addProj();

// PDF Section helper
function addSection(doc, title, items, y) {
  if (!items || items.length === 0) return y;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(title, 20, y);
  y += 6;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  items.forEach(i => {
    const split = doc.splitTextToSize(i, 170);
    doc.text(split, 25, y);
    y += split.length * 6 + 2;
  });
  y += 4;
  return y;
}

// Download PDF
document.getElementById("downloadBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value || "Your Name";
  const title = document.getElementById("title").value || "";
  const email = document.getElementById("email").value || "";
  const phone = document.getElementById("phone").value || "";
  const location = document.getElementById("location").value || "";
  const about = document.getElementById("about").value || "";

  const educations = [...document.querySelectorAll(".edu")].map(e => e.value).filter(Boolean);
  const experiences = [...document.querySelectorAll(".exp")].map(e => e.value).filter(Boolean);
  const projects = [...document.querySelectorAll(".proj")].map(e => e.value).filter(Boolean);

  const skills = document.getElementById("skills").value || "";
  const links = document.getElementById("links").value || "";

  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(name, 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(title, 20, y);
  y += 10;
  doc.text(`${email} | ${phone} | ${location}`, 20, y);
  y += 14;

  // Sections
  y = addSection(doc, "Education", educations, y);
  y = addSection(doc, "Experience", experiences, y);
  y = addSection(doc, "Projects", projects, y);

  if (skills) y = addSection(doc, "Skills", [skills], y);
  if (links) y = addSection(doc, "Links", [links], y);
  if (about) y = addSection(doc, "About", [about], y);

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text("AMRITANSHU ADITYA 2025", 105, 285, { align: "center" });

  doc.save((name || "resume") + ".pdf");
});