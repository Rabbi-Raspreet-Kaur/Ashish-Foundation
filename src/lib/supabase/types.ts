export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      contact_messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          subject: string;
          message: string;
          is_read?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          subject?: string;
          message?: string;
          is_read?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      volunteers: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string;
          interest: string;
          message: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          interest?: string;
          message?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string;
          interest?: string;
          message?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      donations: {
        Row: {
          id: string;
          name: string;
          email: string;
          amount: number;
          status: "pending" | "completed";
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          amount: number;
          status?: "pending" | "completed";
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          amount?: number;
          status?: "pending" | "completed";
          created_at?: string;
        };
        Relationships: [];
      };
      events: {
        Row: {
          id: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image: string;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          date: string;
          location: string;
          description: string;
          image?: string;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          date?: string;
          location?: string;
          description?: string;
          image?: string;
          published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      event_registrations: {
        Row: {
          id: string;
          event_id: string;
          event_title: string;
          name: string;
          email: string;
          phone: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          event_title: string;
          name: string;
          email: string;
          phone: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          event_title?: string;
          name?: string;
          email?: string;
          phone?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      gallery_images: {
        Row: {
          id: string;
          src: string;
          alt: string;
          category: string;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          alt: string;
          category?: string;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          src?: string;
          alt?: string;
          category?: string;
          published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      stories: {
        Row: {
          id: string;
          title: string;
          location: string;
          programme: string;
          image: string;
          tagline: string;
          before_text: string;
          after_text: string;
          published: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          location?: string;
          programme: string;
          image: string;
          tagline: string;
          before_text: string;
          after_text: string;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          location?: string;
          programme?: string;
          image?: string;
          tagline?: string;
          before_text?: string;
          after_text?: string;
          published?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      programmes: {
        Row: {
          id: string;
          title: string;
          description: string;
          image: string;
          icon: string;
          published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id: string;
          title: string;
          description: string;
          image: string;
          icon?: string;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          image?: string;
          icon?: string;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      impact_stats: {
        Row: {
          id: string;
          label: string;
          value: number;
          suffix: string;
          verified: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          value: number;
          suffix?: string;
          verified?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          label?: string;
          value?: number;
          suffix?: string;
          verified?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      transparency_docs: {
        Row: {
          id: string;
          title: string;
          description: string;
          file_url: string | null;
          available: boolean;
          published: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          file_url?: string | null;
          available?: boolean;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          file_url?: string | null;
          available?: boolean;
          published?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      website_settings: {
        Row: {
          id: string;
          name: string;
          tagline: string;
          description: string;
          location: string;
          email: string;
          phone: string;
          address: string;
          upi_id: string;
          upi_name: string;
          facebook: string;
          instagram: string;
          twitter: string;
          youtube: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tagline: string;
          description: string;
          location: string;
          email: string;
          phone: string;
          address: string;
          upi_id: string;
          upi_name: string;
          facebook?: string;
          instagram?: string;
          twitter?: string;
          youtube?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          tagline?: string;
          description?: string;
          location?: string;
          email?: string;
          phone?: string;
          address?: string;
          upi_id?: string;
          upi_name?: string;
          facebook?: string;
          instagram?: string;
          twitter?: string;
          youtube?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
