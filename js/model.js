/* =====================================================================
   MODEL — the data and state of the app. Never touches the DOM.
   Edit your content here: featured projects, skills, image overrides.
   ===================================================================== */

const Model = {

  githubUser: "INeoBYTEI",

  // Where the contact form delivers (via formsubmit.co relay)
  contactEmail: "neolgv78@gmail.com",

  // App state (read/written by the Controller, displayed by the View)
  state: {
    screen: "home",        // which screen is showing
    menuIndex: 0,          // selected item on the home menu
    reposLoaded: false,
    skillsBuilt: false,
  },

  // ---- Featured projects (hand-written, shown above the GitHub feed) ----
  featured: [
    {
      title: "Project Overdrive",
      tag: "In Development", color: "#f1e05a",
      url: "https://yrgo.itch.io/overdrive", cta: "Details →",
      img: "assets/projects/bsl.png",
      desc: "A high-speed sci-fi action platformer where you build momentum through fluid movement and high-octane combat while facing colossal creatures.",
      role: "Game Director · Gameplay Programming · Game Feel/Juice",
      work: `
          <figure class="about-photo">
            <img src="assets/PO_Banner.jpg" alt="Neo Garcia Velazco" onerror="this.parentElement.remove()">
          </figure>

          <p>I am a <strong>Game Programmer and Game Developer</strong> currently studying Game Programming 
            at Yrgo. I previously studied Software Engineering at Blekinge Institute of Technology, but my 
            passion has always been games. I have been making games as a hobby since I was 13, experimenting 
            with programming, mechanics, and design long before I knew where those interests would take me.
          </p>
          <br><br><br>
          <figure class="about-photo">
            <img src="assets/PO_Kill.gif" alt="Neo Garcia Velazco" onerror="this.parentElement.remove()">
          </figure>
          <p>At Yrgo, I have had the opportunity to take that passion into larger team projects. I served as 
            <span class="stamp">Game Director</span> for both <strong>Chaos Courier</strong> and 
            <strong>Project Overdrive</strong>, leading their development from concept through production and 
            submission. These projects have allowed me to explore the parts of game development I enjoy most: 
            <strong>gameplay, game feel, juice, player fantasy, and creating experiences with a strong visual 
              and mechanical identity.</strong> Both projects are available to play on itch.io.
          </p>
          <br><br><br>
      `
    },
    {
      title: "Chaos Courier",
      tag: "Unity", color: "#5a96f1",
      url: "https://yrgo.itch.io/chaos-courier", cta: "Details →",
      img: "assets/projects/downloadguard.png",
      desc: "A fast-paced game about causing chaos and sucking everything.",
      role: "Game Director · Lead Programmer · Game Feel/Juice",
      work: `
          <figure class="about-photo">
            <img src="assets/CC_Poster.png" alt="Neo Garcia Velazco" onerror="this.parentElement.remove()">
          </figure>

          <p>I am a <strong>Game Programmer and Game Developer</strong> currently studying Game Programming 
            at Yrgo. I previously studied Software Engineering at Blekinge Institute of Technology, but my 
            passion has always been games. I have been making games as a hobby since I was 13, experimenting 
            with programming, mechanics, and design long before I knew where those interests would take me.
          </p>
          <br>
          
          <p>At Yrgo, I have had the opportunity to take that passion into larger team projects. I served as 
            <span class="stamp">Game Director</span> for both <strong>Chaos Courier</strong> and 
            <strong>Project Overdrive</strong>, leading their development from concept through production and 
            submission. These projects have allowed me to explore the parts of game development I enjoy most: 
            <strong>gameplay, game feel, juice, player fantasy, and creating experiences with a strong visual 
              and mechanical identity.</strong> Both projects are available to play on itch.io.
          </p>
      `
    }
  ],

  // Repos already shown in "featured" get hidden from the GitHub feed
  featuredRepoNames: [
    
  ],

  // Shown if the GitHub API can't be reached
  fallbackRepos: [

  ],

  // Optional thumbnail overrides: repo name → image path.
  // Anything not listed is looked up at assets/projects/<RepoName>.png
  projectImages: {
    // "DownloadGuard": "assets/projects/downloadguard.png",
  },

  langColors: {
    JavaScript: "#f1e05a", TypeScript: "#3178c6", Python: "#3572A5",
    PHP: "#4F5D95", CSS: "#663399", HTML: "#e34c26",
    "Jupyter Notebook": "#DA5B0B", MATLAB: "#e16737", Java: "#b07219", C: "#555", "C++": "#f34b7d",
  },

  // ---- Skills screen ----
  skills: [

  { group: "Game Development", items: [
    ["Unity", 92],
    ["C# · Gameplay Programming", 90],
    ["Unreal Engine", 73],
    ["C++ · Gameplay Programming", 69],
    ["Game Feel · Juice", 93],
    ["Gameplay Design", 88],
    ["Player Fantasy", 88],
    ["Game Systems", 86],
  ]},

  { group: "Game Design & Direction", items: [
    ["Game Direction", 88],
    ["Team Leadership", 88],
    ["Combat & Enemy Design", 82],
    ["Movement Design", 86],
    ["Boss Design", 84],
    ["Narrative Design", 72],
  ]},

  { group: "Technical Skills", items: [
    ["Git · GitHub", 88],
    ["Game Optimization", 82],
    ["Game AI", 78],
    ["VFX · Visual Scripting", 78],
    ["Shader Graph", 72],
  ]},

  { group: "Programming", items: [
    ["C#", 92],
    ["C++", 69],
    ["Python", 62],
    ["JavaScript", 60],
    ["HTML · CSS", 65],
    ["PHP", 55],
  ]},

  { group: "Web & Other", items: [
    ["Web Development", 62],
    ["UI / UX", 68],
    ["Project Management", 82],
    ["Presentation · Pitching", 82],
  ]},

],

  // ---- Data fetching ----
  async fetchRepos() {
    const skip = new Set(this.featuredRepoNames);
    try {
      const res = await fetch(
        `https://api.github.com/users/${this.githubUser}/repos?per_page=100&sort=updated`
      );
      if (!res.ok) throw new Error(res.status);
      const repos = (await res.json()).filter(r => !r.fork && !skip.has(r.name));
      return { repos, live: true };
    } catch {
      return { repos: this.fallbackRepos.filter(r => !skip.has(r.name)), live: false };
    }
  },
};
