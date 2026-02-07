// lib/media.ts
export interface TranscriptSegment {
    startTime: number;
    endTime: number;
    text: string;
}

interface GoogleTranscriptBlock {
    transcript: string;
    confidence: number;
    words: {
        word: string;
        start_time: number;
        end_time: number;
    }[];
}

export function parseTranscriptJSON(jsonArray: GoogleTranscriptBlock[]): TranscriptSegment[] {
    if (!Array.isArray(jsonArray)) return [];

    return jsonArray.map((block) => ({
        startTime: block?.words?.[0]?.start_time ?? 0,
        endTime: block?.words?.[block.words.length - 1]?.end_time ?? 0,
        text: block?.transcript ?? "",
    }));
}
