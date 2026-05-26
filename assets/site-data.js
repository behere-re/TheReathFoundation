export const siteContent = {
  name: "The Reath Foundation",
  url: "https://thereath.com",
  email: "hello@thereath.com",
  tagline: "Place-based learning, family enrichment, and community renewal.",
  integrations: {
    beehiiv: {
      enabled: false,
      publicationName: "The Reath Field Notes",
      postsEndpoint: "",
      subscribeEndpoint: "",
      publicationId: "",
    },
    rhythm: {
      enabled: false,
      organizationSlug: "the-reath-foundation",
      programsEndpoint: "",
      gatheringsEndpoint: "",
      scholarshipsEndpoint: "",
    },
    support: {
      donationUrl: "",
      restorationUrl: "",
      partnerUrl: "",
    },
  },
  nav: [
    { label: "Mission", href: "/mission/" },
    { label: "Programs", href: "/programs/" },
    { label: "Havilah House", href: "/havilah-house/" },
    { label: "Field Notes", href: "/field-notes/" },
    { label: "Support", href: "/support/" },
    { label: "Partners", href: "/partners/" },
    { label: "About", href: "/about/" },
  ],
  home: {
    hero: {
      eyebrow: "The Reath Foundation",
      title:
        "A foundation for place-based learning, family enrichment, and community renewal.",
      body:
        "The Reath Foundation is the nonprofit expression of a mission seeded by Bēhere and carried forward with Rhythm: helping families, educators, and local partners build living learning communities rooted in real places.",
      primaryCta: { label: "Read the mission", href: "/mission/" },
      secondaryCta: { label: "Support the restoration", href: "/support/" },
    },
    mission: {
      kicker: "Mission",
      title: "A nonprofit steward for a new education economy.",
      body:
        "We connect education, family life, local culture, scholarships, and the renewal of physical spaces. Our work begins with the belief that learning communities need homes, rituals, mentors, access, and durable civic trust.",
      points: [
        "Place-based education that treats towns, landscapes, and local histories as living classrooms.",
        "Family enrichment through gatherings, circles, seasonal programs, and intergenerational support.",
        "Scholarship pathways that make participation possible for more families and learners.",
        "Restoration projects that turn neglected spaces into homes for learning, hospitality, and renewal.",
      ],
    },
    firstChapter: {
      kicker: "First chapter",
      title: "Santa Ynez Valley and Havilah House.",
      body:
        "The first visible chapter is emerging in the Santa Ynez Valley through the restoration of Havilah House, also known as The Reath. The house is imagined as a hospitable base for learning circles, family meals, restorative work, retreats, apprenticeships, and local partnerships.",
      href: "/havilah-house/",
    },
    scholarships: {
      kicker: "Scholarships and access",
      title: "Access is part of the architecture.",
      body:
        "The foundation can receive gifts, fund scholarships, sponsor programs, and underwrite restoration work so that families and learners are not limited by who can pay full cost on day one.",
      href: "/support/",
    },
  },
  programs: [
    {
      title: "Learning Circles",
      label: "Education",
      body:
        "Small cohorts for children, teens, and families that combine local mentors, guided projects, field study, and shared reflection.",
    },
    {
      title: "Family Enrichment",
      label: "Families",
      body:
        "Meals, workshops, parent conversations, seasonal rhythms, and hospitality designed to strengthen family culture without adding more noise.",
    },
    {
      title: "Community Gatherings",
      label: "Belonging",
      body:
        "Public lectures, salons, open houses, celebrations, and service days that help neighbors move from proximity to shared purpose.",
    },
    {
      title: "Scholarship Pathways",
      label: "Access",
      body:
        "Donor-supported tuition assistance, program sponsorships, and access funds for families, students, and emerging educators.",
    },
    {
      title: "Restoration Apprenticeships",
      label: "Stewardship",
      body:
        "Hands-on learning around craft, land care, hospitality, building renewal, archival work, and practical community service.",
    },
    {
      title: "Partner Programs",
      label: "Networks",
      body:
        "White-glove support for schools, churches, family networks, studios, and civic partners creating local learning ecosystems.",
    },
  ],
  fieldSeries: [
    {
      title: "RE Papers",
      slug: "re-papers",
      body:
        "Short papers on education, renewal, design, technology, place, economics, and the future of learning communities.",
    },
    {
      title: "Bēhere Archive",
      slug: "behere-archive",
      body:
        "Selected origin notes from Bēhere, the seedbed and technology partner behind Rhythm.",
    },
    {
      title: "Family Stories",
      slug: "family-stories",
      body:
        "Stories from families, learners, mentors, and hosts building richer lives around shared learning.",
    },
    {
      title: "Restoration Notes",
      slug: "restoration-notes",
      body:
        "Updates from Havilah House and other spaces being renewed for hospitality, learning, and civic life.",
    },
    {
      title: "Conversations",
      slug: "conversations",
      body:
        "Dialogues with educators, builders, founders, artists, donors, and local stewards.",
    },
    {
      title: "Program Notes",
      slug: "program-notes",
      body:
        "Reflections and dispatches from gatherings, cohorts, pilot programs, and community experiments.",
    },
  ],
  fieldNotes: [
    {
      title: "Place as an Education System",
      series: "RE Papers",
      slug: "re-papers",
      date: "Launch series",
      body:
        "A working paper on why towns, homes, landscapes, and local institutions belong inside the future of education.",
    },
    {
      title: "From Bēhere to Rhythm",
      series: "Bēhere Archive",
      slug: "behere-archive",
      date: "Origin note",
      body:
        "How the early design work behind Bēhere grew into Rhythm, the operating system for learning communities.",
    },
    {
      title: "Opening the Havilah Chapter",
      series: "Restoration Notes",
      slug: "restoration-notes",
      date: "Restoration log",
      body:
        "A field note from the first restoration chapter in the Santa Ynez Valley.",
    },
    {
      title: "A Saturday Around the Table",
      series: "Family Stories",
      slug: "family-stories",
      date: "Family story",
      body:
        "A story about hospitality, children, mentors, and the small rituals that make learning feel alive.",
    },
    {
      title: "What Local Partners Make Possible",
      series: "Conversations",
      slug: "conversations",
      date: "Conversation",
      body:
        "A conversation starter for civic leaders, schools, artists, builders, and donors.",
    },
    {
      title: "Designing a Pilot Gathering",
      series: "Program Notes",
      slug: "program-notes",
      date: "Program note",
      body:
        "Notes on the shape of a first gathering: invitation, meals, learning blocks, service, and reflection.",
    },
  ],
  restorationPhases: [
    {
      title: "Listen and document",
      body:
        "Gather the history, constraints, stories, needs, and hopes around the house and the local community.",
    },
    {
      title: "Stabilize and restore",
      body:
        "Address practical building needs, site readiness, safety, hospitality, and the first restoration priorities.",
    },
    {
      title: "Host and learn",
      body:
        "Begin small gatherings, circles, meals, workshops, and restoration days that help the house become useful early.",
    },
    {
      title: "Steward long term",
      body:
        "Build the rhythms, partnerships, scholarship funds, and operating model that allow the place to keep serving.",
    },
  ],
  supportOptions: [
    {
      title: "Restoration gifts",
      body:
        "Help renew Havilah House into a hospitable home for learning, gatherings, mentoring, and restoration work.",
      action: "Start a restoration gift conversation",
      href: "mailto:hello@thereath.com?subject=Restoration%20Gift",
    },
    {
      title: "Scholarship fund",
      body:
        "Make programs accessible for families, students, and emerging educators who need partial or full support.",
      action: "Ask about scholarships",
      href: "mailto:hello@thereath.com?subject=Scholarship%20Fund",
    },
    {
      title: "Program underwriting",
      body:
        "Sponsor gatherings, field study, family enrichment, mentor circles, and early pilot programs.",
      action: "Underwrite a program",
      href: "mailto:hello@thereath.com?subject=Program%20Underwriting",
    },
  ],
  partnerPaths: [
    {
      title: "Education partners",
      body:
        "Schools, microschools, homeschool networks, educators, and mentors building local learning communities.",
    },
    {
      title: "Civic and cultural partners",
      body:
        "Museums, libraries, farms, studios, churches, businesses, and civic institutions with a stake in local renewal.",
    },
    {
      title: "Restoration partners",
      body:
        "Architects, builders, craftspeople, historians, land stewards, and donors who can help renew physical spaces.",
    },
    {
      title: "Technology partners",
      body:
        "Bēhere and Rhythm help translate local programs into systems, records, workflows, and thoughtful digital infrastructure.",
    },
  ],
};
