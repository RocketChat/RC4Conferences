import fs from 'fs';
import path from 'path';
import { ISpeaker } from './types';

export async function downloadSpeakerImages(speakers: ISpeaker[]): Promise<ISpeaker[]> {
    const shouldLocalizeImages =
        process.env.LOCALIZE_SPEAKER_IMAGES === 'true' ||
        process.env.NEXT_PUBLIC_LOCALIZE_SPEAKER_IMAGES === 'true';

    if (typeof window !== 'undefined') {
        // This function should only run in getStaticProps (Node.js environment)
        return speakers;
    }

    if (!shouldLocalizeImages) {
        return speakers;
    }

    const publicDir = path.join(process.cwd(), 'public');
    const speakerDir = path.join(publicDir, 'speakers');

    if (!fs.existsSync(speakerDir)) {
        fs.mkdirSync(speakerDir, { recursive: true });
    }

    const updatedSpeakers = await Promise.all(speakers.map(async (speaker) => {
        if (!speaker.photo_url || !speaker.photo_url.startsWith('http')) {
            return speaker;
        }

        try {
            const response = await fetch(speaker.photo_url);
            if (!response.ok) return speaker;

            const buffer = await response.arrayBuffer();
            const contentType = response.headers.get('content-type') || 'image/png';
            const ext = contentType.split('/')[1] || 'png';
            const filename = `speaker_${speaker.id}.${ext}`;
            const filePath = path.join(speakerDir, filename);

            fs.writeFileSync(filePath, Buffer.from(buffer));

            return {
                ...speaker,
                photo_url: `/speakers/${filename}`
            };
        } catch (e) {
            console.error(`Failed to download image for speaker ${speaker.id}:`, e);
            return speaker;
        }
    }));

    return updatedSpeakers;
}
