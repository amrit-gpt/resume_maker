// Update preview dynamically
document.querySelectorAll("input, textarea").forEach(el => {
  el.addEventListener("input", updatePreview);
});

function updatePreview() {
  // Personal Info
  document.getElementById("p-name").innerText = document.getElementById("name").value;
  document.getElementById("p-email").innerText = document.getElementById("email").value;
  document.getElementById("p-phone").innerText = document.getElementById("phone").value;
  document.getElementById("p-location").innerText = document.getElementById("location").value;
  document.getElementById("p-linkedin").innerText = document.getElementById("linkedin").value;
  document.getElementById("p-github").innerText = document.getElementById("github").value;
  document.getElementById("p-portfolio").innerText = document.getElementById("portfolio").value;

  // Summary
  document.getElementById("p-summary").innerText = document.getElementById("summary").value;

  // Skills
  const skillsVal = document.getElementById("skills").value.split(",");
  const skillsList = document.getElementById("p-skills");
  skillsList.innerHTML = "";
  skillsVal.forEach(s => { if (s.trim() !== "") skillsList.appendChild(createLi(s)); });

  // Languages
  const langsVal = document.getElementById("languages").value.split(",");
  const langsList = document.getElementById("p-langs");
  langsList.innerHTML = "";
  langsVal.forEach(l => { if (l.trim() !== "") langsList.appendChild(createLi(l)); });

  // Certifications
  const certsVal = document.getElementById("certifications").value.split("\n");
  const certsList = document.getElementById("p-certs");
  certsList.innerHTML = "";
  certsVal.forEach(c => { if (c.trim() !== "") certsList.appendChild(createLi(c)); });

  // Education
  const eduVal = document.getElementById("education").value.split("\n");
  const eduDiv = document.getElementById("p-education");
  eduDiv.innerHTML = "";
  eduVal.forEach(e => { if (e.trim() !== "") eduDiv.appendChild(createDiv(e)); });

  // Experience
  const expVal = document.getElementById("experience").value.split("\n");
  const expDiv = document.getElementById("p-experience");
  expDiv.innerHTML = "";
  expVal.forEach(x => { if (x.trim() !== "") expDiv.appendChild(createDiv(x)); });

  // Projects
  const projVal = document.getElementById("projects").value.split("\n");
  const projDiv = document.getElementById("p-projects");
  projDiv.innerHTML = "";
  projVal.forEach(p => { if (p.trim() !== "") projDiv.appendChild(createDiv(p)); });
}

function createLi(text){
  const li = document.createElement("li");
  li.innerText = text.trim();
  return li;
}

function createDiv(text){
  const div = document.createElement("div");
  div.innerText = text.trim();
  return div;
}

// Export PDF
function generatePDF() {
  const element = document.getElementById("resume-preview");
  const opt = {
    margin: 0,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };
  html2pdf().set(opt).from(element).save();
}