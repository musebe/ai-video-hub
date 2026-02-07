/**
 * @fileoverview API route for polling Cloudinary transcript status.
 */

import { NextResponse, type NextRequest } from 'next/server';
import { parseTranscriptJSON } from '@/lib/media';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const url = searchParams.get('url');

    if (!url) {
        return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    try {
        // Attempt to fetch the actual .transcript file from Cloudinary
        const response = await fetch(url, { cache: 'no-store' });

        if (response.ok) {
            const transcriptData = await response.json();
            const transcript = parseTranscriptJSON(transcriptData);

            return NextResponse.json(
                { available: true, transcript },
                { status: 200 }
            );
        } else {
            // Still 404ing or pending
            return NextResponse.json({ available: false }, { status: 200 });
        }
    } catch (error) {
        console.error('Polling error:', error);
        return NextResponse.json({ available: false }, { status: 500 });
    }
}