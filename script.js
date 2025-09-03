function generatePDF() {
  // Get the hidden container element from the HTML
  const resumeContainer = document.getElementById('pdf-content');
  resumeContainer.innerHTML = ''; // Clear previous content to avoid duplicates

  // Helper functions
  function createDiv(text) {
    const div = document.createElement('div');
    div.textContent = text.trim();
    div.style.marginBottom = '6px';
    return div;
  }

  function createLi(text) {
    const li = document.createElement('li');
    li.textContent = text.trim();
    return li;
  }

  function appendSection(title, lines) {
    const filteredLines = lines.filter(line => line.trim() !== '');
    if (filteredLines.length === 0) return;
    
    const h2 = document.createElement('h2');
    h2.textContent = title;
    h2.style.borderBottom = '1px solid #333';
    h2.style.marginTop = '15px';
    h2.style.marginBottom = '8px';
    resumeContainer.appendChild(h2);

    const contentDiv = document.createElement('div');
    
    filteredLines.forEach(line => {
      if (line.trim().startsWith('-')) {
        const ul = document.createElement('ul');
        const cleanedLine = line.trim().replace(/^-/, '').trim();
        if (cleanedLine) {
            ul.appendChild(createLi(cleanedLine));
            contentDiv.appendChild(ul);
        }
      } else {
        contentDiv.appendChild(createDiv(line));
      }
    });
    resumeContainer.appendChild(contentDiv);
  }

  // Personal Information
  const personalInfo = document.createElement('div');
  personalInfo.innerHTML = `
    <h1 style="font-size: 24px; margin-bottom: 5px;">${document.getElementById('name').value}</h1>
    <p style="margin: 0; font-size: 14px; color: #555;">${document.getElementById('email').value} | ${document.getElementById('phone').value} | ${document.getElementById('location').value}</p>
    <p style="margin: 0; font-size: 14px; color: #555;">
      <a href="${document.getElementById('linkedin').value}" style="color: #0077B5;">LinkedIn</a> |
      <a href="${document.getElementById('github').value}" style="color: #333;">GitHub</a> |
      <a href="${document.getElementById('portfolio').value}" style="color: #333;">Portfolio</a>
    </p>
  `;
  resumeContainer.appendChild(personalInfo);

  // Collect data and append sections
  appendSection('Summary', [document.getElementById('summary').value]);
  appendSection('Skills', document.getElementById('skills').value.split(','));
  appendSection('Languages', document.getElementById('languages').value.split(','));
  appendSection('Education', document.getElementById('education').value.split('\n'));
  appendSection('Experience', document.getElementById('experience').value.split('\n'));
  appendSection('Projects', document.getElementById('projects').value.split('\n'));
  appendSection('Certifications', document.getElementById('certifications').value.split('\n'));
  
  // Generate PDF from the targeted container
  html2pdf().set({
    margin: 10,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#ffffff" },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(resumeContainer).save();
}