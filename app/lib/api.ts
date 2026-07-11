import type {
  IEvent,
  IForm,
  ISession,
  ISessionItem,
  ISpeaker,
} from './types';

const DEFAULT_API_BASE_URL = 'http://127.0.0.1:8000';
const CMS_FILE_MAP: Record<string, string> = {
  carousels: 'carousels.json',
  personas: 'personas.json',
  guide: 'guides.json',
  'release-note': 'release_notes.json',
  'top-nav-item': 'top_nav_items.json',
  forms: 'forms.json',
};
const EVENT_FILES = [
  'event_dd_2026.json',
  'event_ams_2026.json',
  'event_ams_2025.json',
  'event_dd_2025.json',
  'event_dd_2023.json',
  'event_as_2024.json',
  'event_open_call.json',
];
const SPEAKER_FILES = [
  'speakers_dd_2026.json',
  'speakers_ams_2026.json',
  'speakers_ams_2025.json',
  'speakers_dd_2025.json',
  'speakers_dd_2023.json',
  'speakers_open_call.json',
];
const SESSION_FILES = [
  'sessions_dd_2026.json',
  'sessions_dd_2025.json',
  'sessions_ams_2025.json',
  'sessions_ams_2026.json',
];

function normalizePath(path = '') {
  return path.startsWith('/') ? path : `/${path}`;
}

export function getCmsURL(path = '') {
  const baseUrl =
    process.env.NEXT_PUBLIC_EVENT_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    DEFAULT_API_BASE_URL;

  return `${baseUrl}/v1/cms${normalizePath(path)}`;
}

export function getEventServerURL(path = '') {
  const baseUrl =
    process.env.NEXT_PUBLIC_EVENT_SERVER_URL ||
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    process.env.NEXT_PUBLIC_STRAPI_API_URL ||
    DEFAULT_API_BASE_URL;

  return `${baseUrl}/v1${normalizePath(path)}`;
}

export const getStrapiURL = getCmsURL;

async function fetchJson<T>(requestUrl: string): Promise<T> {
  try {
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch from ${requestUrl}: ${response.status}`);
    }

    return response.json() as Promise<T>;
  } catch (error) {
    const seedData = await getSeedData<T>(requestUrl);
    if (seedData !== undefined) {
      return seedData;
    }
    throw error;
  }
}

export async function fetchAPI<T = unknown>(path: string) {
  return fetchJson<T>(getCmsURL(path));
}

export async function fetchEventAPI<T = unknown>(path: string) {
  return fetchJson<T>(getEventServerURL(path));
}

async function readSeedJson<T>(fileName: string): Promise<T> {
  const fs = await import('fs/promises');
  const path = await import('path');
  const filePath = path.join(process.cwd(), '..', 'event-server', 'data', fileName);
  const content = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(content) as T;
}

async function getSeedEvents() {
  return Promise.all(EVENT_FILES.map((fileName) => readSeedJson<IEvent>(fileName)));
}

async function getSeedSpeakers() {
  const speakerGroups = await Promise.all(
    SPEAKER_FILES.map((fileName) => readSeedJson<ISpeaker[]>(fileName))
  );
  return speakerGroups.flat();
}

async function getSeedSessions() {
  const sessionGroups = await Promise.all(
    SESSION_FILES.map((fileName) => readSeedJson<ISession | ISessionItem[]>(fileName))
  );

  return sessionGroups.map((sessionGroup, index) => {
    if (!Array.isArray(sessionGroup)) {
      return sessionGroup;
    }

    return {
      id: 190299,
      event_name: 'GSoC Alumni Summit 2025',
      event_id: 190299,
      session_items: sessionGroup,
    } as ISession;
  });
}

async function getSeedData<T>(requestUrl: string): Promise<T | undefined> {
  if (typeof window !== 'undefined') {
    return undefined;
  }

  const { pathname } = new URL(requestUrl);

  if (pathname.startsWith('/v1/cms/')) {
    const endpoint = pathname.replace('/v1/cms/', '');

    if (endpoint.startsWith('forms/')) {
      const formId = Number.parseInt(endpoint.replace('forms/', ''), 10);
      const forms = await readSeedJson<IForm[]>(CMS_FILE_MAP.forms);
      return { data: forms.find((form) => form.id === formId) ?? null } as T;
    }

    const fileName = CMS_FILE_MAP[endpoint];
    if (!fileName) {
      return undefined;
    }

    const data = await readSeedJson<unknown>(fileName);
    return { data } as T;
  }

  if (pathname === '/v1/events') {
    return { success: true, data: await getSeedEvents() } as T;
  }

  if (pathname.startsWith('/v1/events/')) {
    const eventKey = decodeURIComponent(pathname.replace('/v1/events/', ''));
    const events = await getSeedEvents();
    const event = events.find(
      (item) => item.identifier === eventKey || String(item.id) === eventKey
    );
    return event ? ({ success: true, data: event } as T) : undefined;
  }

  if (pathname.startsWith('/v1/speakers/event/')) {
    const eventKey = decodeURIComponent(pathname.replace('/v1/speakers/event/', ''));
    const events = await getSeedEvents();
    const event = events.find(
      (item) => item.identifier === eventKey || String(item.id) === eventKey
    );
    if (!event) {
      return { success: true, data: [] } as T;
    }

    const speakers = await getSeedSpeakers();
    return {
      success: true,
      data: speakers.filter((speaker) => speaker.event_id === event.id),
    } as T;
  }

  if (pathname.startsWith('/v1/sessions/event/')) {
    const eventKey = decodeURIComponent(pathname.replace('/v1/sessions/event/', ''));
    const events = await getSeedEvents();
    const event = events.find(
      (item) => item.identifier === eventKey || String(item.id) === eventKey
    );
    if (!event) {
      return { success: true, data: [] } as T;
    }

    const sessions = await getSeedSessions();
    return {
      success: true,
      data: sessions.filter((session) => session.event_id === event.id),
    } as T;
  }

  return undefined;
}
