let educationCount = 0;
let experienceCount = 0;
let projectCount = 0;
let certificationCount = 0;
let extraCurricularCount = 0;
let languageCount = 0;
let linkCount = 0;

function addEducationEntry() {
    educationCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'education-' + educationCount;
    entry.innerHTML = `
        <input type="text" placeholder="School/Institution" data-field="school">
        <input type="text" placeholder="Date" data-field="date">
        <input type="text" placeholder="Degree/Board" data-field="degree">
        <input type="text" placeholder="Percentage/CGPA" data-field="percentage">
        <button onclick="removeEntry('education-${educationCount}')">Remove</button>
    `;
    document.getElementById('education-entries').appendChild(entry);
}

function addExperienceEntry() {
    experienceCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'experience-' + experienceCount;
    entry.innerHTML = `
        <input type="text" placeholder="Company" data-field="company">
        <input type="text" placeholder="Dates" data-field="dates">
        <input type="text" placeholder="Role" data-field="role">
        <input type="text" placeholder="Location" data-field="location">
        <textarea placeholder="Bullet points (one per line)" data-field="bullets" rows="3"></textarea>
        <button onclick="removeEntry('experience-${experienceCount}')">Remove</button>
    `;
    document.getElementById('experience-entries').appendChild(entry);
}

function addProjectEntry() {
    projectCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'project-' + projectCount;
    entry.innerHTML = `
        <input type="text" placeholder="Project Name" data-field="name">
        <input type="text" placeholder="Technologies" data-field="tech">
        <input type="text" placeholder="Description" data-field="description">
        <button onclick="removeEntry('project-${projectCount}')">Remove</button>
    `;
    document.getElementById('projects-entries').appendChild(entry);
}

function addCertificationEntry() {
    certificationCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'certification-' + certificationCount;
    entry.innerHTML = `
        <input type="text" placeholder="Certification Name" data-field="name">
        <input type="text" placeholder="Issuer" data-field="issuer">
        <input type="text" placeholder="Link/ID (optional)" data-field="link">
        <button onclick="removeEntry('certification-${certificationCount}')">Remove</button>
    `;
    document.getElementById('certifications-entries').appendChild(entry);
}

function addExtraCurricularEntry() {
    extraCurricularCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'extra-curricular-' + extraCurricularCount;
    entry.innerHTML = `
        <input type="text" placeholder="Activity" data-field="activity">
        <button onclick="removeEntry('extra-curricular-${extraCurricularCount}')">Remove</button>
    `;
    document.getElementById('extra-curricular-entries').appendChild(entry);
}

function addLanguageEntry() {
    languageCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'language-' + languageCount;
    entry.innerHTML = `
        <input type="text" placeholder="Language" data-field="language">
        <input type="text" placeholder="Proficiency" data-field="proficiency">
        <button onclick="removeEntry('language-${languageCount}')">Remove</button>
    `;
    document.getElementById('languages-entries').appendChild(entry);
}

function addLinkEntry() {
    linkCount++;
    const entry = document.createElement('div');
    entry.className = 'entry';
    entry.id = 'link-' + linkCount;
    entry.innerHTML = `
        <input type="text" placeholder="Link Name (e.g., LinkedIn)" data-field="name">
        <input type="text" placeholder="URL" data-field="url">
        <button onclick="removeEntry('link-${linkCount}')">Remove</button>
    `;
    document.getElementById('links-entries').appendChild(entry);
}

function removeEntry(id) {
    const entry = document.getElementById(id);
    entry.remove();
}

function generateResume() {
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;

    let html = `<h1>${name}</h1>
        <p>${email} | ${phone} | ${location}</p>
        <h2>Summary</h2>
        <p>${summary}</p>`;

    // Education
    html += '<h2>Education</h2>';
    const educationEntries = document.querySelectorAll('#education-entries .entry');
    educationEntries.forEach(entry => {
        const school = entry.querySelector('[data-field="school"]').value;
        const date = entry.querySelector('[data-field="date"]').value;
        const degree = entry.querySelector('[data-field="degree"]').value;
        const percentage = entry.querySelector('[data-field="percentage"]').value;
        html += `<p><strong>${school}</strong> - ${date}<br>${degree} · ${percentage}</p>`;
    });

    // Experience
    html += '<h2>Experience</h2>';
    const experienceEntries = document.querySelectorAll('#experience-entries .entry');
    experienceEntries.forEach(entry => {
        const company = entry.querySelector('[data-field="company"]').value;
        const dates = entry.querySelector('[data-field="dates"]').value;
        const role = entry.querySelector('[data-field="role"]').value;
        const location = entry.querySelector('[data-field="location"]').value;
        const bullets = entry.querySelector('[data-field="bullets"]').value.split('\n').filter(b => b.trim());
        html += `<p><strong>${company}</strong><br>${dates}<br>${role}<br>${location}</p><ul>`;
        bullets.forEach(bullet => {
            html += `<li>${bullet}</li>`;
        });
        html += '</ul>';
    });

    // Projects
    html += '<h2>Projects</h2>';
    const projectEntries = document.querySelectorAll('#projects-entries .entry');
    projectEntries.forEach(entry => {
        const name = entry.querySelector('[data-field="name"]').value;
        const tech = entry.querySelector('[data-field="tech"]').value;
        const description = entry.querySelector('[data-field="description"]').value;
        html += `<p><strong>${name}</strong> - ${tech}<br>${description}</p>`;
    });

    // Certifications
    html += '<h2>Certifications</h2><ul>';
    const certificationEntries = document.querySelectorAll('#certifications-entries .entry');
    certificationEntries.forEach(entry => {
        const name = entry.querySelector('[data-field="name"]').value;
        const issuer = entry.querySelector('[data-field="issuer"]').value;
        const link = entry.querySelector('[data-field="link"]').value;
        html += `<li>${name} | Certificate - ${issuer}${link ? ' · ' + link : ''}</li>`;
    });
    html += '</ul>';

    // Extra Curricular
    html += '<h2>Extra Curricular Activities</h2><ul>';
    const extraEntries = document.querySelectorAll('#extra-curricular-entries .entry');
    extraEntries.forEach(entry => {
        const activity = entry.querySelector('[data-field="activity"]').value;
        html += `<li>${activity}</li>`;
    });
    html += '</ul>';

    // Skills
    html += `<h2>Skills</h2><p>${skills}</p>`;

    // Languages
    html += '<h2>Languages</h2><ul>';
    const languageEntries = document.querySelectorAll('#languages-entries .entry');
    languageEntries.forEach(entry => {
        const language = entry.querySelector('[data-field="language"]').value;
        const proficiency = entry.querySelector('[data-field="proficiency"]').value;
        html += `<li>${language} [${proficiency}]</li>`;
    });
    html += '</ul>';

    // Links
    html += '<h2>Links</h2><ul>';
    const linkEntries = document.querySelectorAll('#links-entries .entry');
    linkEntries.forEach(entry => {
        const name = entry.querySelector('[data-field="name"]').value;
        const url = entry.querySelector('[data-field="url"]').value;
        html += `<li>${name}, ${url}</li>`;
    });
    html += '</ul>';

    document.getElementById('resume-preview').innerHTML = html;
}