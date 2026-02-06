/**
 * @fileoverview Clean entry point for the AI Video Knowledge Hub.
 */

'use client';

import * as React from 'react';
import { AppShell } from '@/components/layout/shell';
import { HubContainer, HubSection } from '@/components/hub/layout';
import { VideoStage } from '@/components/hub/video-stage';
import { InsightsSidebar } from '@/components/hub/insights-sidebar';

export default function KnowledgeHubPage() {
  return (
    <AppShell>
      <HubContainer>
        {/* Main Video Viewport */}
        <div className='lg:col-span-2'>
          <HubSection title='AI Knowledge Hub: Webinar Player'>
            <VideoStage />
          </HubSection>
        </div>

        {/* Intelligence Sidebar */}
        <InsightsSidebar />
      </HubContainer>
    </AppShell>
  );
}
