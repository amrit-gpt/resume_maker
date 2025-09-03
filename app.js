/* Polished Resume Maker — app logic (vanilla JS)
   - No sample values
   - Dynamic sections
   - Live preview
   - Theme remembered in localStorage
*/

(() => {
  const $ = (s, ctx = document) => ctx.querySelector(s);
  const $$ = (s, ctx = document) => Array.from(ctx.querySelectorAll(s));

  // Elements
  const form = $("#editorForm");
  const resume = $("#resume");
  const themeToggle = $("#themeToggle");
  const exportBtn = $("#exportPdf");
  const resetBtn = $("#resetBtn");

  // Dynamic containers
  const expList = $("#expList");
  const eduList = $("#eduList");
  const projList = $("#projList");
  const linksList = $("#linksList");
  const skillsTags = $("#skillsTags");

  // State
  const state = {
    basic: {
      name: "",
      title: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    links: [],
    languages: [],
    certifications: [],
    activities: []
  };

  // Theme
  const savedTheme = localStorage.getItem("rm.theme");
  if (savedTheme === "dark") document.documentElement.classList.add("dark");
  themeToggle.textContent = document.documentElement.classList.contains("dark") ? "Light" : "Dark";
  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.classList.toggle("dark");
    localStorage.setItem("rm.theme", isDark ? "dark" : "light");
    themeToggle.textContent = isDark ? "Light" : "Dark";
  });

  // Export
  exportBtn.addEventListener("click", () => window.print());

  // Reset
  resetBtn.addEventListener("click", () => {
    if (!confirm("Clear all fields and resume preview?")) return;
    form.reset();
    state.basic = { name:"", title:"", email:"", phone:"", location:"", summary:"" };
    state.skills = [];
    state.experience = [];
    state.education = [];
    state.projects = [];
    state.links = [];
    state.languages = [];
    state.certifications = [];
    state.activities = [];
    clearLists();
    render();
  });

  function clearLists() {
    [expList, eduList, projList, linksList, skillsTags].forEach(el => el.innerHTML = "");
  }

  // Basic inputs -> update state & render
  ["name","title","email","phone","location","summary"].forEach(name => {
    const el = form[name];
    el.addEventListener("input", e => {
      state.basic[name] = e.target.value.trim();
      render();
    });
  });

  // Skills input (enter to add)
  const skillInput = form.skillInput;
  skillInput.addEventListener("keydown", e => {
    if (e.key === "Enter") {
      e.preventDefault();
      const v = skillInput.value.trim();
      if (v) {
        addSkill(v);
        skillInput.value = "";
      }
    }
  });

  function addSkill(label) {
    if (!label) return;
    if (state.skills.includes(label)) return;
    state.skills.push(label);
    renderSkills();
    render();
  }
  function removeSkill(idx) {
    state.skills.splice(idx,1);
    renderSkills();
    render();
  }
  function renderSkills() {
    skillsTags.innerHTML = "";
    state.skills.forEach((s,i) => {
      const el = document.createElement("div");
      el.className = "tag";
      el.innerHTML = `<span>${escapeHtml(s)}</span><button title="Remove" class="removeBtn" data-idx="${i}">✕</button>`;
      skillsTags.appendChild(el);
    });
    // bind remove
    $$(".removeBtn", skillsTags).forEach(btn => {
      btn.addEventListener("click", () => removeSkill(Number(btn.dataset.idx)));
    });
  }

  // Generic add/remove for dynamic lists (experience, education, project, link, language, cert, activity)
  const addMap = {
    experience: createExperienceItem,
    education: createEducationItem,
    project: createProjectItem,
    link: createLinkItem,
    language: createLanguageItem,
    cert: createCertItem,
    activity: createActivityItem
  };

  $$("[data-add]").forEach(btn => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.add;
      const ctr = {
        experience: expList, education: eduList, project: projList,
        link: linksList, language: linksList, cert: linksList, activity: linksList
      }[key];
      if (!ctr) return;
      const idx = (ctr.children.length);
      const item = addMap[key]();
      ctr.appendChild(item.dom);
      bindItemInputs(item, key, idx);
      render();
    });
  });

  // Create DOM blocks for each type (all inputs blank)
  function createExperienceItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Experience</div>
      <label class="field"><input data-k="role" placeholder="Role / Title"></label>
      <label class="field"><input data-k="company" placeholder="Company"></label>
      <label class="field"><input data-k="location" placeholder="Location"></label>
      <div class="split" style="margin-top:6px">
        <label class="field"><input data-k="start" placeholder="Start (e.g. Jul 2023)"></label>
        <label class="field"><input data-k="end" placeholder="End (or Present)"></label>
      </div>
      <label class="field"><textarea data-k="bullets" rows="3" placeholder="Bullets — one per line"></textarea></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { role:"", company:"", location:"", start:"", end:"", bullets:"" } };
  }

  function createEducationItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Education</div>
      <label class="field"><input data-k="degree" placeholder="Degree / Program"></label>
      <label class="field"><input data-k="institution" placeholder="Institution"></label>
      <div class="split" style="margin-top:6px">
        <label class="field"><input data-k="start" placeholder="Start"></label>
        <label class="field"><input data-k="end" placeholder="End"></label>
      </div>
      <label class="field"><input data-k="score" placeholder="Score / Grade (optional)"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { degree:"", institution:"", start:"", end:"", score:"" } };
  }

  function createProjectItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Project</div>
      <label class="field"><input data-k="name" placeholder="Project name"></label>
      <label class="field"><input data-k="desc" placeholder="Short description or tech stack"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { name:"", desc:"" } };
  }

  function createLinkItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Link</div>
      <label class="field"><input data-k="label" placeholder="Label (GitHub, LinkedIn)"></label>
      <label class="field"><input data-k="url" placeholder="https://"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { label:"", url:"" } };
  }

  function createLanguageItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Language</div>
      <label class="field"><input data-k="name" placeholder="Language"></label>
      <label class="field"><input data-k="level" placeholder="Proficiency (e.g. Native, Fluent)"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { name:"", level:"" } };
  }

  function createCertItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Certification</div>
      <label class="field"><input data-k="name" placeholder="Certification"></label>
      <label class="field"><input data-k="issuer" placeholder="Issuer"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { name:"", issuer:"" } };
  }

  function createActivityItem(){
    const dom = document.createElement("div");
    dom.className = "item";
    dom.innerHTML = `
      <div class="mini">Activity</div>
      <label class="field"><input data-k="name" placeholder="Activity / Volunteer"></label>
      <label class="field"><input data-k="note" placeholder="Note (role, years)"></label>
      <div class="row"><button class="btn ghost remove" type="button">Remove</button></div>
    `;
    return { dom, empty: { name:"", note:"" } };
  }

  // Keep data arrays aligned with DOM order — when adding we push empty; when removing splice.
  function bindItemInputs(item, type, index) {
    // add empty placeholder in state
    const arr = getStateArray(type);
    arr.push(item.empty);

    const dom = item.dom;
    const inputs = $$("[data-k]", dom);
    inputs.forEach(inp => {
      inp.addEventListener("input", () => {
        // compute index by DOM children order
        const parent = dom.parentElement;
        const idx = Array.prototype.indexOf.call(parent.children, dom);
        const key = inp.dataset.k;
        getStateArray(type)[idx][key] = inp.value.trim();
        render();
      });
    });

    // remove button
    const rem = dom.querySelector(".remove");
    rem.addEventListener("click", () => {
      const parent = dom.parentElement;
      const idx = Array.prototype.indexOf.call(parent.children, dom);
      getStateArray(type).splice(idx,1);
      dom.remove();
      render();
    });
  }

  function getStateArray(key){
    switch(key){
      case "experience": return state.experience;
      case "education": return state.education;
      case "project": return state.projects;
      case "link": return state.links;
      case "language": return state.languages;
      case "cert": return state.certifications;
      case "activity": return state.activities;
      default: return [];
    }
  }

  // Render preview
  function render(){
    // Header
    $("#r-name").textContent = state.basic.name || "";
    $("#r-title").textContent = state.basic.title || "";
    const metaParts = [];
    if (state.basic.email) metaParts.push(state.basic.email);
    if (state.basic.phone) metaParts.push(state.basic.phone);
    if (state.basic.location) metaParts.push(state.basic.location);
    $("#r-meta").textContent = metaParts.join(" • ");

    // Skills
    const skillsContainer = $("#r-skills");
    skillsContainer.innerHTML = "";
    state.skills.forEach(s => {
      const el = document.createElement("div");
      el.className = "skill-chip";
      el.textContent = s;
      skillsContainer.appendChild(el);
    });

    // Summary
    const sum = $("#r-summary");
    if (state.basic.summary) {
      sum.innerHTML = `<h3>Summary</h3><div class="small">${escapeHtml(state.basic.summary)}</div>`;
    } else sum.innerHTML = "";

    // Experience
    const exp = $("#r-experience");
    if (state.experience.length) {
      exp.innerHTML = `<h3>Experience</h3>` + state.experience.map(item => {
        const bullets = (item.bullets || "").split("\n").map(b => b.trim()).filter(Boolean);
        return `<div class="resume-item">
            <div class="left"><strong>${escapeHtml(item.role || "")}${item.company ? " — "+escapeHtml(item.company) : ""}</strong>
              ${bullets.length ? `<ul>${bullets.map(b=>`<li>${escapeHtml(b)}</li>`).join("")}</ul>` : ""}
            </div>
            <div class="right small">${escapeHtml(item.location||"")}${(item.start||item.end) ? "<br>"+escapeHtml(range(item.start,item.end)) : ""}</div>
          </div>`;
      }).join("") ;
    } else exp.innerHTML = "";

    // Projects
    const proj = $("#r-projects");
    if (state.projects.length) {
      proj.innerHTML = `<h3>Projects</h3>` + state.projects.map(p => {
        return `<div class="resume-item"><div class="left"><strong>${escapeHtml(p.name||"")}</strong><div class="small">${escapeHtml(p.desc||"")}</div></div></div>`;
      }).join("");
    } else proj.innerHTML = "";

    // Education
    const edu = $("#r-education");
    if (state.education.length) {
      edu.innerHTML = `<h3>Education</h3>` + state.education.map(e => {
        return `<div class="resume-item"><div class="left"><strong>${escapeHtml(e.degree||"")}${e.institution ? " — "+escapeHtml(e.institution):""}</strong></div>
                <div class="right small">${escapeHtml(range(e.start,e.end))}${e.score ? "<br>"+escapeHtml(e.score) : ""}</div></div>`;
      }).join("");
    } else edu.innerHTML = "";

    // Other (links, languages, certs, activities)
    const other = $("#r-other");
    const parts = [];
    if (state.links.length) {
      parts.push(`<div><h3>Links</h3>${state.links.map(l => `<div class="small">${l.url ? `<a href="${escapeAttr(l.url)}" target="_blank" rel="noreferrer">${escapeHtml(l.label || l.url)}</a>` : escapeHtml(l.label)}</div>`).join("")}</div>`);
    }
    if (state.languages.length) {
      parts.push(`<div><h3>Languages</h3>${state.languages.map(l => `<div class="small">${escapeHtml(l.name)}${l.level ? " — "+escapeHtml(l.level) : ""}</div>`).join("")}</div>`);
    }
    if (state.certifications.length) {
      parts.push(`<div><h3>Certifications</h3>${state.certifications.map(c => `<div class="small">${escapeHtml(c.name)}${c.issuer ? " — "+escapeHtml(c.issuer) : ""}</div>`).join("")}</div>`);
    }
    if (state.activities.length) {
      parts.push(`<div><h3>Activities</h3>${state.activities.map(a => `<div class="small">${escapeHtml(a.name)}${a.note ? " — "+escapeHtml(a.note) : ""}</div>`).join("")}</div>`);
    }
    other.innerHTML = parts.join("");
  }

  // small util
  function range(a,b){
    if (!a && !b) return "";
    if (a && b) return `${a} — ${b}`;
    return a || b || "";
  }
  function escapeHtml(s){
    return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c]));
  }
  function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;') }

  // initial render
  render();

  // expose some helpers (optional)
  window._rm = { state, render };

})();