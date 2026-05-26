import { siteContent } from "./site-data.js";

const root = document.querySelector("[data-page]");
const header = document.querySelector("#site-header");
const footer = document.querySelector("#site-footer");
const page = root?.dataset.page || "home";

document.body.dataset.page = page;

renderHeader();
renderPage(page);
renderFooter();
bindNavigation();
bindNewsletterForms();
bindFieldNoteFilters();
hydrateOptionalIntegrations();
initHeroCanvas();

function renderHeader() {
  const navLinks = siteContent.nav
    .map(
      (item) => `
        <a class="nav-link ${isActive(item.href) ? "is-active" : ""}" href="${item.href}">${item.label}</a>
      `,
    )
    .join("");

  header.innerHTML = `
    <div class="header-inner">
      <a class="brand" href="/" aria-label="${siteContent.name} home">
        <span class="brand-mark" aria-hidden="true">
          <img src="/assets/reath-logo.png" alt="">
        </span>
        <span class="brand-text">
          <span>${siteContent.name}</span>
          <small>${siteContent.tagline}</small>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
        <span class="nav-toggle-line"></span>
        <span class="nav-toggle-line"></span>
        <span class="sr-only">Menu</span>
      </button>
      <nav class="site-nav" id="site-nav" aria-label="Primary navigation">
        ${navLinks}
      </nav>
    </div>
  `;
}

function renderFooter() {
  footer.innerHTML = `
    <div class="footer-inner">
      <div class="footer-lead">
        <a class="brand footer-brand" href="/" aria-label="${siteContent.name} home">
          <span class="brand-mark" aria-hidden="true">
            <img src="/assets/reath-logo.png" alt="">
          </span>
          <span class="brand-text">
            <span>${siteContent.name}</span>
            <small>Nonprofit steward of learning, place, and renewal.</small>
          </span>
        </a>
        <p>Bēhere remains the origin seed and technology partner. Rhythm is the operating system for learning communities. The Reath Foundation carries the nonprofit mission in public, local, and philanthropic form.</p>
      </div>
      <div class="footer-links" aria-label="Footer navigation">
        ${siteContent.nav
          .map((item) => `<a href="${item.href}">${item.label}</a>`)
          .join("")}
      </div>
      <div class="footer-contact">
        <p>Field Notes, partnership inquiries, and giving conversations:</p>
        <a href="mailto:${siteContent.email}">${siteContent.email}</a>
      </div>
    </div>
  `;
}

function renderPage(currentPage) {
  const renderers = {
    home: renderHome,
    mission: renderMission,
    programs: renderPrograms,
    havilah: renderHavilah,
    fieldnotes: renderFieldNotes,
    support: renderSupport,
    partners: renderPartners,
    about: renderAbout,
  };

  const renderer = renderers[currentPage] || renderNotFound;
  root.innerHTML = renderer();
}

