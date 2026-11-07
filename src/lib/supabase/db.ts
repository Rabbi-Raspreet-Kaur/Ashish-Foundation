import { supabase, isSupabaseConfigured } from "./client";
import {
  getDonations as getLocalDonations,
  updateDonationStatus as updateLocalDonationStatus,
  deleteDonation as deleteLocalDonation,
  getContacts as getLocalContacts,
  markContactRead as markLocalContactRead,
  deleteContact as deleteLocalContact,
  getVolunteers as getLocalVolunteers,
  deleteVolunteer as deleteLocalVolunteer,
  getStoredEvents as getLocalStoredEvents,
  addStoredEvent as addLocalStoredEvent,
  updateStoredEvent as updateLocalStoredEvent,
  deleteStoredEvent as deleteLocalStoredEvent,
  getStoredGallery as getLocalStoredGallery,
  addGalleryImage as addLocalGalleryImage,
  removeGalleryImage as removeLocalGalleryImage,
  getEventRegistrations as getLocalEventRegistrations,
  getStoredProgrammes as getLocalStoredProgrammes,
  addStoredProgramme as addLocalStoredProgramme,
  updateStoredProgramme as updateLocalStoredProgramme,
  deleteStoredProgramme as deleteLocalStoredProgramme,
  togglePublishProgramme as toggleLocalPublishProgramme,
  getStoredStories as getLocalStoredStories,
  addStoredStory as addLocalStoredStory,
  updateStoredStory as updateLocalStoredStory,
  deleteStoredStory as deleteLocalStoredStory,
  togglePublishStory as toggleLocalPublishStory,
  getStoredImpactStats as getLocalStoredImpactStats,
  updateStoredImpactStat as updateLocalStoredImpactStat,
  addStoredImpactStat as addLocalStoredImpactStat,
  deleteStoredImpactStat as deleteLocalStoredImpactStat,
  getStoredTransparencyDocs as getLocalStoredTransparencyDocs,
  addStoredTransparencyDoc as addLocalStoredTransparencyDoc,
  updateStoredTransparencyDoc as updateLocalStoredTransparencyDoc,
  deleteStoredTransparencyDoc as deleteLocalStoredTransparencyDoc,
  togglePublishTransparencyDoc as toggleLocalPublishTransparencyDoc,
  toggleAvailableTransparencyDoc as toggleLocalAvailableTransparencyDoc,
  getStoredWebsiteSettings as getLocalStoredWebsiteSettings,
  updateStoredWebsiteSettings as updateLocalStoredWebsiteSettings,
  type Donation,
  type ContactMessage,
  type Volunteer,
  type StoredEvent,
  type GalleryImage,
  type StoredProgramme,
  type StoredStory,
  type StoredImpactStat,
  type StoredTransparencyDoc,
  type StoredWebsiteSettings,
} from "@/lib/storage";
import { EVENTS, STORIES, GALLERY_IMAGES, PROGRAMMES, IMPACT_STATS, TRANSPARENCY_DOCS } from "@/lib/constants";

// ============================================================
// Public Data Fetchers (Supabase first, graceful fallback)
// ============================================================

export async function fetchPublicEvents(): Promise<StoredEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("id, title, date, location, description, image, published, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          location: e.location,
          description: e.description,
          image: e.image,
          published: e.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch events, falling back to local:", err);
    }
  }

  // Fallback to local storage custom events + default constants (published only)
  const stored = getLocalStoredEvents().filter((e) => e.published !== false);
  return [
    ...stored,
    ...EVENTS.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      location: e.location,
      description: e.description,
      image: e.image,
      published: true,
    })),
  ];
}

export async function fetchPublicStories(): Promise<StoredStory[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          title: s.title,
          location: s.location,
          programme: s.programme,
          image: s.image,
          tagline: s.tagline,
          before: s.before_text,
          after: s.after_text,
          published: s.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch stories, falling back to local:", err);
    }
  }

  return getLocalStoredStories().filter((s) => s.published);
}

export async function fetchPublicGallery(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, src, alt, category, published, created_at")
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((img) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          category: img.category,
          published: img.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch gallery, falling back to local:", err);
    }
  }

  const stored = getLocalStoredGallery().filter((g) => g.published !== false);
  return [...stored, ...GALLERY_IMAGES.map((img) => ({ ...img, published: true }))];
}

