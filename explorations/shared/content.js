/*
 * ONE FILE PER CONFERENCE YEAR.
 * Every design alternative renders from this object. To spin up a new year,
 * copy this file, change the values, and (optionally) the two theme colors.
 *
 * Dates are ISO strings. A range is "start/end". Deadlines are 23:59 AoE.
 * Content below is taken from 2027.sigmod.org (Nov 2026). Items marked
 * `sample: true` are placeholders used only to show layout.
 */
window.CONF = {
  year: 2027,
  edition: "ACM SIGMOD/PODS 2027",
  fullName: "ACM SIGMOD/PODS International Conference on Management of Data",
  city: "Huntington Beach",
  region: "California, USA",
  start: "2027-06-13",
  end: "2027-06-18",
  venue: {
    name: "Hyatt Regency Huntington Beach Resort and Spa",
    address: "21500 Pacific Coast Highway, Huntington Beach, CA 92648, USA",
    airports: ["John Wayne (SNA)", "Long Beach (LGB)", "Los Angeles (LAX)"],
  },
  // Per-year accent. Everything else stays SIGMOD navy/ink.
  theme: { accent: "#0f766e", accentSoft: "#e6f4f2", warm: "#c2410c" },
  social: { x: "https://x.com/SIGMODConf", linkedin: "#", bluesky: "#" },

  intro:
    "The annual ACM SIGMOD/PODS Conference is a leading international forum for database researchers, practitioners, developers, and users to explore cutting-edge ideas and results, and to exchange techniques, tools, and experiences.",
  introMore:
    "The program includes research and industrial talks, tutorials, demonstrations, focused workshops, a poster session, an industrial exhibition, and a careers-in-industry panel.",

  news: [
    { text: "Call for Tutorial Proposals is out — proposals due December 20, 2026.", href: "#", tag: "SIGMOD" },
    { text: "Demonstration track deadlines moved earlier: submission now January 11, 2027.", href: "dates.html", tag: "Update" },
    { text: "Conference hotel room block is open at the Hyatt Regency Huntington Beach.", href: "#", tag: "Attend" },
  ],

  // Information architecture shared by all three alternatives.
  // Former sites kept parallel SIGMOD and PODS menus; here PODS is a track label inside each section.
  nav: [
    { label: "Attend", items: [
      ["Registration", "#"], ["Venue & hotel", "#"], ["Travel & visas", "#"],
      ["Childcare & accessibility", "#"], ["Student travel grants", "#"], ["Code of conduct", "#"] ] },
    { label: "Program", items: [
      ["Program at a glance", "#"], ["Detailed schedule", "#"], ["Keynotes", "#"],
      ["Accepted papers", "#"], ["Tutorials & panels", "#"], ["Workshops", "#"],
      ["Gems of PODS", "#"], ["Awards", "#"] ] },
    { label: "Submit", items: [
      ["Important dates", "dates.html"], ["SIGMOD research papers", "#"], ["PODS research papers", "#"],
      ["Industrial track", "#"], ["Demonstrations", "#"], ["Tutorials", "#"],
      ["Workshops", "#"], ["Reproducibility", "#"] ] },
    { label: "About", items: [
      ["Organizers", "#"], ["Program committees", "#"], ["Sponsors", "#"],
      ["Sponsorship opportunities", "#"], ["Inclusion & diversity", "#"], ["Past conferences", "https://sigmod.org/sigmod-pods-conferences/"] ] },
  ],

  deadlines: {
    tz: "AoE",
    tables: [
      {
        id: "sigmod-research", title: "SIGMOD research papers", track: "SIGMOD", cfp: "#",
        columns: ["Round 1", "Round 2", "Round 3", "Round 4"],
        rows: [
          { label: "Abstract & COI declaration", deadline: true, cells: ["2026-01-10", "2026-04-10", "2026-07-10", "2026-10-10"] },
          { label: "Paper submission", deadline: true, cells: ["2026-01-17", "2026-04-17", "2026-07-17", "2026-10-17"] },
          { label: "Author feedback", cells: ["2026-03-10/2026-03-17", "2026-06-10/2026-06-17", "2026-09-10/2026-09-17", "2026-12-10/2026-12-17"] },
          { label: "Accept / reject / revise", cells: ["2026-04-19", "2026-07-19", "2026-10-19", "2027-01-19"] },
          { label: "Revised paper due", deadline: true, cells: ["2026-05-19", "2026-08-19", "2026-11-19", "2027-02-19"] },
          { label: "Final notification", cells: ["2026-06-12", "2026-09-12", "2026-12-12", "2027-03-12"] },
        ],
      },
      {
        id: "pods-research", title: "PODS research papers", track: "PODS", cfp: "#",
        columns: ["Cycle 1", "Cycle 2"],
        rows: [
          { label: "Abstract submission", deadline: true, cells: ["2026-05-23", "2026-12-03"] },
          { label: "Full paper submission", deadline: true, cells: ["2026-05-30", "2026-12-10"] },
          { label: "Rebuttal", cells: ["2026-07-29/2026-08-01", "2027-01-26/2027-01-29"] },
          { label: "Initial notification", cells: ["2026-08-11", "2027-02-08"] },
          { label: "Revision due", deadline: true, cells: ["2026-08-25", "2027-02-22"] },
          { label: "Final notification", cells: ["2026-09-01", "2027-03-01"] },
        ],
      },
    ],
    lists: [
      { id: "industry", title: "Industrial track", track: "SIGMOD", cfp: "#", items: [
        { date: "2026-11-24", label: "Paper submission", deadline: true },
        { date: "2027-01-26", label: "Reviews released" },
        { date: "2027-02-23", label: "Revision submission", deadline: true },
        { date: "2027-03-04", label: "Notification" },
        { date: "2027-03-18", label: "Camera-ready", deadline: true } ] },
      { id: "tutorials", title: "Tutorials", track: "SIGMOD", cfp: "#", items: [
        { date: "2026-12-20", label: "Proposal submission", deadline: true },
        { date: "2027-02-01", label: "Notification" } ] },
      { id: "demos", title: "Demonstrations", track: "SIGMOD", cfp: "#", items: [
        { date: "2027-01-11", label: "Submission", deadline: true, was: "2027-01-15" },
        { date: "2027-01-12", label: "COI declaration", deadline: true, was: "2027-01-16" },
        { date: "2027-03-08", label: "Notification" },
        { date: "2027-04-01", label: "Camera-ready", deadline: true, was: "2027-04-02" } ] },
    ],
  },

  people: [
    { role: "SIGMOD General Chairs", key: true, list: [["Chen Li", "UC Irvine"], ["Cyrus Shahabi", "University of Southern California"]] },
    { role: "SIGMOD Program Chairs", key: true, list: [["Sourav S Bhowmick", "Nanyang Technological University"], ["Yuanyuan Tian", "Microsoft Gray Systems Lab"]] },
    { role: "PODS General Chair", key: true, list: [["Yufei Tao", "Chinese University of Hong Kong"]] },
    { role: "PODS Program Chair", key: true, list: [["Dan Olteanu", "University of Zurich"]] },
    { role: "Industrial Program Chairs", list: [["Bailu Ding", "Stealth Startup"], ["Divesh Srivastava", "AT&T Data Office"]] },
    { role: "Demonstration Chairs", list: [["Stefanie Scherzinger", "University of Passau"], ["Jun Yang", "Duke University"]] },
    { role: "Tutorial Chairs", list: [["Angela Bonifati", "Lyon 1 University"], ["Melanie Herschel", "NTU Singapore"]] },
    { role: "Local Arrangements Chair", list: [["Ibrahim Sabek", "University of Southern California"]] },
  ],

  keynotes: [
    { name: "H. V. Jagadish", aff: "University of Michigan", track: "SIGMOD", title: "SIGMOD keynote" },
    { name: "To be announced", aff: "", track: "SIGMOD", title: "SIGMOD keynote", tba: true },
    { name: "To be announced", aff: "", track: "PODS", title: "PODS keynote", tba: true },
  ],

  // Shape of the week. sample: true until the program committee publishes a real schedule.
  week: {
    sample: true,
    days: [
      { date: "2027-06-13", blocks: [["Workshops", "ws"], ["New Researcher Symposium", "ws"], ["Welcome reception", "social"]] },
      { date: "2027-06-14", blocks: [["Workshops", "ws"], ["PODS sessions", "pods"], ["Tutorials", "sigmod"]] },
      { date: "2027-06-15", blocks: [["Keynote", "plenary"], ["SIGMOD + PODS sessions", "sigmod"], ["Posters", "plenary"]] },
      { date: "2027-06-16", blocks: [["Keynote", "plenary"], ["SIGMOD sessions", "sigmod"], ["Banquet", "social"]] },
      { date: "2027-06-17", blocks: [["SIGMOD sessions", "sigmod"], ["Industry & demos", "sigmod"], ["Awards", "plenary"]] },
      { date: "2027-06-18", blocks: [["Workshops", "ws"]] },
    ],
  },

  sponsors: { sample: true, tiers: [["Diamond", 2], ["Platinum", 3], ["Gold", 4], ["Silver", 6]] },

  policy:
    "SIGMOD/PODS 2027 adheres to the ACM Policy Against Harassment. Anyone who experiences unacceptable behavior may contact any member of the SIGMOD or PODS Executive Committee, or DBCares, in confidence.",
};
