/**
 * @fileoverview Searchable Transcript Sidebar with real-time filtering.
 */

'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { SearchIcon, BookOpenIcon, ClockIcon } from 'lucide-react';
import { HubSection } from './layout';

// We'll replace this with real data in the next step
const mockTranscript = [
  {
    time: '01:12',
    seconds: 72,
    text: 'Welcome to the Next.js Media Upload tutorial.',
  },
  {
    time: '05:22',
    seconds: 322,
    text: 'In this section, we transition to using Google AI for automated video chaptering...',
  },
  {
    time: '12:45',
    seconds: 765,
    text: "Finally, let's look at how we deliver these assets using f_auto and q_auto.",
  },
];

export function InsightsSidebar() {
  const [query, setQuery] = React.useState('');

  // React "No-Effect" Standard: Derive filtered results during render
  const filteredTranscript = mockTranscript.filter((item) =>
    item.text.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className='space-y-6'>
      <HubSection title='Search Transcript'>
        <Card className='border-none shadow-none h-full flex flex-col w-full'>
          <div className='p-4 border-b'>
            <div className='relative'>
              <SearchIcon className='absolute left-3 top-3 h-4 w-4 text-muted-foreground' />
              <Input
                placeholder='Search insights...'
                className='pl-10'
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <CardContent className='flex-1 overflow-y-auto p-4 space-y-4 max-h-100'>
            {filteredTranscript.length > 0 ? (
              filteredTranscript.map((item, i) => (
                <div
                  key={i}
                  className='group cursor-pointer rounded-lg p-2 transition-colors hover:bg-muted'
                >
                  <div className='flex items-center gap-2 mb-1'>
                    <ClockIcon className='h-3 w-3 text-primary' />
                    <span className='text-[10px] font-bold text-primary'>
                      {item.time}
                    </span>
                  </div>
                  <p className='text-sm leading-relaxed text-muted-foreground'>
                    &quot;{item.text}&quot;
                  </p>
                </div>
              ))
            ) : (
              <p className='text-center text-sm text-muted-foreground py-10'>
                No matches found.
              </p>
            )}
          </CardContent>
        </Card>
      </HubSection>

      <HubSection title='AI Smart Chapters'>
        <Card className='border-none shadow-none w-full'>
          <CardContent className='p-4 space-y-2'>
            <div className='flex items-center gap-3 p-3 rounded-lg border bg-card hover:border-sky-200 cursor-pointer'>
              <BookOpenIcon className='h-4 w-4 text-sky-500' />
              <span className='text-sm font-medium'>Architecture Overview</span>
            </div>
          </CardContent>
        </Card>
      </HubSection>
    </div>
  );
}
