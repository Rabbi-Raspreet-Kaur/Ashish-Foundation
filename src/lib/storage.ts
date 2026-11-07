// ============================================================
// LocalStorage CRUD Utilities
// Manages local persistence for all Foundation and Admin entities
// ============================================================

import {
  PROGRAMMES,
  STORIES,
  IMPACT_STATS,
  TRANSPARENCY_DOCS,
  SITE,
} from "@/lib/constants";

export interface Donation {
  id: string;
  name: string;
  email: string;
  amount: number;
  date: string;
  status: "pending" | "completed";
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  date: string;
  read: boolean;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  date: string;
}

export interface StoredEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
  image: string;
  published?: boolean;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  date: string;
}

export interface GalleryImage {
  id?: string;
  src: string;
  alt: string;
  category: string;
  published?: boolean;
}

export interface StoredProgramme {
  id: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  published: boolean;
}

export interface StoredStory {
  id: string;
  title: string;
  location: string;
  programme: string;
  image: string;
  tagline: string;
  before: string;
  after: string;
  published: boolean;
}

export interface StoredImpactStat {
  id: string;
  label: string;
  value: number;
  suffix: string;
  verified: boolean;
}

export interface StoredTransparencyDoc {
  id: string;
  title: string;
  description: string;
  fileUrl?: string;
  available: boolean;
  published: boolean;
}

export interface StoredWebsiteSettings {
  name: string;
  tagline: string;
  description: string;
  location: string;
  email: string;
  phone: string;
  address: string;
  upiId: string;
  upiName: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
}

// ---- Generic helpers ----

function getItems<T>(key: string): T[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setItems<T>(key: string, items: T[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(items));
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---- Donations ----

const DONATIONS_KEY = "af_donations";

export function getDonations(): Donation[] {
  return getItems<Donation>(DONATIONS_KEY);
}

export function addDonation(
  data: Omit<Donation, "id" | "date" | "status"> & { status?: "pending" | "completed" }
): Donation {
  const donations = getDonations();
  const donation: Donation = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    // Default to pending - payments can only be confirmed after bank statement reconciliation
    status: data.status || "pending",
  };
  donations.unshift(donation);
  setItems(DONATIONS_KEY, donations);
  return donation;
}

export function updateDonationStatus(
  id: string,
  status: "pending" | "completed"
): Donation | null {
  const donations = getDonations();
  const index = donations.findIndex((d) => d.id === id);
  if (index === -1) return null;
  donations[index].status = status;
  setItems(DONATIONS_KEY, donations);
  return donations[index];
}

export function deleteDonation(id: string): void {
  const donations = getDonations().filter((d) => d.id !== id);
  setItems(DONATIONS_KEY, donations);
}

// ---- Contact Messages ----

const CONTACTS_KEY = "af_contacts";

export function getContacts(): ContactMessage[] {
  return getItems<ContactMessage>(CONTACTS_KEY);
}

export function addContact(data: Omit<ContactMessage, "id" | "date" | "read">): ContactMessage {
  const contacts = getContacts();
  const contact: ContactMessage = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
    read: false,
  };
  contacts.unshift(contact);
  setItems(CONTACTS_KEY, contacts);
  return contact;
}

export function markContactRead(id: string): void {
  const contacts = getContacts().map((c) =>
    c.id === id ? { ...c, read: true } : c
  );
  setItems(CONTACTS_KEY, contacts);
}

export function deleteContact(id: string): void {
  const contacts = getContacts().filter((c) => c.id !== id);
  setItems(CONTACTS_KEY, contacts);
}

// ---- Volunteers ----

const VOLUNTEERS_KEY = "af_volunteers";

export function getVolunteers(): Volunteer[] {
  return getItems<Volunteer>(VOLUNTEERS_KEY);
}

export function addVolunteer(data: Omit<Volunteer, "id" | "date">): Volunteer {
  const volunteers = getVolunteers();
  const volunteer: Volunteer = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  volunteers.unshift(volunteer);
  setItems(VOLUNTEERS_KEY, volunteers);
  return volunteer;
}

export function deleteVolunteer(id: string): void {
  const volunteers = getVolunteers().filter((v) => v.id !== id);
  setItems(VOLUNTEERS_KEY, volunteers);
}

// ---- Events ----

const EVENTS_KEY = "af_events";

export function getStoredEvents(): StoredEvent[] {
  return getItems<StoredEvent>(EVENTS_KEY);
}

export function addStoredEvent(data: Omit<StoredEvent, "id">): StoredEvent {
  const events = getStoredEvents();
  const event: StoredEvent = {
    ...data,
    id: generateId(),
    published: data.published ?? true,
  };
  events.unshift(event);
  setItems(EVENTS_KEY, events);
  return event;
}

export function updateStoredEvent(id: string, data: Partial<StoredEvent>): void {
  const events = getStoredEvents().map((e) =>
    e.id === id ? { ...e, ...data } : e
  );
  setItems(EVENTS_KEY, events);
}

