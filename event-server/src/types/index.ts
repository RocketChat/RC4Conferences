export interface IEvent {
  name: string;
  latitude: number;
  longitude: number;
  location_name: string | null;
  starts_at: string;
  ends_at: string;
  timezone: string;
  description: string;
  original_image_url: string;
  logo_url: string;
  owner_name: string;
  owner_description: string;
  privacy: string;
  created_at: string;
  identifier: string;
  schedule_published_on: string;
  state: string;
}

export interface ISpeaker {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  photo_url: string;
  organisation: string;
  position: string;
  country: string | null;
  short_biography: string;
  long_biography: string;
  website: string | null;
  twitter: string | null;
  facebook: string | null;
  github: string | null;
  linkedin: string | null;
  address: string | null;
  city: string | null;
  complex_field_values: any | null;
  created_at: string;
  deleted_at: string | null;
  event_id: number;
  gender: string | null;
  heard_from: string | null;
  icon_image_url: string | null;
  instagram: string | null;
  is_email_overridden: boolean;
  is_featured: boolean;
  mastodon: string | null;
  modified_at: string;
  order: number;
  small_image_url: string | null;
  speaker_positions: Record<string, any>;
  speaking_experience: string | null;
  sponsorship_required: string | null;
  thumbnail_image_url: string | null;
}

export interface ISessionItem {
  id: number;
  Event: string;
  Start: string;
  End: string;
  Title: string;
  Mentor: string;
  Description: string;
  Speaker: string;
  Duration: number;
  Youtube: string | null;
}

export interface ISession {
  id: number;
  event_name: string;
  event_id: number;
  session_items: ISessionItem[];
}
