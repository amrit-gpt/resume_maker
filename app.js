(function(){
  const $ = sel => document.querySelector(sel);

  const form = $('#resumeForm');
  const downloadBtn = $('#downloadBtn');

  const pv = {
    name: $('#pv-name'),
    title: $('#pv-title'),
    email: $('#pv-email'),
    phone: $('#pv-phone'),
    location: $('#pv-location'),
    website: $('#pv-website'),
    summary: $('#pv-summary'),
    experience: $('#pv-experience'),
    education: $('#pv-education'),
    projects: $('#pv-projects'),
    skills: $('#pv-skills'),
    links: $('#pv-links')
  };

  const eduList = $('#educationList');
  const expList = $('#experienceList');
  const projList = $('#projectsList');

  function createEduItem() {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Degree" class="edu-degree"/>
        <input placeholder="Institution" class="edu-institute"/>
      </div>
      <div class="row">
        <input placeholder="Duration" class="edu-duration"/>
        <input placeholder="Score" class="edu-score"/>
        <button class="remove">Remove</button>
      </div>
    `;
    div.querySelector('.remove').onclick = () => div.remove();
    div.querySelectorAll('input').forEach(i => i.addEventListener('input', renderPreview));
    return div;
  }

  function createExpItem() {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Role" class="exp-role"/>
        <input placeholder="Company" class="exp-company"/>
      </div>
      <div class="row">
        <input placeholder="Duration" class="exp-duration"/>
        <button class="remove">Remove</button>
      </div>
      <textarea placeholder="Achievements" class="exp-desc"></textarea>
    `;
    div.querySelector('.remove').onclick = () => div.remove();
    div.querySelectorAll('input,textarea').forEach(i => i.addEventListener('input', renderPreview));
    return div;
  }

  function createProjItem() {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Project name" class="proj-name"/>
        <input placeholder="Tech used" class="proj-tech"/>
      </div>
      <div class="row">
        <input placeholder="Link" class="proj-link"/>
        <button class="remove">Remove</button>
      </div>
      <textarea placeholder="Description" class="proj-desc"></textarea>
    `;
    div.querySelector('.remove').onclick = () => div.remove();
    div.querySelectorAll('input,textarea').forEach(i => i.addEventListener('input', renderPreview));
    return div;
  }

  $('#addEdu').onclick = () => eduList.appendChild(createEduItem());
  $('#addExp').onclick = () => expList.appendChild(createExpItem());
  $('#addProj').onclick = () => projList.appendChild(createProjItem());

  eduList.appendChild(createEduItem());
  expList.appendChild(createExpItem());
  projList.appendChild(createProjItem());

  form.addEventListener('input', renderPreview);

  function renderPreview(){
    pv.name.textContent = $('#name').value;
    pv.title.textContent = $('#title').value;
    pv.email.textContent = $('#email').value;
    pv.phone.textContent = $('#phone').value;
    pv.location.textContent = $('#location').value;
    pv.website.textContent = $('#website').value;
    pv.summary.textContent = $('#summary').value;

    pv.experience.innerHTML = '';
    expList.querySelectorAll('.repeat-item').forEach(item=>{
      const role = item.querySelector('.exp-role').value;
      const company = item.querySelector('.exp-company').value;
      const duration = item.querySelector('.exp-duration').value;
      const desc = item.querySelector('.exp-desc').value;
      if(role||company||duration||desc){
        pv.experience.innerHTML += `<div class="pv-item"><div class="meta">${role} @ ${company} (${duration})</div><div class="muted">${desc}</div></div>`;
      }
    });

    pv.education.innerHTML = '';
    eduList.querySelectorAll('.repeat-item').forEach(item=>{
      const degree = item.querySelector('.edu-degree').value;
      const inst = item.querySelector('.edu-institute').value;
      const dur = item.querySelector('.edu-duration').value;
      const score = item.querySelector('.edu-score').value;
      if(degree||inst||dur||score){
        pv.education.innerHTML += `<div class="pv-item"><div class="meta">${degree} @ ${inst} (${dur})</div><div class="muted">${score}</div></div>`;
      }
    });

    pv.projects.innerHTML = '';
    projList.querySelectorAll('.repeat-item').forEach(item=>{
      const name = item.querySelector('.proj-name').value;
      const tech = item.querySelector('.proj-tech').value;
      const link = item.querySelector('.proj-link').value;
      const desc = item.querySelector('.proj-desc').value;
      if(name||tech||link||desc){
        pv.projects.innerHTML += `<div class="pv-item"><div class="meta">${name} • ${tech}</div><div class="muted">${desc}${link?('<br/><a href="'+link+'" target="_blank">'+link+'</a>'):''}</div></div>`;
      }
    });

    pv.skills.textContent = $('#skills').value;
    pv.links.textContent = $('#links').value;
  }

  renderPreview();

  // PDF download
  downloadBtn.addEventListener('click', () => {
    const element = document.getElementById('resumePreview');
    const opt = {
      margin: 12,
      filename: ($('#name').value || 'resume') + '.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
  });

})();