document.getElementById('generate-pdf-btn').addEventListener('click', () => {
    const content = document.createElement('div');
    content.id = 'pdf-content';
    document.body.appendChild(content);

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const location = document.getElementById('location').value;
    const linkedin = document.getElementById('linkedin').value;
    const github = document.getElementById('github').value;
    const portfolio = document.getElementById('portfolio').value;
    const summary = document.getElementById('summary').value;
    const skills = document.getElementById('skills').value;
    const languages = document.getElementById('languages').value;
    const education = document.getElementById('education').value;
    const workExperience = document.getElementById('work-experience').value;
    const projects = document.getElementById('projects').value;
    const certifications = document.getElementById('certifications').value;

    const generateSection = (title, contentLines, parseItems = true, formatAsList = false) => {
        if (!contentLines) return '';
        let html = `<h2>${title}</h2>`;
        const items = contentLines.split('\n').filter(line => line.trim() !== '');
        
        if (parseItems) {
            items.forEach(item => {
                const parts = item.split('|').map(part => part.trim());
                if (parts.length > 0) {
                    html += `<div class="section-item">`;
                    
                    if (title === 'Personal Information') {
                        html += `<b>${parts[0]}</b>`;
                    } else if (title === 'Summary' || title === 'Skills' || title === 'Languages') {
                        html += `<p>${item}</p>`;
                    } else if (title === 'Work Experience') {
                        const role = parts[0];
                        const company = parts[1];
                        const period = parts[2];
                        html += `<div><span class="title">${role}</span> <span class="subtitle">@ ${company}</span><span class="period">${period}</span></div>`;
                        let bulletPoints = items.slice(items.indexOf(item) + 1).filter(line => line.startsWith('-'));
                        
                        if (bulletPoints.length > 0) {
                            html += `<ul>`;
                            for (let i = 0; i < bulletPoints.length; i++) {
                                if (items.indexOf(bulletPoints[i]) > items.indexOf(item) && !items.slice(items.indexOf(bulletPoints[i]) + 1).some(line => !line.startsWith('-'))) {
                                    html += `<li>${bulletPoints[i].substring(1).trim()}</li>`;
                                }
                            }
                            html += `</ul>`;
                        }
                    } else if (title === 'Projects') {
                        const [projTitle, period, description] = parts;
                        html += `<div><span class="title">${projTitle}</span> <span class="period">${period}</span></div>`;
                        html += `<p>${description}</p>`;
                    } else if (title === 'Certifications') {
                        const [certTitle, authority, year] = parts;
                        html += `<div><span class="title">${certTitle}</span> <span class="subtitle">by ${authority}</span> <span class="period">${year}</span></div>`;
                    } else if (title === 'Education') {
                        const [degree, institution, period] = parts;
                        html += `<div><span class="title">${degree}</span> <span class="subtitle">at ${institution}</span> <span class="period">${period}</span></div>`;
                    }
                    html += `</div>`;
                }
            });
        } else {
            if (formatAsList) {
                html += `<ul>`;
                items.forEach(item => {
                    html += `<li>${item}</li>`;
                });
                html += `</ul>`;
            } else {
                html += `<p>${contentLines}</p>`;
            }
        }
        return html;
    };

    const getContactInfoHTML = () => {
        let info = '';
        if (email) info += `<span>${email}</span> | `;
        if (phone) info += `<span>${phone}</span> | `;
        if (location) info += `<span>${location}</span>`;
        
        let links = '';
        if (linkedin) links += `<a href="${linkedin}">LinkedIn</a> | `;
        if (github) links += `<a href="${github}">GitHub</a> | `;
        if (portfolio) links += `<a href="${portfolio}">Portfolio</a>`;

        return `
            <div style="text-align: center; margin-bottom: 20px;">
                <h1 style="font-size: 2rem; margin-bottom: 5px;">${name}</h1>
                <div style="font-size: 0.9rem; color: #555;">${info}</div>
                <div style="font-size: 0.9rem; margin-top: 5px;">${links}</div>
            </div>
        `;
    };

    content.innerHTML += getContactInfoHTML();

    if (summary) {
        content.innerHTML += `<h2>Summary</h2><p>${summary}</p>`;
    }
    if (skills) {
        content.innerHTML += `<h2>Skills</h2><p>${skills}</p>`;
    }
    if (languages) {
        content.innerHTML += `<h2>Languages</h2><p>${languages}</p>`;
    }

    const educationLines = education.split('\n').filter(line => line.trim() !== '');
    if (educationLines.length > 0) {
        content.innerHTML += `<h2>Education</h2>`;
        educationLines.forEach(line => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length === 3) {
                const [degree, institution, period] = parts;
                content.innerHTML += `<div><span class="title">${degree}</span> <span class="subtitle">at ${institution}</span> <span class="period">${period}</span></div><br>`;
            }
        });
    }

    const workExpLines = workExperience.split('\n').filter(line => line.trim() !== '');
    if (workExpLines.length > 0) {
        content.innerHTML += `<h2>Work Experience</h2>`;
        let currentItem = '';
        let bulletPoints = [];
        workExpLines.forEach(line => {
            if (!line.startsWith('-')) {
                if (currentItem) {
                    const parts = currentItem.split('|').map(part => part.trim());
                    if (parts.length === 3) {
                        const [role, company, period] = parts;
                        content.innerHTML += `<div class="section-item"><div><span class="title">${role}</span> <span class="subtitle">@ ${company}</span><span class="period">${period}</span></div>`;
                        if (bulletPoints.length > 0) {
                            content.innerHTML += `<ul>`;
                            bulletPoints.forEach(bullet => {
                                content.innerHTML += `<li>${bullet}</li>`;
                            });
                            content.innerHTML += `</ul>`;
                        }
                        content.innerHTML += `</div>`;
                    }
                }
                currentItem = line;
                bulletPoints = [];
            } else {
                bulletPoints.push(line.substring(1).trim());
            }
        });
        // Process the last item
        if (currentItem) {
            const parts = currentItem.split('|').map(part => part.trim());
            if (parts.length === 3) {
                const [role, company, period] = parts;
                content.innerHTML += `<div class="section-item"><div><span class="title">${role}</span> <span class="subtitle">@ ${company}</span><span class="period">${period}</span></div>`;
                if (bulletPoints.length > 0) {
                    content.innerHTML += `<ul>`;
                    bulletPoints.forEach(bullet => {
                        content.innerHTML += `<li>${bullet}</li>`;
                    });
                    content.innerHTML += `</ul>`;
                }
                content.innerHTML += `</div>`;
            }
        }
    }

    const projectLines = projects.split('\n').filter(line => line.trim() !== '');
    if (projectLines.length > 0) {
        content.innerHTML += `<h2>Projects</h2>`;
        projectLines.forEach(line => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length === 3) {
                const [title, period, description] = parts;
                content.innerHTML += `<div class="section-item"><div><span class="title">${title}</span> <span class="period">${period}</span></div><p>${description}</p></div>`;
            }
        });
    }
    
    const certificationLines = certifications.split('\n').filter(line => line.trim() !== '');
    if (certificationLines.length > 0) {
        content.innerHTML += `<h2>Certifications</h2>`;
        certificationLines.forEach(line => {
            const parts = line.split('|').map(part => part.trim());
            if (parts.length === 3) {
                const [title, authority, year] = parts;
                content.innerHTML += `<div class="section-item"><div><span class="title">${title}</span> <span class="subtitle">by ${authority}</span> <span class="period">${year}</span></div>`;
            }
        });
    }

    const options = {
        filename: 'resume.pdf',
        margin: [10, 10, 10, 10],
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().from(content).set(options).save().then(() => {
        document.body.removeChild(content);
    });
});