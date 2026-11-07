"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

export interface ActionResult<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  fallbackNeeded?: boolean;
}

/**
 * Server Action: Submit Contact Form
 */
export async function submitContactForm(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<ActionResult> {
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const subject = payload.subject?.trim();
  const message = payload.message?.trim();

  // Server-side validation
  if (!name || name.length > 200) {
    return { success: false, message: "Please provide a valid name (up to 200 characters)." };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }
  if (!subject || subject.length > 300) {
    return { success: false, message: "Please provide a subject line." };
  }
  if (!message || message.length > 5000) {
    return { success: false, message: "Please enter a message (up to 5,000 characters)." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      fallbackNeeded: true,
      message: "Recorded locally (Supabase keys not yet configured in .env.local).",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      is_read: false,
    });

    if (error) {
      console.error("[Supabase Error: contact_messages]", error.message);
      return { success: false, message: "Failed to send message. Please try again later." };
    }

    return { success: true, message: "Your message has been sent successfully." };
  } catch (err) {
    console.error("[Supabase Server Action Error]", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Server Action: Submit Volunteer Registration
 */
export async function submitVolunteerRegistration(payload: {
  name: string;
  email: string;
  phone: string;
  interest?: string;
  message?: string;
}): Promise<ActionResult> {
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const phone = payload.phone?.trim();
  const interest = payload.interest?.trim() || "Education";
  const message = payload.message?.trim() || "";

  if (!name || name.length > 200) {
    return { success: false, message: "Please enter your name." };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }
  if (!phone || phone.length < 7 || phone.length > 25) {
    return { success: false, message: "Please provide a valid phone number." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      fallbackNeeded: true,
      message: "Recorded locally (Supabase keys not yet configured).",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("volunteers").insert({
      name,
      email,
      phone,
      interest,
      message,
    });

    if (error) {
      console.error("[Supabase Error: volunteers]", error.message);
      return { success: false, message: "Failed to register as volunteer. Please try again." };
    }

    return { success: true, message: "Thank you for volunteering! We will contact you soon." };
  } catch (err) {
    console.error("[Supabase Server Action Error]", err);
    return { success: false, message: "An unexpected error occurred. Please try again." };
  }
}

/**
 * Server Action: Submit Donation Pledge
 */
export async function submitDonationPledge(payload: {
  name: string;
  email: string;
  amount: number;
}): Promise<ActionResult> {
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const amount = Number(payload.amount);

  if (!name || name.length > 200) {
    return { success: false, message: "Please enter your name." };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Please provide a valid email address." };
  }
  if (!amount || isNaN(amount) || amount <= 0 || amount > 10000000) {
    return { success: false, message: "Please specify a valid donation amount." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      fallbackNeeded: true,
      message: "Recorded locally (Supabase keys not yet configured).",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("donations").insert({
      name,
      email,
      amount,
      status: "pending",
    });

    if (error) {
      console.error("[Supabase Error: donations]", error.message);
      return { success: false, message: "Failed to record donation pledge." };
    }

    return { success: true, message: "Donation recorded for verification." };
  } catch (err) {
    console.error("[Supabase Server Action Error]", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}

/**
 * Server Action: Submit Event Registration
 */
export async function submitEventRegistration(payload: {
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
}): Promise<ActionResult> {
  const eventId = payload.eventId?.trim();
  const eventTitle = payload.eventTitle?.trim();
  const name = payload.name?.trim();
  const email = payload.email?.trim().toLowerCase();
  const phone = payload.phone?.trim();

  if (!eventId || !eventTitle) {
    return { success: false, message: "Invalid event selection." };
  }
  if (!name || name.length > 200) {
    return { success: false, message: "Please enter your name." };
  }
  if (!email || !EMAIL_REGEX.test(email)) {
    return { success: false, message: "Please enter a valid email address." };
  }
  if (!phone || phone.length < 7 || phone.length > 25) {
    return { success: false, message: "Please enter a valid phone number." };
  }

  if (!isSupabaseConfigured()) {
    return {
      success: true,
      fallbackNeeded: true,
      message: "Recorded locally (Supabase keys not yet configured).",
    };
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.from("event_registrations").insert({
      event_id: eventId,
      event_title: eventTitle,
      name,
      email,
      phone,
    });

    if (error) {
      console.error("[Supabase Error: event_registrations]", error.message);
      return { success: false, message: "Failed to register for event. Please try again." };
    }

    return { success: true, message: "Registration confirmed!" };
  } catch (err) {
    console.error("[Supabase Server Action Error]", err);
    return { success: false, message: "An unexpected error occurred." };
  }
}
