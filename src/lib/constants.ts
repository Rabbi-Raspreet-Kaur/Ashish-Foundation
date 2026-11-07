// ============================================================
// Ashish Foundation — Central Data Constants
// All placeholder data is clearly marked. Replace with verified
// foundation data before production deployment.
// ============================================================

export const SITE = {
  name: "Ashish Foundation",
  tagline: "Creating Opportunities. Changing Lives.",
  description:
    "Ashish Foundation works towards a more educated, empowered and inclusive society where every individual can live with dignity.",
  location: "Ayodhya, Uttar Pradesh, India",
  email: "contact@ashishfoundation.org", // placeholder
  phone: "+91 82990 52548",
  address: "Ayodhya, Uttar Pradesh, India", // placeholder
  social: {
    facebook: "#",
    instagram: "#",
    twitter: "#",
    youtube: "#",
    linkedin: "#",
  },
} as const;

// ============================================================
// Impact Statistics — PLACEHOLDER VALUES
// Replace with verified foundation records.
// ============================================================
export const IMPACT_STATS = [
  { value: 500, suffix: "+", label: "Children Supported" },
  { value: 100, suffix: "+", label: "Families Reached" },
  { value: 50, suffix: "+", label: "Community Initiatives" },
  { value: 1000, suffix: "+", label: "Lives Touched" },
] as const;

// ============================================================
// Programmes / Our Work
// ============================================================
export const PROGRAMMES = [
  {
    id: "education",
    title: "Education",
    description:
      "Provide educational opportunities and support for children from disadvantaged backgrounds, including learning materials and other educational assistance.",
    image: "/images/education.jpg",
    icon: "GraduationCap" as const,
  },
  {
    id: "inclusive-support",
    title: "Inclusive Support",
    description:
      "Support persons with disabilities and promote opportunities for greater independence and participation in society.",
    image: "/images/inclusive-support.jpg",
    icon: "Heart" as const,
  },
  {
    id: "women-empowerment",
    title: "Women Empowerment",
    description:
      "Promote women's education, awareness and opportunities for self-reliance.",
    image: "/images/women-empowerment.jpg",
    icon: "Users" as const,
  },
  {
    id: "skill-development",
    title: "Skill Development",
    description:
      "Provide vocational and technical training, including areas such as stitching, embroidery and other practical skills.",
    image: "/images/skill-development.jpg",
    icon: "Wrench" as const,
  },
  {
    id: "healthcare",
    title: "Healthcare",
    description:
      "Support awareness and access to healthcare for people who need assistance.",
    image: "/images/healthcare-camp.jpg",
    icon: "Stethoscope" as const,
  },
  {
    id: "community-relief",
    title: "Community & Relief",
    description:
      "Support vulnerable communities during difficult circumstances, including disaster situations, food/clothing distribution and other forms of assistance.",
    image: "/images/community-support.jpg",
    icon: "HandHeart" as const,
  },
] as const;

// ============================================================
// Mission Values
// ============================================================
export const VALUES = [
  {
    title: "Education",
    description: "Opening doors through learning and knowledge.",
    icon: "BookOpen" as const,
  },
  {
    title: "Equality",
    description: "Ensuring fair opportunities for everyone.",
    icon: "Scale" as const,
  },
  {
    title: "Empowerment",
    description: "Building capacity for self-reliance.",
    icon: "Sparkles" as const,
  },
  {
    title: "Dignity",
    description: "Respecting every individual's inherent worth.",
    icon: "Shield" as const,
  },
] as const;

// ============================================================
// Journey Steps — "One Life. One Journey."
// ============================================================
export const JOURNEY_STEPS = [
  {
    title: "Discover",
    description: "Identify individuals and communities who need support.",
    icon: "Search" as const,
  },
  {
    title: "Educate",
    description: "Provide access to learning and knowledge.",
    icon: "BookOpen" as const,
  },
  {
    title: "Support",
    description: "Offer resources and care where it matters most.",
    icon: "Heart" as const,
  },
  {
    title: "Build Skills",
    description: "Enable vocational and life skills training.",
    icon: "Wrench" as const,
  },
  {
    title: "Empower",
    description: "Foster confidence, independence and leadership.",
    icon: "Zap" as const,
  },
  {
    title: "Independence",
    description: "Celebrate self-sufficiency and lasting change.",
    icon: "Sun" as const,
  },
] as const;

// ============================================================
// Stories of Change
// ============================================================
export const STORIES = [
  {
    id: "story-1",
    title: "Community Relief & Education Support",
    location: "Ayodhya, Uttar Pradesh",
    programme: "Community Relief",
    image: "/images/community-relief.jpg",
    tagline: "From Need to Opportunity",
    before:
      "Before receiving support, accessing quality education and learning materials was a significant challenge.",
    after:
      "Today, with the foundation's support, new educational opportunities have opened doors to a brighter future.",
  },
  {
    id: "story-2",
    title: "Healthcare Camp & Skill Development",
    location: "Ayodhya, Uttar Pradesh",
    programme: "Healthcare Camp",
    image: "/images/healthcare-camp.jpg",
    tagline: "From Learning to Earning",
    before:
      "Before joining the skill development programme, finding sustainable livelihood opportunities was difficult.",
    after:
      "Today, with newly acquired skills in stitching and embroidery, steps towards self-reliance have begun.",
  },
] as const;

