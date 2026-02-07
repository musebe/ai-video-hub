'use client';

import * as React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { UploadIcon, SparklesIcon } from 'lucide-react';

interface VideoUploaderProps {
  onSuccess: (publicId: string, version: string) => void;
}

export function VideoUploader({ onSuccess }: VideoUploaderProps) {
  return (
    <CldUploadWidget
      uploadPreset='video-ai-hub' // Your confirmed preset
      onSuccess={(result) => {
        if (typeof result.info !== 'string' && result.info?.public_id) {
          console.log('🚀 [AI-HUB] Upload Complete:', result.info);

          // Pass the specific version returned by Cloudinary
          // We default to "1" if no version is present to avoid URL errors
          const version = result.info.version
            ? result.info.version.toString()
            : '1';

          onSuccess(result.info.public_id, version);
        }
      }}
      options={{
        sources: ['local', 'url', 'google_drive'],
        resourceType: 'video',
        clientAllowedFormats: ['mp4', 'mov', 'avi'],
      }}
    >
      {({ open, isLoading }) => (
        <button
          onClick={() => open()}
          disabled={isLoading}
          className='flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50'
        >
          {isLoading ? (
            <div className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent' />
          ) : (
            <UploadIcon className='h-4 w-4' />
          )}
          <span>
            {isLoading ? 'Initializing...' : 'Upload & Auto-Transcribe'}
          </span>
          <SparklesIcon className='h-3 w-3 ml-1 opacity-70' />
        </button>
      )}
    </CldUploadWidget>
  );
}