function renderHome() {
  const home = siteContent.home;
  return `
    <section class="hero" aria-labelledby="home-title">
      <canvas class="place-canvas" data-place-canvas aria-hidden="true"></canvas>
      <div class="hero-veil" aria-hidden="true"></div>
      <div class="hero-inner">
        <p class="eyebrow">${home.hero.eyebrow}</p>
        <h1 id="home-title">${home.hero.title}</h1>
        <p class="hero-copy">${home.hero.body}</p>
        <div class="hero-actions">
          ${button(home.hero.primaryCta.label, home.hero.primaryCta.href, "primary")}
          ${button(home.hero.secondaryCta.label, home.hero.secondaryCta.href, "secondary")}
        </div>
      </div>
    </section>

    <section class="section band-light" aria-labelledby="mission-summary">
      <div class="section-inner split-intro">
        <div>
          <p class="eyebrow">${home.mission.kicker}</p>
          <h2 id="mission-summary">${home.mission.title}</h2>
        </div>
        <div class="prose-block">
          <p>${home.mission.body}</p>
          <ul class="check-list">
            ${home.mission.points.map((point) => `<li>${point}</li>`).join("")}
          </ul>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="first-chapter">
      <div class="section-inner feature-row">
        ${placeFigure("Santa Ynez Valley", "Havilah House")}
        <div class="feature-copy">
          <p class="eyebrow">${home.firstChapter.kicker}</p>
          <h2 id="first-chapter">${home.firstChapter.title}</h2>
          <p>${home.firstChapter.body}</p>
          ${textLink("Explore the restoration", home.firstChapter.href)}
        </div>
      </div>
    </section>

    <section class="section band-sage" aria-labelledby="programs-gatherings">
      <div class="section-inner">
        ${sectionHeading("Programs and gatherings", "A practical ecology of learning, hospitality, access, and local stewardship.")}
        <div class="card-grid compact-grid" data-rhythm-collection="programs">
          ${siteContent.programs
            .slice(0, 4)
            .map((program) => programCard(program))
            .join("")}
        </div>
        <div class="section-action">${button("See all programs", "/programs/", "secondary")}</div>
      </div>
    </section>

    <section class="section" aria-labelledby="scholarships">
      <div class="section-inner callout-row">
        <div>
          <p class="eyebrow">${home.scholarships.kicker}</p>
          <h2 id="scholarships">${home.scholarships.title}</h2>
        </div>
        <div class="prose-block">
          <p>${home.scholarships.body}</p>
          ${textLink("Support access", home.scholarships.href)}
        </div>
      </div>
    </section>

    <section class="section band-paper" aria-labelledby="field-notes-preview">
      <div class="section-inner">
        ${sectionHeading("Field Notes and RE Papers", "A publication layer for the ideas, stories, restoration updates, and program notes behind the work.")}
        <div class="note-strip" data-beehiiv-posts>
          ${siteContent.fieldNotes
            .slice(0, 3)
            .map((note) => noteCard(note))
            .join("")}
        </div>
        <div class="section-action">${button("Read Field Notes", "/field-notes/", "secondary")}</div>
      </div>
    </section>

    <section class="section support-band" aria-labelledby="support-restoration">
      <div class="section-inner support-inner">
        <div>
          <p class="eyebrow">Support the restoration</p>
          <h2 id="support-restoration">Help turn spaces into homes for learning.</h2>
          <p>Gifts can support restoration, scholarships, pilot gatherings, and the practical operating needs of a nonprofit learning community.</p>
        </div>
        <div class="support-actions">
          ${button("Start a giving conversation", "mailto:hello@thereath.com?subject=Support%20The%20Reath%20Foundation", "primary")}
          ${button("Partner with us", "/partners/", "secondary")}
        </div>
      </div>
    </section>

    ${newsletterSection()}
  `;
}