export async function fetchPublicProgrammes(): Promise<StoredProgramme[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          icon: p.icon,
          published: p.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch programmes, falling back to local:", err);
    }
  }

  return getLocalStoredProgrammes().filter((p) => p.published);
}

export async function fetchPublicImpactStats(): Promise<StoredImpactStat[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .eq("verified", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((st) => ({
          id: st.id,
          label: st.label,
          value: Number(st.value),
          suffix: st.suffix,
          verified: st.verified,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch impact stats, falling back to local:", err);
    }
  }

  return getLocalStoredImpactStats().filter((s) => s.verified);
}

export async function fetchPublicTransparencyDocs(): Promise<StoredTransparencyDoc[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("transparency_docs")
        .select("*")
        .eq("published", true)
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((doc) => ({
          id: doc.id,
          title: doc.title,
          description: doc.description,
          fileUrl: doc.file_url || undefined,
          available: doc.available,
          published: doc.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch transparency docs, falling back to local:", err);
    }
  }

  return getLocalStoredTransparencyDocs().filter((d) => d.published);
}

export async function fetchPublicWebsiteSettings(): Promise<StoredWebsiteSettings> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .eq("id", "current")
        .single();

      if (!error && data) {
        return {
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          location: data.location,
          email: data.email,
          phone: data.phone,
          address: data.address,
          upiId: data.upi_id,
          upiName: data.upi_name,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter || "#",
          youtube: data.youtube || "#",
        };
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch settings, falling back to local:", err);
    }
  }

  return getLocalStoredWebsiteSettings();
}

// ============================================================
// Admin Data Handlers
// ============================================================

// ---- Donations ----

export async function fetchAdminDonations(): Promise<Donation[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("donations")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((d) => ({
          id: d.id,
          name: d.name,
          email: d.email,
          amount: Number(d.amount),
          date: d.created_at,
          status: d.status,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin donations, falling back to local:", err);
    }
  }
  return getLocalDonations();
}

export async function updateDonationStatusInDb(
  id: string,
  status: "pending" | "completed"
): Promise<void> {
  updateLocalDonationStatus(id, status);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("donations").update({ status }).eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to update donation status:", err);
    }
  }
}

export async function deleteDonationFromDb(id: string): Promise<void> {
  deleteLocalDonation(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("donations").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete donation:", err);
    }
  }
}

// ---- Contact Messages ----

export async function fetchAdminContacts(): Promise<ContactMessage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((c) => ({
          id: c.id,
          name: c.name,
          email: c.email,
          subject: c.subject,
          message: c.message,
          date: c.created_at,
          read: c.is_read,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin contacts, falling back to local:", err);
    }
  }
  return getLocalContacts();
}

export async function markContactReadInDb(id: string): Promise<void> {
  markLocalContactRead(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to mark message read:", err);
    }
  }
}

export async function deleteContactFromDb(id: string): Promise<void> {
  deleteLocalContact(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("contact_messages").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete contact message:", err);
    }
  }
}

// ---- Volunteers ----

export async function fetchAdminVolunteers(): Promise<Volunteer[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("volunteers")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        return data.map((v) => ({
          id: v.id,
          name: v.name,
          email: v.email,
          phone: v.phone,
          interest: v.interest,
          message: v.message,
          date: v.created_at,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin volunteers, falling back to local:", err);
    }
  }
  return getLocalVolunteers();
}

export async function deleteVolunteerFromDb(id: string): Promise<void> {
  deleteLocalVolunteer(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("volunteers").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete volunteer:", err);
    }
  }
}

// ---- Events ----

export async function fetchAdminEvents(): Promise<StoredEvent[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((e) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          location: e.location,
          description: e.description,
          image: e.image,
          published: e.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin events, falling back to local:", err);
    }
  }
  return getLocalStoredEvents();
}

