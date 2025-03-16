export interface IEvent {
  id: number;
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
  photo_url: string;
  position: string;
  short_biography: string;
  long_biography: string;
  twitter: string | null;
  facebook: string | null;
  github: string | null;
  linkedin: string | null;
  created_at: string;
  event_id: number;
  instagram: string | null;
  is_featured: boolean;
  mastodon: string | null;
  modified_at: string;
}

export interface ISessionItem {
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