function renderMission() {
  return `
    ${pageHero(
      "Mission",
      "Stewarding the places, relationships, and access that make learning communities possible.",
      "The Reath Foundation exists to hold the nonprofit side of the mission: education and family enrichment, scholarships, restoration projects, local partnerships, and the patient work of civic trust.",
    )}
    <section class="section band-light">
      <div class="section-inner split-intro">
        <div>
          <p class="eyebrow">What we carry</p>
          <h2>Learning is more than content delivery.</h2>
        </div>
        <div class="prose-block large-prose">
          <p>It is a pattern of people, places, mentors, meals, projects, rituals, tools, and shared responsibilities. The Reath Foundation gives that pattern a nonprofit home.</p>
          <p>Bēhere remains the origin seed and technology/design partner. Rhythm helps learning communities operate with clarity. The foundation holds the charitable, public, and place-based expression of the work.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        ${sectionHeading("Mission pillars", "Five commitments shape the foundation's work.")}
        <div class="pillar-grid">
          ${[
            ["Place", "Treat local landscapes, homes, institutions, and histories as part of the curriculum."],
            ["Family", "Support parents and children as whole people, not as separate market segments."],
            ["Access", "Use scholarships, gifts, and sponsorships to widen participation."],
            ["Renewal", "Restore physical spaces and social trust together."],
            ["Technology", "Let digital systems serve the living community, with Rhythm as infrastructure rather than spectacle."],
          ]
            .map(
              ([title, body]) => `
                <article class="pillar-card">
                  <span>${title}</span>
                  <p>${body}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section band-sage">
      <div class="section-inner callout-row">
        <div>
          <p class="eyebrow">The nonprofit role</p>
          <h2>A structure for trust, gifts, scholarships, and stewardship.</h2>
        </div>
        <div class="prose-block">
          <p>The foundation can receive donations, fund access, sponsor programs, convene partners, restore places, and protect the long-term mission while Bēhere and Rhythm continue to build technology and design systems for learning communities.</p>
          ${textLink("Explore support pathways", "/support/")}
        </div>
      </div>
    </section>
  `;
}

function renderPrograms() {
  return `
    ${pageHero(
      "Programs",
      "Gatherings, circles, scholarships, and local learning infrastructure.",
      "Programs are designed to begin small, stay personal, and become more durable as local partners, donors, mentors, and families gather around a place.",
    )}
    <section class="section band-light">
      <div class="section-inner">
        ${sectionHeading("Program ecology", "Each offering can stand alone, but the deeper value appears when they begin to reinforce one another.")}
        <div class="card-grid" data-rhythm-collection="programs">
          ${siteContent.programs.map((program) => programCard(program)).join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner feature-row reverse">
        ${placeFigure("Gatherings", "Local mentors")}
        <div class="feature-copy">
          <p class="eyebrow">Rhythm ready</p>
          <h2>Built to connect with future organization and program data.</h2>
          <p>The static site includes calm integration points for Rhythm program records, gathering calendars, scholarship eligibility, and partner pages. The public story can grow into an operating layer without redesigning the whole site.</p>
          ${textLink("Partner on a program", "/partners/")}
        </div>
      </div>
    </section>
  `;
}

function renderHavilah() {
  return `
    ${pageHero(
      "Havilah House / Restoration",
      "A first home for learning, hospitality, and renewal in the Santa Ynez Valley.",
      "Havilah House, also known as The Reath, is imagined as the first place where the foundation's mission becomes tangible: restored rooms, shared meals, learning circles, family gatherings, and stewardship in practice.",
    )}
    <section class="section band-light">
      <div class="section-inner feature-row">
        ${placeFigure("The Reath", "Restoration")}
        <div class="feature-copy">
          <p class="eyebrow">First chapter</p>
          <h2>Restoration as education.</h2>
          <p>Restoring a place is not only a construction project. It can become a curriculum in craft, memory, hospitality, land care, architecture, and neighborly responsibility.</p>
          <p>The foundation can receive gifts and coordinate partners so the house becomes useful, beautiful, and generous over time.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        ${sectionHeading("Restoration phases", "A patient path from listening to long-term stewardship.")}
        <div class="timeline">
          ${siteContent.restorationPhases
            .map(
              (phase, index) => `
                <article class="timeline-item">
                  <span class="timeline-number">${String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>${phase.title}</h3>
                    <p>${phase.body}</p>
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section support-band">
      <div class="section-inner support-inner">
        <div>
          <p class="eyebrow">Support the restoration</p>
          <h2>Give toward the first place.</h2>
          <p>Support can help fund planning, repairs, materials, furnishings, hospitality, access, documentation, and the early programs that bring the house to life.</p>
        </div>
        ${button("Start a restoration gift conversation", "mailto:hello@thereath.com?subject=Havilah%20House%20Restoration", "primary")}
      </div>
    </section>
  `;
}

function renderFieldNotes() {
  return `
    ${pageHero(
      "Field Notes",
      "The publication layer for papers, stories, archives, restoration updates, and conversations.",
      "Field Notes can live on the site and syndicate through Beehiiv when useful. The structure is ready for essays, newsletters, RE Papers, and program dispatches without making the publication platform the center of the mission.",
    )}
    <section class="section band-light">
      <div class="section-inner">
        ${sectionHeading("Series", "Six streams for publishing the work as it unfolds.")}
        <div class="series-grid">
          ${siteContent.fieldSeries
            .map(
              (series) => `
                <article class="series-card">
                  <h3>${series.title}</h3>
                  <p>${series.body}</p>
                  <button class="text-button series-filter" type="button" data-series="${series.slug}">View notes</button>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section" aria-labelledby="latest-notes">
      <div class="section-inner">
        <div class="notes-header">
          <div>
            <p class="eyebrow">Latest</p>
            <h2 id="latest-notes">Launch notes</h2>
          </div>
          <button class="text-button series-filter" type="button" data-series="all">Show all</button>
        </div>
        <div class="note-grid" data-beehiiv-posts>
          ${siteContent.fieldNotes.map((note) => noteCard(note)).join("")}
        </div>
      </div>
    </section>
    ${newsletterSection()}
  `;
}

function renderSupport() {
  return `
    ${pageHero(
      "Support",
      "Give toward restoration, scholarships, access, and the patient work of community renewal.",
      "The foundation gives donors and partners a nonprofit home for practical generosity: renewing spaces, opening access, underwriting programs, and helping the first chapter become durable.",
    )}
    <section class="section band-light">
      <div class="section-inner">
        ${sectionHeading("Ways to support", "Donation platform links are ready to connect. For now, each path starts a direct giving conversation.")}
        <div class="card-grid">
          ${siteContent.supportOptions
            .map(
              (option) => `
                <article class="support-card">
                  <h3>${option.title}</h3>
                  <p>${option.body}</p>
                  ${textLink(option.action, option.href)}
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner split-intro">
        <div>
          <p class="eyebrow">What gifts can make possible</p>
          <h2>Spaces, access, programs, and trust.</h2>
        </div>
        <div class="prose-block">
          <ul class="check-list">
            <li>Restoration planning, repairs, materials, and hospitality infrastructure.</li>
            <li>Scholarships for families, students, cohorts, and educator apprenticeships.</li>
            <li>Program pilots, community meals, field study, and mentor honoraria.</li>
            <li>Field Notes, documentation, archival work, and public learning resources.</li>
          </ul>
        </div>
      </div>
    </section>
    ${newsletterSection("Follow restoration and scholarship updates")}
  `;
}

function renderPartners() {
  return `
    ${pageHero(
      "Partners",
      "A living community needs hosts, mentors, donors, builders, educators, and local institutions.",
      "The Reath Foundation is designed to work with partners who care about families, education, place, beauty, craft, restoration, and durable civic life.",
    )}
    <section class="section band-light">
      <div class="section-inner">
        ${sectionHeading("Partner pathways", "Different kinds of partners can help the mission become practical.")}
        <div class="card-grid">
          ${siteContent.partnerPaths
            .map(
              (path) => `
                <article class="partner-card">
                  <h3>${path.title}</h3>
                  <p>${path.body}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
    <section class="section support-band">
      <div class="section-inner support-inner">
        <div>
          <p class="eyebrow">Begin a conversation</p>
          <h2>Tell us what you are stewarding.</h2>
          <p>Partnership can begin with a place, a program, a scholarship goal, a local need, or a shared question about the future of learning communities.</p>
        </div>
        ${button("Start a partner conversation", "mailto:hello@thereath.com?subject=Partnership%20Conversation", "primary")}
      </div>
    </section>
  `;
}

function renderAbout() {
  return `
    ${pageHero(
      "About",
      "The nonprofit expression of a mission that began with Bēhere and is growing through Rhythm.",
      "The Reath Foundation exists so the mission can receive gifts, restore places, sponsor access, host programs, and serve communities in a form built for public trust.",
    )}
    <section class="section band-light">
      <div class="section-inner split-intro">
        <div>
          <p class="eyebrow">Origin and role</p>
          <h2>Bēhere is not disappearing. It is becoming more focused.</h2>
        </div>
        <div class="prose-block large-prose">
          <p>Bēhere remains the origin seed and technology/design company behind Rhythm. Rhythm is the operating system for learning communities. The Reath Foundation is the nonprofit mission-bearing organization that can operate programs, receive donations, fund scholarships, steward spaces, and convene local partners.</p>
          <p>Together, these parts create a clearer ecology: technology serves the work, the foundation carries the public mission, and places like Havilah House give the mission a living home.</p>
        </div>
      </div>
    </section>
    <section class="section">
      <div class="section-inner">
        ${sectionHeading("A foundation built for place", "The work is intentionally warm, grounded, local, and practical.")}
        <div class="pillar-grid">
          ${[
            ["Beautiful", "The physical and digital experience should invite care, not merely attention."],
            ["Intelligent", "The work honors systems, economics, operations, and deep educational questions."],
            ["Family-friendly", "Children, parents, elders, mentors, and hosts all belong in the picture."],
            ["Spacious", "The tone leaves room for many people of good will to participate."],
            ["Grounded", "Each chapter begins with real places, real needs, and real relationships."],
          ]
            .map(
              ([title, body]) => `
                <article class="pillar-card">
                  <span>${title}</span>
                  <p>${body}</p>
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function renderNotFound() {
  return `
    ${pageHero(
      "Not found",
      "This page is still being restored.",
      "The page you are looking for is not available yet. The main site paths are ready below.",
    )}
    <section class="section">
      <div class="section-inner">
        <div class="card-grid compact-grid">
          ${siteContent.nav
            .map(
              (item) => `
                <article class="simple-card">
                  <h3>${item.label}</h3>
                  ${textLink("Open page", item.href)}
                </article>
              `,
            )
            .join("")}
        </div>
      </div>
    </section>
  `;
}

function pageHero(kicker, title, body) {
  return `
    <section class="page-hero" aria-labelledby="page-title">
      <div class="page-hero-inner">
        <div class="page-hero-copy">
          <p class="eyebrow">${kicker}</p>
          <h1 id="page-title">${title}</h1>
          <p>${body}</p>
        </div>
        ${placeFigure(kicker, siteContent.name)}
      </div>
    </section>
  `;
}

function sectionHeading(title, body) {
  return `
    <div class="section-heading">
      <p class="eyebrow">${title}</p>
      <h2>${body}</h2>
    </div>
  `;
}

function programCard(program) {
  return `
    <article class="program-card">
      <span class="card-label">${program.label}</span>
      <h3>${program.title}</h3>
      <p>${program.body}</p>
    </article>
  `;
}

function noteCard(note) {
  return `
    <article class="note-card" data-note-series="${note.slug}">
      <div class="note-meta">
        <span>${note.series}</span>
        <span>${note.date}</span>
      </div>
      <h3>${note.title}</h3>
      <p>${note.body}</p>
      ${textLink("Read note", "/field-notes/")}
    </article>
  `;
}

function placeFigure(topLabel, bottomLabel) {
  return `
    <figure class="place-figure" aria-label="${topLabel}">
      <div class="place-figure-sky"></div>
      <div class="place-figure-hills"></div>
      <div class="place-figure-house">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <figcaption>
        <span>${topLabel}</span>
        <strong>${bottomLabel}</strong>
      </figcaption>
    </figure>
  `;
}

function newsletterSection(title = "Receive Field Notes") {
  return `
    <section class="section newsletter-band" aria-labelledby="newsletter-title">
      <div class="section-inner newsletter-inner">
        <div>
          <p class="eyebrow">Newsletter</p>
          <h2 id="newsletter-title">${title}</h2>
          <p>Essays, restoration updates, program notes, and invitations from The Reath Foundation.</p>
        </div>
        <form class="newsletter-form" data-newsletter-form data-enabled="${siteContent.integrations.beehiiv.enabled}" data-endpoint="${siteContent.integrations.beehiiv.subscribeEndpoint}">
          <label for="newsletter-email">Email address</label>
          <div class="newsletter-row">
            <input id="newsletter-email" type="email" name="email" autocomplete="email" placeholder="you@example.com" required>
            <button class="btn btn-primary" type="submit">Sign up</button>
          </div>
          <p class="form-note" data-form-note>Beehiiv can be connected here when the publication is ready.</p>
        </form>
      </div>
    </section>
  `;
}

function button(label, href, variant = "secondary") {
  return `<a class="btn btn-${variant}" href="${href}">${label}</a>`;
}

function textLink(label, href) {
  return `<a class="text-link" href="${href}">${label}<span aria-hidden="true"> -></span></a>`;
}

function isActive(href) {
  if (page === "home" && href === "/") return true;
  const map = {
    mission: "/mission/",
    programs: "/programs/",
    havilah: "/havilah-house/",
    fieldnotes: "/field-notes/",
    support: "/support/",
    partners: "/partners/",
    about: "/about/",
  };
  return map[page] === href;
}

function bindNavigation() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");

  toggle?.addEventListener("click", () => {
    const expanded = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!expanded));
    document.body.classList.toggle("nav-open", !expanded);
  });

  nav?.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      toggle?.setAttribute("aria-expanded", "false");
      document.body.classList.remove("nav-open");
    }
  });
}

function bindNewsletterForms() {
  document.addEventListener("submit", async (event) => {
    const form = event.target.closest("[data-newsletter-form]");
    if (!form) return;

    event.preventDefault();
    const note = form.querySelector("[data-form-note]");
    const email = new FormData(form).get("email");
    const endpoint = form.dataset.endpoint;
    const enabled = form.dataset.enabled === "true";

    if (!email) {
      note.textContent = "Please enter an email address.";
      return;
    }

    if (enabled && endpoint) {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        if (!response.ok) throw new Error("Newsletter request failed");
        note.textContent = "Thank you. You are signed up for Field Notes.";
        form.reset();
        return;
      } catch (error) {
        note.textContent = "The signup service is not responding. Please email hello@thereath.com.";
        return;
      }
    }

    note.textContent = "Thank you. Connect Beehiiv to store this signup before launch.";
    form.reset();
  });
}

function bindFieldNoteFilters() {
  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-series]");
    if (!button) return;

    const series = button.dataset.series;
    document.querySelectorAll("[data-note-series]").forEach((note) => {
      note.hidden = series !== "all" && note.dataset.noteSeries !== series;
    });

    document.querySelectorAll("[data-series]").forEach((item) => {
      item.classList.toggle("is-active", item === button);
    });

    document.querySelector("#latest-notes")?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

async function hydrateOptionalIntegrations() {
  await Promise.all([hydrateBeehiivPosts(), hydrateRhythmPrograms()]);
}

async function hydrateBeehiivPosts() {
  const { beehiiv } = siteContent.integrations;
  const containers = document.querySelectorAll("[data-beehiiv-posts]");
  if (!beehiiv.enabled || !beehiiv.postsEndpoint || !containers.length) return;

  try {
    const response = await fetch(beehiiv.postsEndpoint);
    if (!response.ok) throw new Error("Beehiiv feed request failed");
    const posts = await response.json();
    if (!Array.isArray(posts) || posts.length === 0) return;

    const markup = posts
      .slice(0, 6)
      .map((post) =>
        noteCard({
          title: post.title,
          series: post.series || "Field Notes",
          slug: post.slug || "field-notes",
          date: post.date || "New",
          body: post.excerpt || "",
        }),
      )
      .join("");

    containers.forEach((container) => {
      container.innerHTML = markup;
    });
  } catch (error) {
    console.info("Beehiiv integration is configured but unavailable.", error);
  }
}

async function hydrateRhythmPrograms() {
  const { rhythm } = siteContent.integrations;
  const containers = document.querySelectorAll('[data-rhythm-collection="programs"]');
  if (!rhythm.enabled || !rhythm.programsEndpoint || !containers.length) return;

  try {
    const response = await fetch(rhythm.programsEndpoint);
    if (!response.ok) throw new Error("Rhythm programs request failed");
    const programs = await response.json();
    if (!Array.isArray(programs) || programs.length === 0) return;

    const markup = programs
      .map((program) =>
        programCard({
          title: program.title,
          label: program.label || "Program",
          body: program.description || "",
        }),
      )
      .join("");

    containers.forEach((container) => {
      container.innerHTML = markup;
    });
  } catch (error) {
    console.info("Rhythm integration is configured but unavailable.", error);
  }
}

function initHeroCanvas() {
  const canvas = document.querySelector("[data-place-canvas]");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const pointer = { x: 0.5, y: 0.5 };
  let width = 0;
  let height = 0;
  let dpr = window.devicePixelRatio || 1;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    dpr = window.devicePixelRatio || 1;
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  const drawHill = (points, fill) => {
    ctx.beginPath();
    ctx.moveTo(0, height);
    points.forEach(([x, y], index) => {
      if (index === 0) ctx.lineTo(x, y);
      else ctx.quadraticCurveTo(points[index - 1][0] + width * 0.12, points[index - 1][1] - 18, x, y);
    });
    ctx.lineTo(width, height);
    ctx.closePath();
    ctx.fillStyle = fill;
    ctx.fill();
  };

  const draw = (time) => {
    const drift = Math.sin(time / 4200) * 6;
    const px = (pointer.x - 0.5) * 18;
    const py = (pointer.y - 0.5) * 12;

    const sky = ctx.createLinearGradient(0, 0, 0, height);
    sky.addColorStop(0, "#cfe5df");
    sky.addColorStop(0.45, "#f3dfbd");
    sky.addColorStop(1, "#7fa389");
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, width, height);

    ctx.globalAlpha = 0.82;
    ctx.beginPath();
    ctx.arc(width * 0.77 + px * 0.35, height * 0.24 + py * 0.2, Math.max(width, height) * 0.085, 0, Math.PI * 2);
    ctx.fillStyle = "#f2bd6b";
    ctx.fill();
    ctx.globalAlpha = 1;

    drawHill(
      [
        [-20, height * 0.58 + drift + py * 0.2],
        [width * 0.22, height * 0.47 + py * 0.2],
        [width * 0.48, height * 0.55 + drift],
        [width * 0.72, height * 0.45 + py * 0.1],
        [width + 20, height * 0.55 + drift],
      ],
      "#658b6f",
    );

    drawHill(
      [
        [-20, height * 0.7 + py * 0.35],
        [width * 0.18, height * 0.62 + drift],
        [width * 0.44, height * 0.69 + py * 0.2],
        [width * 0.67, height * 0.61 + drift],
        [width + 20, height * 0.72 + py * 0.2],
      ],
      "#416c59",
    );

    drawHill(
      [
        [-20, height * 0.84],
        [width * 0.2, height * 0.76 + py * 0.12],
        [width * 0.45, height * 0.82],
        [width * 0.73, height * 0.75 + py * 0.1],
        [width + 20, height * 0.83],
      ],
      "#254b3e",
    );

    drawPath(width, height, px);
    drawHouse(width, height, px, py);
    drawTrees(width, height, time, px);

    window.requestAnimationFrame(draw);
  };

  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = (event.clientX - rect.left) / rect.width;
    pointer.y = (event.clientY - rect.top) / rect.height;
  });

  window.addEventListener("resize", resize);
  resize();
  window.requestAnimationFrame(draw);
}

function drawPath(width, height, px) {
  const ctx = document.querySelector("[data-place-canvas]").getContext("2d");
  ctx.beginPath();
  ctx.moveTo(width * 0.53 + px * 0.2, height * 0.73);
  ctx.bezierCurveTo(width * 0.49, height * 0.82, width * 0.43, height * 0.91, width * 0.38, height);
  ctx.lineTo(width * 0.58, height);
  ctx.bezierCurveTo(width * 0.55, height * 0.91, width * 0.56, height * 0.82, width * 0.59 + px * 0.15, height * 0.73);
  ctx.closePath();
  ctx.fillStyle = "rgba(237, 214, 170, 0.72)";
  ctx.fill();
}

function drawHouse(width, height, px, py) {
  const canvas = document.querySelector("[data-place-canvas]");
  const ctx = canvas.getContext("2d");
  const x = width * 0.58 + px * 0.42;
  const y = height * 0.58 + py * 0.16;
  const w = Math.max(120, width * 0.18);
  const h = Math.max(70, height * 0.12);

  ctx.fillStyle = "#f7f0df";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = "#9d5039";
  ctx.beginPath();
  ctx.moveTo(x - w * 0.08, y + h * 0.05);
  ctx.lineTo(x + w * 0.5, y - h * 0.55);
  ctx.lineTo(x + w * 1.08, y + h * 0.05);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#26483e";
  ctx.fillRect(x + w * 0.12, y + h * 0.32, w * 0.18, h * 0.22);
  ctx.fillRect(x + w * 0.7, y + h * 0.32, w * 0.18, h * 0.22);
  ctx.fillStyle = "#6d7f60";
  ctx.fillRect(x + w * 0.43, y + h * 0.42, w * 0.16, h * 0.58);
}

function drawTrees(width, height, time, px) {
  const canvas = document.querySelector("[data-place-canvas]");
  const ctx = canvas.getContext("2d");
  const trees = [
    [0.17, 0.7, 18],
    [0.25, 0.73, 14],
    [0.34, 0.68, 20],
    [0.74, 0.68, 16],
    [0.82, 0.72, 21],
    [0.9, 0.69, 15],
  ];

  trees.forEach(([tx, ty, size], index) => {
    const sway = Math.sin(time / 1600 + index) * 2 + px * 0.08;
    const x = width * tx + sway;
    const y = height * ty;
    ctx.fillStyle = "#6b563f";
    ctx.fillRect(x - 2, y, 4, size * 1.2);
    ctx.beginPath();
    ctx.arc(x, y - size * 0.22, size, 0, Math.PI * 2);
    ctx.fillStyle = index % 2 ? "#2d5b48" : "#476f45";
    ctx.fill();
  });
}