export async function saveAdminEvent(event: Omit<StoredEvent, "id"> & { id?: string }): Promise<void> {
  if (event.id) {
    updateLocalStoredEvent(event.id, event);
  } else {
    addLocalStoredEvent(event);
  }

  if (isSupabaseConfigured()) {
    try {
      if (event.id) {
        await supabase
          .from("events")
          .update({
            title: event.title,
            date: event.date,
            location: event.location,
            description: event.description,
            image: event.image,
            published: event.published ?? true,
          })
          .eq("id", event.id);
      } else {
        await supabase.from("events").insert({
          title: event.title,
          date: event.date,
          location: event.location,
          description: event.description,
          image: event.image || "/images/hero-bg.jpg",
          published: event.published ?? true,
        });
      }
    } catch (err) {
      console.error("[Supabase] Failed to save event:", err);
    }
  }
}

export async function deleteEventFromDb(id: string): Promise<void> {
  deleteLocalStoredEvent(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("events").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete event:", err);
    }
  }
}

export const createAdminEvent = saveAdminEvent;
export const deleteAdminEvent = deleteEventFromDb;

// ---- Gallery ----

export async function fetchAdminGallery(): Promise<GalleryImage[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("gallery_images")
        .select("id, src, alt, category, published, created_at")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((img) => ({
          id: img.id,
          src: img.src,
          alt: img.alt,
          category: img.category,
          published: img.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin gallery, falling back to local:", err);
    }
  }
  return getLocalStoredGallery();
}

export async function addGalleryImageToDb(image: GalleryImage): Promise<void> {
  addLocalGalleryImage(image);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("gallery_images").insert({
        src: image.src,
        alt: image.alt,
        category: image.category,
        published: image.published ?? true,
      });
    } catch (err) {
      console.error("[Supabase] Failed to add gallery image:", err);
    }
  }
}

export async function deleteGalleryImageFromDb(srcOrId: string): Promise<void> {
  removeLocalGalleryImage(srcOrId);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("gallery_images").delete().or(`id.eq.${srcOrId},src.eq.${srcOrId}`);
    } catch (err) {
      console.error("[Supabase] Failed to delete gallery image:", err);
    }
  }
}

export const createAdminGalleryImage = addGalleryImageToDb;
export const removeAdminGalleryImage = deleteGalleryImageFromDb;

// ---- Programmes Admin Handlers ----

export async function fetchAdminProgrammes(): Promise<StoredProgramme[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("programmes")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((p) => ({
          id: p.id,
          title: p.title,
          description: p.description,
          image: p.image,
          icon: p.icon,
          published: p.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin programmes:", err);
    }
  }
  return getLocalStoredProgrammes();
}

export async function saveAdminProgramme(prog: Omit<StoredProgramme, "id"> & { id?: string }): Promise<void> {
  const programmeId = prog.id || prog.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const fullProg: StoredProgramme = {
    id: programmeId,
    title: prog.title,
    description: prog.description,
    image: prog.image,
    icon: prog.icon,
    published: prog.published ?? true,
  };

  if (prog.id) {
    updateLocalStoredProgramme(prog.id, fullProg);
  } else {
    addLocalStoredProgramme(fullProg);
  }

  if (isSupabaseConfigured()) {
    try {
      await supabase.from("programmes").upsert({
        id: fullProg.id,
        title: fullProg.title,
        description: fullProg.description,
        image: fullProg.image,
        icon: fullProg.icon,
        published: fullProg.published,
      });
    } catch (err) {
      console.error("[Supabase] Failed to upsert programme:", err);
    }
  }
}

export async function deleteAdminProgramme(id: string): Promise<void> {
  deleteLocalStoredProgramme(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("programmes").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete programme:", err);
    }
  }
}

export async function togglePublishProgrammeInDb(id: string): Promise<void> {
  toggleLocalPublishProgramme(id);
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from("programmes").select("published").eq("id", id).single();
      if (data) {
        await supabase.from("programmes").update({ published: !data.published }).eq("id", id);
      }
    } catch (err) {
      console.error("[Supabase] Failed to toggle programme publish:", err);
    }
  }
}

// ---- Stories Admin Handlers ----

export async function fetchAdminStories(): Promise<StoredStory[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          title: s.title,
          location: s.location,
          programme: s.programme,
          image: s.image,
          tagline: s.tagline,
          before: s.before_text,
          after: s.after_text,
          published: s.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin stories:", err);
    }
  }
  return getLocalStoredStories();
}

