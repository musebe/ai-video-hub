/**
 * @fileoverview API Route for AI Video Uploads.
 * Handles the heavy lifting of triggering AI transcription and tagging.
 * @module app/api/upload/route
 */

import { v2 as cloudinary } from 'cloudinary';
import { NextResponse } from 'next/server';

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as string; // Expecting base64 or URL

        /**
         * THE AI ENGINE:
         * Requesting transcription (vtt) and tagging (categorization)
         */
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: 'video',
            folder: 'ai-video-hub',
            // Trigger Google AI Video Transcription
            raw_convert: 'google_speech:vtt',
            // Trigger Google Automatic Video Tagging
            categorization: 'google_video_tagging',
            auto_tagging: 0.6, // Confidence threshold
            // Optimization for long-form delivery
            eager: [
                { streaming_profile: 'full_hd', format: 'm3u8' }
            ],
            eager_async: true,
        });

        return NextResponse.json({
            success: true,
            publicId: uploadResponse.public_id,
            transcriptUrl: uploadResponse.info?.raw_convert?.google_speech?.vtt_url,
            tags: uploadResponse.info?.categorization?.google_video_tagging?.data
        });

    } catch (error) {
        console.error("❌ AI Hub Upload Error:", error);
        return NextResponse.json({ success: false, error: "Upload Failed" }, { status: 500 });
    }
}