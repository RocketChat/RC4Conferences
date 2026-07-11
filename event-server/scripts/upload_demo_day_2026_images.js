const crypto = require('crypto');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const repoRoot = path.join(__dirname, '..', '..');
const archivePath = path.join(
  repoRoot,
  'Picture (File responses)-20260711T153814Z-2-001.zip'
);
const speakersPath = path.join(
  __dirname,
  '..',
  'data',
  'speakers_dd_2026.json'
);

const imageNames = {
  'Srijna Bhargav': 'Srijna Bhargav',
  'Meet Jain': 'Meet Jain',
  'Devansh Kansagra': 'Devansh Kansagra',
  'Kartik Doda': 'kartik doda',
  'Amit Ashutosh': 'Amit Ashutosh',
  'Aryan Verma': 'Aryan Verma',
  'Khizar Shah': 'Khizar Shah',
  'Sezal Lagwal': 'Sezal',
  'Echo Xiao': 'Echo Xiao',
  'Rahian Santos': 'Rahian',
};

const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;
const cloudName =
  process.env.CLOUDINARY_CLOUD_NAME ||
  getCloudNameFromUrl(process.env.CLOUDINARY_URL) ||
  inferCloudNameFromSeed();

if (!apiKey || !apiSecret || !cloudName) {
  throw new Error(
    'CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET, and a Cloudinary cloud name are required.'
  );
}

if (!fs.existsSync(archivePath)) {
  throw new Error(`Photo archive not found: ${archivePath}`);
}

function getCloudNameFromUrl(cloudinaryUrl) {
  if (!cloudinaryUrl) {
    return null;
  }

  const match = cloudinaryUrl.match(/@([^/?]+)/);
  return match ? match[1] : null;
}

function inferCloudNameFromSeed() {
  const seedPath = path.join(
    __dirname,
    '..',
    'data',
    'speakers_ams_2026.json'
  );

  if (!fs.existsSync(seedPath)) {
    return null;
  }

  const speakers = JSON.parse(fs.readFileSync(seedPath, 'utf8'));
  const cloudinarySpeaker = speakers.find((speaker) =>
    speaker.photo_url?.includes('res.cloudinary.com/')
  );
  const match = cloudinarySpeaker?.photo_url?.match(
    /res\.cloudinary\.com\/([^/]+)\//
  );

  return match ? match[1] : null;
}

function normalize(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

function slugify(value) {
  return normalize(value).replace(/\s+/g, '-');
}

function listFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const entryPath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(entryPath) : [entryPath];
  });
}

function findImage(files, expectedName) {
  const normalizedName = normalize(expectedName);
  return files.find((filePath) =>
    normalize(path.basename(filePath)).includes(normalizedName)
  );
}

function buildSignature(params) {
  const serialized = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('&');

  return crypto
    .createHash('sha1')
    .update(`${serialized}${apiSecret}`)
    .digest('hex');
}

function addDeliveryTransformation(url, speakerName) {
  const adjustments =
    speakerName === 'Kartik Doda' ? '/e_brightness:35' : '';

  return url.replace(
    '/image/upload/',
    `/image/upload/c_thumb,g_face,h_600,w_600${adjustments}/q_auto,f_auto/`
  );
}

async function uploadImage(filePath, speakerName) {
  const timestamp = Math.floor(Date.now() / 1000);
  const publicId = `gsoc-2026/demo-day/${slugify(speakerName)}`;
  const params = {
    overwrite: 'true',
    public_id: publicId,
    timestamp,
  };
  const form = new FormData();

  form.append('api_key', apiKey);
  form.append('timestamp', String(timestamp));
  form.append('public_id', publicId);
  form.append('overwrite', 'true');
  form.append('signature', buildSignature(params));
  form.append(
    'file',
    new Blob([fs.readFileSync(filePath)]),
    path.basename(filePath)
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: 'POST', body: form }
  );
  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Cloudinary upload failed for ${speakerName}: ${JSON.stringify(payload)}`
    );
  }

  return addDeliveryTransformation(payload.secure_url, speakerName);
}

async function main() {
  const extractDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), 'rc4c-demo-day-2026-')
  );
  execFileSync('unzip', ['-o', archivePath, '-d', extractDirectory], {
    stdio: 'inherit',
  });

  const files = listFiles(extractDirectory);
  const speakers = JSON.parse(fs.readFileSync(speakersPath, 'utf8'));

  for (const speaker of speakers) {
    const expectedName = imageNames[speaker.name];
    if (!expectedName) {
      continue;
    }

    const imagePath = findImage(files, expectedName);
    if (!imagePath) {
      throw new Error(`No submitted image found for ${speaker.name}`);
    }

    speaker.photo_url = await uploadImage(imagePath, speaker.name);
    console.log(`Uploaded ${speaker.name} -> ${speaker.photo_url}`);
  }

  fs.writeFileSync(speakersPath, `${JSON.stringify(speakers, null, 2)}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
