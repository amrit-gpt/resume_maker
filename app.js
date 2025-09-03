/* app.js — Resume Maker logic
   - Live preview updates on input
   - Add/remove repeating sections
   - Download PDF via html2pdf
*/

(function(){
  // helpers
  const $ = sel => document.querySelector(sel);
  const $$ = sel => Array.from(document.querySelectorAll(sel));

  // references
  const form = $('#resumeForm');
  const downloadBtn = $('#downloadBtn');
  const copyBtn = $('#copyBtn');
  const clearBtn = $('#clearBtn');

  // preview nodes
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

  // containers for repeatable lists
  const eduList = $('#educationList');
  const expList = $('#experienceList');
  const projList = $('#projectsList');

  // initial empty templates (no garbage values)
  function createEduItem(data = {}) {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Degree / Certificate (e.g. BTech Computer Science)" class="edu-degree" value="${escapeHTML(data.degree||'')}"/>
        <input placeholder="Institution (e.g. SRMIST)" class="edu-institute" value="${escapeHTML(data.institute||'')}"/>
      </div>
      <div class="row">
        <input placeholder="Start - End (e.g. Sep 2022 - Present)" class="edu-duration" value="${escapeHTML(data.duration||'')}"/>
        <input placeholder="Score / CGPA (optional)" class="edu-score" value="${escapeHTML(data.score||'')}"/>
        <button class="remove">Remove</button>
      </div>
    `;
    bindRemove(div);
    return div;
  }

  function createExpItem(data = {}) {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Role (e.g. Web Dev Intern)" class="exp-role" value="${escapeHTML(data.role||'')}"/>
        <input placeholder="Company / Org" class="exp-company" value="${escapeHTML(data.company||'')}"/>
      </div>
      <div class="row">
        <input placeholder="Start - End (e.g. Jul 2024 - Aug 2024)" class="exp-duration" value="${escapeHTML(data.duration||'')}"/>
        <button class="remove">Remove</button>
      </div>
      <textarea placeholder="Short achievements (comma or newline separated)" class="exp-desc">${escapeHTML(data.desc||'')}</textarea>
    `;
    bindRemove(div);
    return div;
  }

  function createProjItem(data = {}) {
    const div = document.createElement('div');
    div.className = 'repeat-item';
    div.innerHTML = `
      <div class="row">
        <input placeholder="Project name" class="proj-name" value="${escapeHTML(data.name||'')}"/>
        <input placeholder="Tech used (comma separated)" class="proj-tech" value="${escapeHTML(data.tech||'')}"/>
      </div>
      <div class="row">
        <input placeholder="Link (optional)" class="proj-link" value="${escapeHTML(data.link||'')}"/>
        <button class="remove">Remove</button>
      </div>
      <textarea placeholder="One-line description of what you built and the impact" class="proj-desc">${escapeHTML(data.desc||'')}</textarea>
    `;
    bindRemove(div);
    return div;
  }

  // bind remove button
  function bindRemove(item){
    const btn = item.querySelector('.remove');
    if(btn) btn.addEventListener('click', () => { item.remove(); renderPreview(); });
    // also re-render when inputs change
    item.querySelectorAll('input,textarea').forEach(i => i.addEventListener('input', renderPreview));
  }

  // add initial empty one for each list
  eduList.appendChild(createEduItem());
  expList.appendChild(createExpItem());
  projList.appendChild(createProjItem());

  // add buttons
  $('#addEdu').addEventListener('click', () => { eduList.appendChild(createEduItem()); scrollToBottom(eduList); });
  $('#addExp').addEventListener('click', () => { expList.appendChild(createExpItem()); scrollToBottom(expList); });
  $('#addProj').addEventListener('click', () => { projList.appendChild(createProjItem()); scrollToBottom(projList); });

  // global input listeners
  form.addEventListener('input', renderPreview);

  // clear button
  clearBtn.addEventListener('click', () => {
    if(!confirm('Clear entire form?')) return;
    form.reset();
    // remove extra repeat items and keep one blank in each
    [eduList, expList, projList].forEach(container => {
      container.innerHTML = '';
    });
    eduList.appendChild(createEduItem());
    expList.appendChild(createExpItem());
    projList.appendChild(createProjItem());
    renderPreview();
  });

  // copy text
  copyBtn.addEventListener('click', () => {
    const text = buildPlainText();
    navigator.clipboard.writeText(text).then(()=> {
      copyBtn.textContent = 'Copied ✓';
      setTimeout(()=> copyBtn.textContent = 'Copy Text', 1400);
    }).catch(()=> alert('Copy failed — your browser may block clipboard access.'));
  });

  // download PDF
  downloadBtn.addEventListener('click', () => {
    // small visual: disable button while rendering
    downloadBtn.disabled = true;
    downloadBtn.textContent = 'Preparing...';
    // clone the preview so UI controls don't interfere
    const element = document.getElementById('resumePreview').cloneNode(true);
    // set sizes for PDF
    const opt = {
      margin:       12,
      filename:     (document.getElementById('name').value || 'resume') + '.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, allowTaint: true },
      jsPDF:        { unit: 'pt', format: 'a4', orientation: 'portrait' }
    };
    // use html2pdf
    html2pdf().set(opt).from(element).save().finally(()=>{
      downloadBtn.disabled = false;
      downloadBtn.textContent = 'Download PDF';
    });
  });

  // render preview initially
  renderPreview();

  // build preview functions
  function renderPreview(){
    pv.name.textContent = $('#name').value.trim() || '';
    pv.title.textContent = $('#title').value.trim() || '';
    pv.email.textContent = $('#email').value.trim();
    pv.phone.textContent = $('#phone').value.trim();
    pv.location.textContent = $('#location').value.trim();
    pv.website.textContent = $('#website').value.trim();
    pv.summary.textContent = $('#summary').value.trim();

    // experience
    pv.experience.innerHTML = '';
    docEach(expList, '.repeat-item', item => {
      const role = item.querySelector('.exp-role').value.trim();
      const company = item.querySelector('.exp-company').value.trim();
      const duration = item.querySelector('.exp-duration').value.trim();
      const desc = item.querySelector('.exp-desc').value.trim();
      if(!role && !company && !duration && !desc) return;
      const block = document.createElement('div');
      block.className = 'pv-item';
      block.innerHTML = `<div class="meta">${escapeHTML(role||company)} <small>${escapeHTML(company ? ' • ' + company : '')} ${escapeHTML(duration?(' • '+duration):'')}</small></div>
        <div class="muted">${escapeHTML(desc).replace(/\n/g,'<br/>').replace(/, ?/g,'<br/>')}</div>`;
      pv.experience.appendChild(block);
    });

    // education
    pv.education.innerHTML = '';
    docEach(eduList, '.repeat-item', item => {
      const degree = item.querySelector('.edu-degree').value.trim();
      const institute = item.querySelector('.edu-institute').value.trim();
      const duration = item.querySelector('.edu-duration').value.trim();
      const score = item.querySelector('.edu-score').value.trim();
      if(!degree && !institute && !duration && !score) return;
      const block = document.createElement('div');
      block.className = 'pv-item';
      block.innerHTML = `<div class="meta">${escapeHTML(degree)} <small>${escapeHTML(institute || '')} ${escapeHTML(duration?(' • '+duration):'')}</small></div>
        <div class="muted">${escapeHTML(score)}</div>`;
      pv.education.appendChild(block);
    });

    // projects
    pv.projects.innerHTML = '';
    docEach(projList, '.repeat-item', item => {
      const name = item.querySelector('.proj-name').value.trim();
      const tech = item.querySelector('.proj-tech').value.trim();
      const link = item.querySelector('.proj-link').value.trim();
      const desc = item.querySelector('.proj-desc').value.trim();
      if(!name && !tech && !link && !desc) return;
      const block = document.createElement('div');
      block.className = 'pv-item';
      block.innerHTML = `<div class="meta">${escapeHTML(name)} <small>${escapeHTML(tech ? ' • ' + tech : '')}</small></div>
        <div class="muted">${escapeHTML(desc)}${link?('<br/><a href="'+escapeAttr(link)+'" target="_blank" rel="noreferrer">'+escapeHTML(link)+'</a>'):''}</div>`;
      pv.projects.appendChild(block);
    });

    // skills
    const skillsRaw = $('#skills').value.split(',').map(s=>s.trim()).filter(Boolean);
    pv.skills.textContent = skillsRaw.join(' • ');

    // links
    pv.links.innerHTML = '';
    const linksLines = $('#links').value.split('\n').map(l=>l.trim()).filter(Boolean);
    linksLines.forEach(l => {
      const a = document.createElement('a');
      a.href = l;
      a.textContent = l.replace(/^https?:\/\//,'').replace(/\/$/,'');
      a.target = '_blank';
      a.rel = 'noreferrer';
      a.className = 'small';
      a.style.display = 'block';
      a.style.color = 'var(--muted)';
      pv.links.appendChild(a);
    });
  }

  // iterate over children matching selector
  function docEach(container, sel, fn){
    Array.from(container.querySelectorAll(sel)).forEach(fn);
  }

  // utilities
  function escapeHTML(s){
    return String(s||'').replace(/[&<>"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  }
  function escapeAttr(s){
    return String(s||'').replace(/"/g,'&quot;');
  }

  function scrollToBottom(el){ el.scrollTop = el.scrollHeight; }

  // build plain text for copy
  function buildPlainText(){
    let txt = '';
    txt += ($('#name').value||'') + ( $('#title').value ? ' — '+$('#title').value : '' ) + '\n';
    txt += ($('#email').value ? 'Email: '+$('#email').value+'  ' : '') + ($('#phone').value ? 'Phone: '+$('#phone').value : '') + '\n';
    txt += ($('#location').value ? $('#location').value : '') + '\n\n';
    if($('#summary').value) txt += 'Summary:\n' + $('#summary').value + '\n\n';

    txt += 'Experience:\n';
    docEach(expList, '.repeat-item', item => {
      const role = item.querySelector('.exp-role').value.trim();
      const company = item.querySelector('.exp-company').value.trim();
      const duration = item.querySelector('.exp-duration').value.trim();
      const desc = item.querySelector('.exp-desc').value.trim();
      if(!role && !company && !duration && !desc) return;
      txt += `- ${role}${company?(' @ '+company):''}${duration?(' ('+duration+')'):''}\n`;
      if(desc) txt += `  • ${desc.replace(/\n/g,' • ')}\n`;
    });

    txt += '\nEducation:\n';
    docEach(eduList, '.repeat-item', item => {
      const degree = item.querySelector('.edu-degree').value.trim();
      const institute = item.querySelector('.edu-institute').value.trim();
      const duration = item.querySelector('.edu-duration').value.trim();
      if(!degree && !institute && !duration) return;
      txt += `- ${degree}${institute?(' @ '+institute):''}${duration?(' ('+duration+')'):''}\n`;
    });

    const skills = $('#skills').value.trim();
    if(skills) txt += '\nSkills: ' + skills + '\n';

    const links = $('#links').value.trim();
    if(links) txt += '\nLinks:\n' + links + '\n';
    return txt;
  }

})();