// ============================================================
// Events — PLACEHOLDER
// Replace with real events.
// ============================================================
export const EVENTS = [
  {
    id: "event-1",
    title: "Community Relief Drive",
    date: "Completed",
    location: "Ayodhya, UP",
    description:
      "Distribution of food rations, essentials and learning materials to families from underserved communities under the Ashish Foundation banner.",
    image: "/images/community-relief.jpg",
  },
  {
    id: "event-2",
    title: "Free Dental Checkup Camp",
    date: "23 April 2026",
    location: "Composite Junior High School, Usru, UP",
    description:
      "Free dental checkup camp organised by Ashish Foundation — providing dental examination, scaling, and free consultation to children and community members.",
    image: "/images/healthcare-camp.jpg",
  },
  {
    id: "event-3",
    title: "Nagrik Prathmik Swasthya Kendra Initiative",
    date: "Completed",
    location: "Retiya, Ayodhya, UP",
    description:
      "Ashish Foundation team visit and coordination at Nagrik Prathmik Swasthya Kendra, Retiya Ayodhya — promoting community health awareness.",
    image: "/images/inclusive-support.jpg",
  },
  {
    id: "event-4",
    title: "Free Medical Camp",
    date: "Completed",
    location: "Ayodhya, UP",
    description:
      "Ashish Foundation organised a free medical camp providing health consultations and medicines to community members in need.",
    image: "/images/skill-development.jpg",
  },
  {
    id: "event-5",
    title: "Children's Hygiene Awareness",
    date: "Completed",
    location: "Ayodhya, UP",
    description:
      "Hands-on hygiene and sanitation awareness activity for children, promoting good health practices in the community.",
    image: "/images/children-hygiene.png",
  },
] as const;

// ============================================================
// Leadership — PLACEHOLDER
// Replace with actual leadership data.
// Do NOT display private addresses or personal phone numbers.
// ============================================================
export const LEADERSHIP = [
  {
    name: "Ashish Kaur",
    role: "President",
    bio: "Leading the foundation's mission to create opportunities and empower communities.",
    image: null,
  },
  {
    name: "Paramveer Singh",
    role: "Vice President",
    bio: "Supporting strategic initiatives and community engagement programmes.",
    image: null,
  },
  {
    name: "Inder Singh Bedi",
    role: "Treasurer",
    bio: "Ensuring transparent financial management and accountability.",
    image: null,
  },
  {
    name: "Neelam Srivastava",
    role: "Secretary",
    bio: "Coordinating organizational activities and communication.",
    image: null,
  },
] as const;

// ============================================================
// Donation amounts
// ============================================================
export const DONATION_AMOUNTS = [500, 1000, 2500, 5000] as const;

// ============================================================
// Gallery categories
// ============================================================
export const GALLERY_CATEGORIES = [
  "All",
  "Education",
  "Community",
  "Events",
  "Healthcare",
  "Women Empowerment",
  "Volunteers",
] as const;

export const GALLERY_IMAGES = [
  { src: "/images/community-relief.jpg", alt: "Ashish Foundation food & essentials distribution to community", category: "Community" },
  { src: "/images/healthcare-camp.jpg", alt: "Free Dental Checkup Camp organised by Ashish Foundation", category: "Healthcare" },
  { src: "/images/hero-bg.jpg", alt: "Ashish Foundation team at Nagrik Prathmik Swasthya Kendra, Retiya Ayodhya", category: "Volunteers" },
  { src: "/images/skill-development.jpg", alt: "Ashish Foundation Free Medical Camp", category: "Healthcare" },
  { src: "/images/education.jpg", alt: "Education and classroom learning support by Ashish Foundation", category: "Education" },
  { src: "/images/women-empowerment.jpg", alt: "Women empowerment and community relief initiative", category: "Women Empowerment" },
  { src: "/images/inclusive-support.jpg", alt: "Ashish Foundation inclusive support and health outreach", category: "Community" },
] as const;

// ============================================================
// Navigation
// ============================================================
export const NAV_LINKS = [
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/#our-work" },
  { label: "Impact", href: "/#impact" },
  { label: "Stories", href: "/#stories" },
  { label: "Events", href: "/#events" },
  { label: "Gallery", href: "/gallery" },
  { label: "Transparency", href: "/transparency" },
  { label: "Contact", href: "/contact" },
] as const;

// ============================================================
// Transparency documents — PLACEHOLDER
// ============================================================
export const TRANSPARENCY_DOCS = [
  { title: "Registration Certificate", description: "Foundation registration documentation", available: false },
  { title: "Annual Reports", description: "Yearly activity and financial reports", available: false },
  { title: "Activity Reports", description: "Programme-wise activity documentation", available: false },
  { title: "Financial Reports", description: "Audited financial statements", available: false },
  { title: "Programme Updates", description: "Latest programme progress reports", available: false },
  { title: "Official Notices", description: "Important organizational notices", available: false },
] as const;