export function deleteStoredEvent(id: string): void {
  const events = getStoredEvents().filter((e) => e.id !== id);
  setItems(EVENTS_KEY, events);
}

// ---- Event Registrations ----

const EVENT_REGISTRATIONS_KEY = "af_event_registrations";

export function getEventRegistrations(): EventRegistration[] {
  return getItems<EventRegistration>(EVENT_REGISTRATIONS_KEY);
}

export function addEventRegistration(
  data: Omit<EventRegistration, "id" | "date">
): EventRegistration {
  const registrations = getEventRegistrations();
  const registration: EventRegistration = {
    ...data,
    id: generateId(),
    date: new Date().toISOString(),
  };
  registrations.unshift(registration);
  setItems(EVENT_REGISTRATIONS_KEY, registrations);
  return registration;
}

// ---- Gallery ----

const GALLERY_KEY = "af_gallery";

export function getStoredGallery(): GalleryImage[] {
  return getItems<GalleryImage>(GALLERY_KEY);
}

export function addGalleryImage(data: GalleryImage): void {
  const images = getStoredGallery();
  images.unshift({
    ...data,
    id: data.id || generateId(),
    published: data.published ?? true,
  });
  setItems(GALLERY_KEY, images);
}

export function removeGalleryImage(srcOrId: string): void {
  const images = getStoredGallery().filter((img) => img.src !== srcOrId && img.id !== srcOrId);
  setItems(GALLERY_KEY, images);
}

// ---- Programmes Management ----

const PROGRAMMES_KEY = "af_programmes";

export function getStoredProgrammes(): StoredProgramme[] {
  const items = getItems<StoredProgramme>(PROGRAMMES_KEY);
  if (items.length > 0) return items;

  // Initialize with default constants if empty
  const defaults: StoredProgramme[] = PROGRAMMES.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    image: p.image,
    icon: p.icon,
    published: true,
  }));
  setItems(PROGRAMMES_KEY, defaults);
  return defaults;
}

export function addStoredProgramme(data: Omit<StoredProgramme, "id">): StoredProgramme {
  const items = getStoredProgrammes();
  const prog: StoredProgramme = {
    ...data,
    id: "prog-" + generateId(),
    published: data.published ?? true,
  };
  items.push(prog);
  setItems(PROGRAMMES_KEY, items);
  return prog;
}

export function updateStoredProgramme(id: string, data: Partial<StoredProgramme>): void {
  const items = getStoredProgrammes().map((p) =>
    p.id === id ? { ...p, ...data } : p
  );
  setItems(PROGRAMMES_KEY, items);
}

export function deleteStoredProgramme(id: string): void {
  const items = getStoredProgrammes().filter((p) => p.id !== id);
  setItems(PROGRAMMES_KEY, items);
}

export function togglePublishProgramme(id: string): void {
  const items = getStoredProgrammes().map((p) =>
    p.id === id ? { ...p, published: !p.published } : p
  );
  setItems(PROGRAMMES_KEY, items);
}

// ---- Stories Management ----

const STORIES_KEY = "af_stories";

export function getStoredStories(): StoredStory[] {
  const items = getItems<StoredStory>(STORIES_KEY);
  if (items.length > 0) return items;

  const defaults: StoredStory[] = STORIES.map((s) => ({
    id: s.id,
    title: s.title,
    location: s.location,
    programme: s.programme,
    image: s.image,
    tagline: s.tagline,
    before: s.before,
    after: s.after,
    published: true,
  }));
  setItems(STORIES_KEY, defaults);
  return defaults;
}

export function addStoredStory(data: Omit<StoredStory, "id">): StoredStory {
  const items = getStoredStories();
  const story: StoredStory = {
    ...data,
    id: "story-" + generateId(),
    published: data.published ?? true,
  };
  items.unshift(story);
  setItems(STORIES_KEY, items);
  return story;
}

export function updateStoredStory(id: string, data: Partial<StoredStory>): void {
  const items = getStoredStories().map((s) =>
    s.id === id ? { ...s, ...data } : s
  );
  setItems(STORIES_KEY, items);
}

export function deleteStoredStory(id: string): void {
  const items = getStoredStories().filter((s) => s.id !== id);
  setItems(STORIES_KEY, items);
}

export function togglePublishStory(id: string): void {
  const items = getStoredStories().map((s) =>
    s.id === id ? { ...s, published: !s.published } : s
  );
  setItems(STORIES_KEY, items);
}

// ---- Impact Stats Management ----

const IMPACT_KEY = "af_impact_stats";

export function getStoredImpactStats(): StoredImpactStat[] {
  const items = getItems<StoredImpactStat>(IMPACT_KEY);
  if (items.length > 0) return items;

  const defaults: StoredImpactStat[] = IMPACT_STATS.map((stat, idx) => ({
    id: "impact-" + (idx + 1),
    label: stat.label,
    value: stat.value,
    suffix: stat.suffix,
    verified: true,
  }));
  setItems(IMPACT_KEY, defaults);
  return defaults;
}