export async function saveAdminStory(story: Omit<StoredStory, "id"> & { id?: string }): Promise<void> {
  if (story.id) {
    updateLocalStoredStory(story.id, story);
  } else {
    addLocalStoredStory(story);
  }

  if (isSupabaseConfigured()) {
    try {
      if (story.id) {
        await supabase
          .from("stories")
          .update({
            title: story.title,
            location: story.location,
            programme: story.programme,
            image: story.image,
            tagline: story.tagline,
            before_text: story.before,
            after_text: story.after,
            published: story.published ?? true,
          })
          .eq("id", story.id);
      } else {
        await supabase.from("stories").insert({
          title: story.title,
          location: story.location,
          programme: story.programme,
          image: story.image,
          tagline: story.tagline,
          before_text: story.before,
          after_text: story.after,
          published: story.published ?? true,
        });
      }
    } catch (err) {
      console.error("[Supabase] Failed to save story:", err);
    }
  }
}

export async function deleteAdminStory(id: string): Promise<void> {
  deleteLocalStoredStory(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("stories").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete story:", err);
    }
  }
}

export async function togglePublishStoryInDb(id: string): Promise<void> {
  toggleLocalPublishStory(id);
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from("stories").select("published").eq("id", id).single();
      if (data) {
        await supabase.from("stories").update({ published: !data.published }).eq("id", id);
      }
    } catch (err) {
      console.error("[Supabase] Failed to toggle story publish:", err);
    }
  }
}

// ---- Impact Stats Admin Handlers ----

export async function fetchAdminImpactStats(): Promise<StoredImpactStat[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("impact_stats")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((s) => ({
          id: s.id,
          label: s.label,
          value: Number(s.value),
          suffix: s.suffix,
          verified: s.verified,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin impact stats:", err);
    }
  }
  return getLocalStoredImpactStats();
}

export async function saveAdminImpactStat(stat: Omit<StoredImpactStat, "id"> & { id?: string }): Promise<void> {
  if (stat.id) {
    updateLocalStoredImpactStat(stat.id, stat);
  } else {
    addLocalStoredImpactStat(stat);
  }

  if (isSupabaseConfigured()) {
    try {
      if (stat.id) {
        await supabase
          .from("impact_stats")
          .update({
            label: stat.label,
            value: stat.value,
            suffix: stat.suffix,
            verified: stat.verified ?? true,
          })
          .eq("id", stat.id);
      } else {
        await supabase.from("impact_stats").insert({
          label: stat.label,
          value: stat.value,
          suffix: stat.suffix || "+",
          verified: stat.verified ?? true,
        });
      }
    } catch (err) {
      console.error("[Supabase] Failed to save impact stat:", err);
    }
  }
}

export async function deleteAdminImpactStat(id: string): Promise<void> {
  deleteLocalStoredImpactStat(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("impact_stats").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete impact stat:", err);
    }
  }
}

// ---- Transparency Docs Admin Handlers ----

export async function fetchAdminTransparencyDocs(): Promise<StoredTransparencyDoc[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("transparency_docs")
        .select("*")
        .order("sort_order", { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          title: d.title,
          description: d.description,
          fileUrl: d.file_url || undefined,
          available: d.available,
          published: d.published,
        }));
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin transparency docs:", err);
    }
  }
  return getLocalStoredTransparencyDocs();
}

export async function saveAdminTransparencyDoc(
  doc: Omit<StoredTransparencyDoc, "id"> & { id?: string }
): Promise<void> {
  if (doc.id) {
    updateLocalStoredTransparencyDoc(doc.id, doc);
  } else {
    addLocalStoredTransparencyDoc(doc);
  }

  if (isSupabaseConfigured()) {
    try {
      if (doc.id) {
        await supabase
          .from("transparency_docs")
          .update({
            title: doc.title,
            description: doc.description,
            file_url: doc.fileUrl || null,
            available: doc.available,
            published: doc.published,
          })
          .eq("id", doc.id);
      } else {
        await supabase.from("transparency_docs").insert({
          title: doc.title,
          description: doc.description,
          file_url: doc.fileUrl || null,
          available: doc.available ?? false,
          published: doc.published ?? true,
        });
      }
    } catch (err) {
      console.error("[Supabase] Failed to save transparency doc:", err);
    }
  }
}

