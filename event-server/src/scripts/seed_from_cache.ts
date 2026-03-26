import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

const API_KEY = process.env.API_KEY_SECRET;
const PORT = process.env.PORT || 8000;
const BASE_URL = `http://localhost:${PORT}/v1`;
const CMS_BASE_URL = `http://localhost:${PORT}/v1/cms`;

if (!API_KEY) {
  throw new Error("API_KEY_SECRET must be set before running the seed script.");
}

const headers = {
  "x-api-key": API_KEY,
  "Content-Type": "application/json",
};

async function seedData() {
  const dataDir = path.join(__dirname, "../../data");
  
  const filesToSeed = [
    {
      type: "event",
      files: [
          "event_ams_2025.json", 
          "event_dd_2025.json",
          "event_dd_2023.json",
          "event_as_2024.json",
          "event_open_call.json"
      ],
    },
    {
      type: "speaker",
      files: [
          "speakers_ams_2025.json", 
          "speakers_dd_2025.json",
          "speakers_dd_2023.json",
          "speakers_open_call.json"
      ],
    },
    {
      type: "session",
      files: [
          "sessions_dd_2025.json", 
          "sessions_ams_2025.json"
      ],
    },
    {
      type: "cms",
      files: [
          { name: "carousels.json", endpoint: "carousels" },
          { name: "personas.json", endpoint: "personas" },
          { name: "guides.json", endpoint: "guide" },
          { name: "release_notes.json", endpoint: "release-note" },
          { name: "top_nav_items.json", endpoint: "top-nav-item" },
          { name: "forms.json", endpoint: "forms" }
      ],
    },
  ];

  for (const group of filesToSeed) {
    if (group.type === "cms") {
        for (const fileObj of group.files as any[]) {
            const filePath = path.join(dataDir, fileObj.name);
            if (!fs.existsSync(filePath)) {
                console.log(`File not found: ${fileObj.name}`);
                continue;
            }
            const content = fs.readFileSync(filePath, "utf-8");
            let data = JSON.parse(content);
            await seedCMS(fileObj.endpoint, data);
        }
        continue;
    }

    for (const fileName of group.files as string[]) {
      const filePath = path.join(dataDir, fileName);
      if (!fs.existsSync(filePath)) {
        console.log(`File not found: ${fileName}`);
        continue;
      }

      const content = fs.readFileSync(filePath, "utf-8");
      let data = JSON.parse(content);

      if (group.type === "event") {
        await seedEvent(data);
      } else if (group.type === "speaker") {
        const speakers = Array.isArray(data) ? data : [data];
        for (const speaker of speakers) {
          await seedSpeaker(speaker);
        }
      } else if (group.type === "session") {
        if (fileName === "sessions_ams_2025.json") {
          const session = {
            id: 190299,
            event_name: "GSoC Alumni Summit 2025",
            event_id: 190299,
            session_items: Array.isArray(data) ? data : data.session_items
          };
          await seedSession(session);
        } else {
          await seedSession(data);
        }
      }
    }
  }
}

async function seedCMS(endpoint: string, data: any) {
  try {
    const url = `${CMS_BASE_URL}/${endpoint}`;
    const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log(`Seeded CMS endpoint: ${endpoint}`);
    } else {
      const errData = await response.json();
      console.error(`Failed to seed CMS ${endpoint}:`, errData);
    }
  } catch (e) {
    console.error(`Error seeding CMS ${endpoint}:`, e);
  }
}

async function seedEvent(event: any) {
  try {
    const response = await fetch(`${BASE_URL}/events/${event.id}`, { headers });
    if (response.ok) {
      console.log(`Event ${event.id} already exists, skipping.`);
      return;
    }

    const postResponse = await fetch(`${BASE_URL}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(event),
    });

    if (postResponse.ok) {
      console.log(`Seeded event: ${event.name} (ID: ${event.id})`);
    } else {
      const errData = await postResponse.json();
      console.error(`Failed to seed event ${event.id}:`, errData);
    }
  } catch (error: any) {
    console.error(`Error seeding event ${event.id}:`, error.message);
  }
}

async function downloadAndUploadImage(imageUrl: string, speakerId: number): Promise<string | null> {
  if (!imageUrl || !imageUrl.startsWith('http')) return null;
  
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) return null;
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const contentType = response.headers.get('content-type') || 'image/png';
    const ext = contentType.split('/')[1] || 'png';
    const filename = `speaker_${speakerId}.${ext}`;

    const uploadResponse = await fetch(`${BASE_URL}/files`, {
      method: 'POST',
      headers: {
        'x-api-key': API_KEY as string,
        'x-filename': filename,
        'content-type': contentType
      },
      body: buffer
    });

    if (uploadResponse.ok) {
      await uploadResponse.json();
      return `${BASE_URL}/files/${filename}`;
    }
  } catch (e) {
    console.error(`Failed to process image for speaker ${speakerId}:`, e);
  }
  return null;
}

async function seedSpeaker(speaker: any) {
  try {
    const response = await fetch(`${BASE_URL}/speakers/${speaker.id}`, { headers });
    if (response.ok) {
      console.log(`Speaker ${speaker.id} already exists, skipping.`);
      return;
    }

    // Try to localize image
    const localImageUrl = await downloadAndUploadImage(speaker.photo_url, speaker.id);
    if (localImageUrl) {
        speaker.photo_url = localImageUrl;
    }

    const postResponse = await fetch(`${BASE_URL}/speakers`, {
      method: "POST",
      headers,
      body: JSON.stringify(speaker),
    });

    if (postResponse.ok) {
      console.log(`Seeded speaker: ${speaker.name} (ID: ${speaker.id})`);
    } else {
      const errData = await postResponse.json();
      console.error(`Failed to seed speaker ${speaker.id}:`, errData);
    }
  } catch (error: any) {
    console.error(`Error seeding speaker ${speaker.id}:`, error.message);
  }
}

async function seedSession(session: any) {
  try {
    const response = await fetch(`${BASE_URL}/sessions/${session.id}`, { headers });
    if (response.ok) {
      console.log(`Session ${session.id} already exists, skipping.`);
      return;
    }

    const postResponse = await fetch(`${BASE_URL}/sessions`, {
      method: "POST",
      headers,
      body: JSON.stringify(session),
    });

    if (postResponse.ok) {
      console.log(`Seeded session for event ID: ${session.event_id} (ID: ${session.id})`);
    } else {
      const errData = await postResponse.json();
      console.error(`Failed to seed session ${session.id}:`, errData);
    }
  } catch (error: any) {
    console.error(`Error seeding session ${session.id}:`, error.message);
  }
}

console.log("Starting seeding process with image localization and CMS content...");
seedData().then(() => console.log("Seeding complete!"));