export function updateStoredImpactStat(id: string, data: Partial<StoredImpactStat>): void {
  const items = getStoredImpactStats().map((s) =>
    s.id === id ? { ...s, ...data } : s
  );
  setItems(IMPACT_KEY, items);
}

export function addStoredImpactStat(data: Omit<StoredImpactStat, "id">): StoredImpactStat {
  const items = getStoredImpactStats();
  const newStat: StoredImpactStat = {
    ...data,
    id: "impact-" + generateId(),
    verified: data.verified ?? true,
  };
  items.push(newStat);
  setItems(IMPACT_KEY, items);
  return newStat;
}

export function deleteStoredImpactStat(id: string): void {
  const items = getStoredImpactStats().filter((s) => s.id !== id);
  setItems(IMPACT_KEY, items);
}

// ---- Transparency Documents Management ----

const TRANSPARENCY_KEY = "af_transparency_docs";

export function getStoredTransparencyDocs(): StoredTransparencyDoc[] {
  const items = getItems<StoredTransparencyDoc>(TRANSPARENCY_KEY);
  if (items.length > 0) return items;

  const defaults: StoredTransparencyDoc[] = TRANSPARENCY_DOCS.map((doc, idx) => ({
    id: "doc-" + (idx + 1),
    title: doc.title,
    description: doc.description,
    fileUrl: "",
    available: doc.available,
    published: true,
  }));
  setItems(TRANSPARENCY_KEY, defaults);
  return defaults;
}

export function addStoredTransparencyDoc(
  data: Omit<StoredTransparencyDoc, "id">
): StoredTransparencyDoc {
  const items = getStoredTransparencyDocs();
  const doc: StoredTransparencyDoc = {
    ...data,
    id: "doc-" + generateId(),
    available: data.available ?? false,
    published: data.published ?? true,
  };
  items.push(doc);
  setItems(TRANSPARENCY_KEY, items);
  return doc;
}

export function updateStoredTransparencyDoc(
  id: string,
  data: Partial<StoredTransparencyDoc>
): void {
  const items = getStoredTransparencyDocs().map((d) =>
    d.id === id ? { ...d, ...data } : d
  );
  setItems(TRANSPARENCY_KEY, items);
}

export function deleteStoredTransparencyDoc(id: string): void {
  const items = getStoredTransparencyDocs().filter((d) => d.id !== id);
  setItems(TRANSPARENCY_KEY, items);
}

export function togglePublishTransparencyDoc(id: string): void {
  const items = getStoredTransparencyDocs().map((d) =>
    d.id === id ? { ...d, published: !d.published } : d
  );
  setItems(TRANSPARENCY_KEY, items);
}

export function toggleAvailableTransparencyDoc(id: string): void {
  const items = getStoredTransparencyDocs().map((d) =>
    d.id === id ? { ...d, available: !d.available } : d
  );
  setItems(TRANSPARENCY_KEY, items);
}

// ---- Website Settings Management ----

const SETTINGS_KEY = "af_website_settings";

export function getStoredWebsiteSettings(): StoredWebsiteSettings {
  if (typeof window === "undefined") {
    return {
      name: SITE.name,
      tagline: SITE.tagline,
      description: SITE.description,
      location: SITE.location,
      email: SITE.email,
      phone: SITE.phone,
      address: SITE.address,
      upiId: "8299052548m@pnb",
      upiName: "Ashish Foundation",
      facebook: SITE.social.facebook,
      instagram: SITE.social.instagram,
      twitter: SITE.social.twitter,
      youtube: SITE.social.youtube,
    };
  }

  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}

  const defaults: StoredWebsiteSettings = {
    name: SITE.name,
    tagline: SITE.tagline,
    description: SITE.description,
    location: SITE.location,
    email: SITE.email,
    phone: SITE.phone,
    address: SITE.address,
    upiId: "8299052548m@pnb",
    upiName: "Ashish Foundation",
    facebook: SITE.social.facebook,
    instagram: SITE.social.instagram,
    twitter: SITE.social.twitter,
    youtube: SITE.social.youtube,
  };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(defaults));
  return defaults;
}

export function updateStoredWebsiteSettings(
  data: Partial<StoredWebsiteSettings>
): StoredWebsiteSettings {
  const current = getStoredWebsiteSettings();
  const updated = { ...current, ...data };
  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  }
  return updated;
}

// ---- Stats helpers for admin dashboard ----

export function getAdminStats() {
  const donations = getDonations();
  const completedDonations = donations.filter((d) => d.status === "completed");
  const pendingDonations = donations.filter((d) => d.status === "pending");

  return {
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    verifiedDonationAmount: completedDonations.reduce((sum, d) => sum + d.amount, 0),
    pendingDonationsCount: pendingDonations.length,
    completedDonationsCount: completedDonations.length,
    totalMessages: getContacts().length,
    unreadMessages: getContacts().filter((c) => !c.read).length,
    totalVolunteers: getVolunteers().length,
    totalEvents: getStoredEvents().length,
    totalRegistrations: getEventRegistrations().length,
    totalProgrammes: getStoredProgrammes().length,
    totalStories: getStoredStories().length,
  };
}