export async function deleteAdminTransparencyDoc(id: string): Promise<void> {
  deleteLocalStoredTransparencyDoc(id);
  if (isSupabaseConfigured()) {
    try {
      await supabase.from("transparency_docs").delete().eq("id", id);
    } catch (err) {
      console.error("[Supabase] Failed to delete transparency doc:", err);
    }
  }
}

export async function togglePublishTransparencyDocInDb(id: string): Promise<void> {
  toggleLocalPublishTransparencyDoc(id);
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from("transparency_docs").select("published").eq("id", id).single();
      if (data) {
        await supabase.from("transparency_docs").update({ published: !data.published }).eq("id", id);
      }
    } catch (err) {
      console.error("[Supabase] Failed to toggle doc publish:", err);
    }
  }
}

export async function toggleAvailableTransparencyDocInDb(id: string): Promise<void> {
  toggleLocalAvailableTransparencyDoc(id);
  if (isSupabaseConfigured()) {
    try {
      const { data } = await supabase.from("transparency_docs").select("available").eq("id", id).single();
      if (data) {
        await supabase.from("transparency_docs").update({ available: !data.available }).eq("id", id);
      }
    } catch (err) {
      console.error("[Supabase] Failed to toggle doc availability:", err);
    }
  }
}

// ---- Website Settings Admin Handlers ----

export async function fetchAdminWebsiteSettings(): Promise<StoredWebsiteSettings> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from("website_settings")
        .select("*")
        .eq("id", "current")
        .single();

      if (!error && data) {
        return {
          name: data.name,
          tagline: data.tagline,
          description: data.description,
          location: data.location,
          email: data.email,
          phone: data.phone,
          address: data.address,
          upiId: data.upi_id,
          upiName: data.upi_name,
          facebook: data.facebook,
          instagram: data.instagram,
          twitter: data.twitter || "#",
          youtube: data.youtube || "#",
        };
      }
    } catch (err) {
      console.warn("[Supabase] Failed to fetch admin settings:", err);
    }
  }
  return getLocalStoredWebsiteSettings();
}

export async function saveAdminWebsiteSettings(data: Partial<StoredWebsiteSettings>): Promise<void> {
  updateLocalStoredWebsiteSettings(data);
  if (isSupabaseConfigured()) {
    try {
      const current = await fetchAdminWebsiteSettings();
      const updated = { ...current, ...data };
      await supabase.from("website_settings").upsert({
        id: "current",
        name: updated.name,
        tagline: updated.tagline,
        description: updated.description,
        location: updated.location,
        email: updated.email,
        phone: updated.phone,
        address: updated.address,
        upi_id: updated.upiId,
        upi_name: updated.upiName,
        facebook: updated.facebook,
        instagram: updated.instagram,
        twitter: updated.twitter,
        youtube: updated.youtube,
        updated_at: new Date().toISOString(),
      });
    } catch (err) {
      console.error("[Supabase] Failed to save website settings:", err);
    }
  }
}

// ---- Overall Platform Stats ----

export async function fetchAdminStats() {
  const [donations, contacts, volunteers, events, programmes, stories, docs] = await Promise.all([
    fetchAdminDonations(),
    fetchAdminContacts(),
    fetchAdminVolunteers(),
    fetchAdminEvents(),
    fetchAdminProgrammes(),
    fetchAdminStories(),
    fetchAdminTransparencyDocs(),
  ]);

  const completed = donations.filter((d) => d.status === "completed");
  const pending = donations.filter((d) => d.status === "pending");

  return {
    totalDonations: donations.length,
    totalDonationAmount: donations.reduce((sum, d) => sum + d.amount, 0),
    verifiedDonationAmount: completed.reduce((sum, d) => sum + d.amount, 0),
    pendingDonationsCount: pending.length,
    completedDonationsCount: completed.length,
    totalMessages: contacts.length,
    unreadMessages: contacts.filter((c) => !c.read).length,
    totalVolunteers: volunteers.length,
    totalEvents: events.length,
    totalRegistrations: getLocalEventRegistrations().length,
    totalProgrammes: programmes.length,
    publishedProgrammes: programmes.filter((p) => p.published).length,
    totalStories: stories.length,
    publishedStories: stories.filter((s) => s.published).length,
    totalDocs: docs.length,
    publishedDocs: docs.filter((d) => d.published).length,
  };
}
