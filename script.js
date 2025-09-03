function generatePDF() {
  // Create a temporary container
  const resumeContainer = document.createElement('div');
  resumeContainer.style.padding = '20px';
  resumeContainer.style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
  resumeContainer.style.color = '#111';

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
    if (!lines || lines.length === 0) return;
    const h2 = document.createElement('h2');
    h2.textContent = title;
    h2.style.borderBottom = '1px solid #333';
    h2.style.marginTop = '15px';
    h2.style.marginBottom = '8px';
    resumeContainer.appendChild(h2);

    lines.forEach(line => {
      if (line.startsWith('-')) {
        const ul = document.createElement('ul');
        ul.appendChild(createLi(line.replace(/^-/, '').trim()));
        resumeContainer.appendChild(ul);
      } else {
        resumeContainer.appendChild(createDiv(line));
      }
    });
  }

  // Collect data from form
  appendSection('Name', [document.getElementById('name').value]);
  appendSection('Email', [document.getElementById('email').value]);
  appendSection('Phone', [document.getElementById('phone').value]);
  appendSection('Location', [document.getElementById('location').value]);
  appendSection('LinkedIn', [document.getElementById('linkedin').value]);
  appendSection('GitHub', [document.getElementById('github').value]);
  appendSection('Portfolio', [document.getElementById('portfolio').value]);
  appendSection('Summary', [document.getElementById('summary').value]);

  appendSection('Skills', document.getElementById('skills').value.split(','));
  appendSection('Languages', document.getElementById('languages').value.split(','));
  appendSection('Certifications', document.getElementById('certifications').value.split('\n'));
  appendSection('Education', document.getElementById('education').value.split('\n'));
  appendSection('Experience', document.getElementById('experience').value.split('\n'));
  appendSection('Projects', document.getElementById('projects').value.split('\n'));

  // Generate PDF from the temporary container
  html2pdf().set({
    margin: 10,
    filename: 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, backgroundColor: "#ffffff" },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  }).from(resumeContainer).save();
}