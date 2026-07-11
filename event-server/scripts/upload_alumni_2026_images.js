const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const repoRoot = path.join(__dirname, '..', '..');
const zipPath = path.join(
  repoRoot,
  'drive-download-20260326T130307Z-3-001.zip'
);
const speakersPath = path.join(
  __dirname,
  '..',
  'data',
  'speakers_ams_2026.json'
);

const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  getCloudNameFromUrl(process.env.CLOUDINARY_URL) ||
  inferCloudNameFromSeed() ||
  'djqceuwlx';

const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!apiKey || !apiSecret) {
  throw new Error('Missing CLOUDINARY_API_KEY or CLOUDINARY_API_SECRET.');
}

const speakerImageMap = {
  'Yuriko Kikuchi': 'yuriko-kikuchi',
  'Ahmed Nasser': 'ahmed-nasser',
  'Dhairyashil Shinde': 'dhairyashil-shinde',
  'Vipin Chaudhary': 'vipin-chaudhary',
  'Rohit Bansal': 'rohit-bansal',
  'Abhinav Kumar': 'abhinav-kumar',
};

function getCloudNameFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) {
    return null;
  }

  const match = cloudinaryUrl.match(/@([^/?]+)/);
  return match ? match[1] : null;
}

function inferCloudNameFromSeed() {
  const seedFile = path.join(__dirname, '..', 'data', 'speakers_ams_2025.json');

  if (!fs.existsSync(seedFile)) {
    return null;
  }

  const speakers = JSON.parse(fs.readFileSync(seedFile, 'utf8'));
  const cloudinarySpeaker = speakers.find(
    (speaker) => typeof speaker.photo_url === 'string' && speaker.photo_url.includes('res.cloudinary.com/')
  );

  if (!cloudinarySpeaker) {
    return null;
  }

  const match = cloudinarySpeaker.photo_url.match(/res\.cloudinary\.com\/([^/]+)\//);
  return match ? match[1] : null;
}

function normalizeFileName(fileName) {
  return fileName.toLowerCase().replace(/[^a-z0-9]+/g, ' ');
}

function findMatchingFile(searchDir, speakerName) {
  const expected = normalizeFileName(speakerName);
  const files = fs.readdirSync(searchDir);

  return files.find((fileName) => normalizeFileName(fileName).includes(expected));
}

function findSpeakerImage(speakerName, searchDirs) {
  for (const searchDir of searchDirs) {
    if (!searchDir || !fs.existsSync(searchDir)) {
      continue;
    }

    const matchedFile = findMatchingFile(searchDir, speakerName);
    if (matchedFile) {
      return path.join(searchDir, matchedFile);
    }
  }

  return null;
}

function buildSignature(params) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(`${serialized}${apiSecret}`)
    .digest('hex');
}

async function uploadImage(filePath, slug) {
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `gsoc-2026/alumni-summit/${slug}`;
  const signature = buildSignature({
    overwrite: 'true',
    public_id: publicId,
    timestamp,
  });

  const form = new FormData();
  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('overwrite', 'true');
  form.append('signature', signature);
  form.append(
    'file',
    new Blob([fs.readFileSync(filePath)]),
    path.basename(filePath)
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: 'POST',
      body: form,
    }
  );

  const payload = await response.json();
  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed for ${path.basename(filePath)}: ${JSON.stringify(payload)}`
    );
  }

  return payload.secure_url;
}

async function main() {
  let extractDir = null;
  if (fs.existsSync(zipPath)) {
    extractDir = fs.mkdtempSync(
      path.join(os.tmpdir(), 'rc4c-alumni-2026-images-')
    );
    execFileSync('unzip', ['-o', zipPath, '-d', extractDir], { stdio: 'inherit' });
  } else {
    console.warn(`ZIP file not found, continuing with local files only: ${zipPath}`);
  }

  const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf8'));
  const searchDirs = [repoRoot, extractDir];

  for (const speaker of speakers) {
    const slug = speakerImageMap[speaker.name];
    if (!slug) {
      continue;
    }

    const matchedFile = findSpeakerImage(speaker.name, searchDirs);
    if (!matchedFile) {
      throw new Error(`No local image found for speaker "${speaker.name}"`);
    }

    const uploadedUrl = await uploadImage(matchedFile, slug);
    speaker.photo_url = uploadedUrl;
    console.log(`Uploaded ${speaker.name} -> ${uploadedUrl}`);

    if (path.dirname(matchedFile) === repoRoot) {
      fs.unlinkSync(matchedFile);
      console.log(`Removed local temp file ${matchedFile}`);
    }
  }

  fs.writeFileSync(speakersPath, `${JSON.stringify(speakers, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
