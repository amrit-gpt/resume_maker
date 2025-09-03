const { jsPDF } = window.jspdf;

document.getElementById("downloadBtn").addEventListener("click", () => {
  const name = document.getElementById("name").value;
  const title = document.getElementById("title").value;
  const email = document.getElementById("email").value;
  const phone = document.getElementById("phone").value;
  const location = document.getElementById("location").value;
  const summary = document.getElementById("About").value;
  const education = document.getElementById("education").value;
  const experience = document.getElementById("experience").value;
  const projects = document.getElementById("projects").value;
  const skills = document.getElementById("skills").value;
  const links = document.getElementById("links").value;

  const doc = new jsPDF();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(name || "Your Name", 20, 20);
  doc.setFontSize(12);
  doc.text(title || "", 20, 30);

  doc.setFont("helvetica", "normal");
  doc.text(`Email: ${email}`, 20, 40);
  doc.text(`Phone: ${phone}`, 20, 48);
  doc.text(`Location: ${location}`, 20, 56);

  let y = 70;
  function addSection(title, content) {
    if (!content) return;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(title, 20, y);
    y += 6;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    const split = doc.splitTextToSize(content, 170);
    doc.text(split, 20, y);
    y += split.length * 6 + 6;
  }

  addSection("About", summary);
  addSection("Education", education);
  addSection("Experience", experience);
  addSection("Projects", projects);
  addSection("Skills", skills);
  addSection("Links", links);

  doc.save((name || "resume") + ".pdf");
});