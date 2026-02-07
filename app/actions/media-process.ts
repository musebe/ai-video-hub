"use server"

import { v2 as cloudinary } from 'cloudinary';
import { parseTranscriptJSON, TranscriptSegment } from "@/lib/media";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
});

interface CloudinaryResource {
    public_id: string;
    version: number;
    format: string;
    duration: number;
    secure_url: string;
    created_at: string;
}

// --- NEW: VTT PARSER UTILITY ---
function parseVTT(fileContent: string): TranscriptSegment[] {
    const segments: TranscriptSegment[] = [];
    const lines = fileContent.split('\n');
    let currentStart = 0;
    let currentEnd = 0;

    // Regex to match VTT timestamps: 00:00:00.500 --> 00:00:05.000
    const timeRegex = /(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;

    const timeToSeconds = (t: string) => {
        const [h, m, s] = t.split(':');
        return (parseInt(h) * 3600) + (parseInt(m) * 60) + parseFloat(s);
    };

    for (const line of lines) {
        const match = line.match(timeRegex);
        if (match) {
            currentStart = timeToSeconds(match[1]);
            currentEnd = timeToSeconds(match[2]);
        } else if (line.trim() && line.trim() !== 'WEBVTT' && !line.match(/^\d+$/)) {
            // If line is not header, not a number, and has text -> it's content
            segments.push({
                startTime: currentStart,
                endTime: currentEnd,
                text: line.trim()
            });
        }
    }
    return segments;
}

/**
 * GET TRANSCRIPT - Now with VTT Fallback
 */
export async function getTranscriptAction(publicId: string, videoVersion?: string): Promise<TranscriptSegment[]> {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    if (!cloudName) return [];

    const baseUrl = `https://res.cloudinary.com/${cloudName}/raw/upload`;
    const cleanId = publicId.replace(/^webinar\//, '');

    // Check up to +15 seconds to be extremely safe
    const versionsToCheck = [];
    if (videoVersion) {
        const v = parseInt(videoVersion);
        if (!isNaN(v)) {
            for (let i = 0; i <= 15; i++) versionsToCheck.push(v + i);
        }
    }

    // 1. GENERATE CANDIDATE URLS (JSON + VTT)
    const candidates: { url: string; type: 'json' | 'vtt' }[] = [];

    versionsToCheck.forEach(v => {
        // Priority 1: JSON Transcript (Rich metadata)
        candidates.push({ url: `${baseUrl}/v${v}/${publicId}.transcript`, type: 'json' });
        candidates.push({ url: `${baseUrl}/v${v}/webinar/${cleanId}.transcript`, type: 'json' });

        // Priority 2: VTT Subtitles (Reliable Fallback)
        candidates.push({ url: `${baseUrl}/v${v}/${publicId}.en-US.vtt`, type: 'vtt' }); // Most common
        candidates.push({ url: `${baseUrl}/v${v}/webinar/${cleanId}.en-US.vtt`, type: 'vtt' });
        candidates.push({ url: `${baseUrl}/v${v}/${publicId}.vtt`, type: 'vtt' });
    });

    // Add unversioned fallbacks at the end
    candidates.push({ url: `${baseUrl}/${publicId}.transcript`, type: 'json' });
    candidates.push({ url: `${baseUrl}/${publicId}.en-US.vtt`, type: 'vtt' });

    // 2. CHECK CANDIDATES
    for (const candidate of candidates) {
        try {
            console.log(`📡 [AI-HUB] Checking (${candidate.type}): ${candidate.url}`);
            const response = await fetch(candidate.url, { cache: 'no-store' });

            if (response.ok) {
                if (candidate.type === 'json') {
                    const data = await response.json();
                    console.log(`✅ [AI-HUB] JSON FOUND at: ${candidate.url}`);
                    return parseTranscriptJSON(data);
                } else {
                    const text = await response.text();
                    console.log(`✅ [AI-HUB] VTT FOUND at: ${candidate.url}`);
                    return parseVTT(text);
                }
            }
        } catch {
            continue;
        }
    }

    console.warn(`⚠️ [AI-HUB] 404: No transcript or VTT found for ${publicId}`);
    return [];
}

export async function getPlaylistAction() {
    try {
        const result = await cloudinary.search
            .expression('resource_type:video AND folder:webinar')
            .sort_by('created_at', 'desc')
            .max_results(12)
            .execute();

        return result.resources.map((video: CloudinaryResource) => {
            const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
            // Robust thumbnail generation
            const safePublicId = video.public_id.replace(/\.[^/.]+$/, "");
            const thumbUrl = `https://res.cloudinary.com/${cloudName}/video/upload/w_300,h_170,c_fill,q_auto,f_jpg/${safePublicId}.jpg`;

            return {
                publicId: video.public_id,
                version: video.version,
                format: video.format,
                duration: video.duration,
                thumbnailUrl: thumbUrl
            };
        });
    } catch (error) {
        console.error("Failed to fetch playlist:", error);
        return [];
    }
}