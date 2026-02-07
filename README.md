

# AI Video Knowledge Hub

**Solving Long-Form Content Fatigue with Next.js 16 and Cloudinary AI.**

This project is an intelligent video portal that automatically transforms static webinars into accessible, searchable knowledge libraries. It leverages Cloudinary's AI to generate transcripts and video chapters, allowing users to search for spoken content and jump instantly to the exact moment it was mentioned.

## 🚀 Features

* **AI-Powered Ingestion:** Upload videos directly to Cloudinary with auto-transcription and auto-tagging.
* **Searchable Transcripts:** A real-time sidebar that filters transcript segments as you type.
* **Deep Linking:** Click any line in the transcript to seek the video player to that exact timestamp.
* **Smart Fallbacks:** Automatically switches between JSON transcripts and VTT subtitles depending on availability.
* **Robust Playback:** Custom video player engine built on top of Cloudinary's SDK, optimized for React 19.
* **Auto-Playlist:** Automatically fetches and displays the latest uploaded sessions.

## 🛠️ Tech Stack

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
* **Language:** TypeScript
* **Styling:** Tailwind CSS & [shadcn/ui](https://ui.shadcn.com/)
* **Icons:** Lucide React
* **Media Infrastructure:** [Cloudinary](https://cloudinary.com/) (Video API, Add-ons)
* **Player SDK:** `next-cloudinary` (CldVideoPlayer)

## ⚙️ Environment Setup

1. **Clone the repository:**
```bash
git clone https://github.com/yourusername/ai-video-hub.git
cd ai-video-hub

```


2. **Install dependencies:**
```bash
npm install

```


3. **Configure Environment Variables:**
Create a `.env.local` file in the root directory and add your Cloudinary credentials:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

```


*Note: Ensure your Cloudinary account has the "Google AI Video Transcription" add-on enabled.*
4. **Run the development server:**
```bash
npm run dev

```


## 📂 Project Structure

```
├── app/
│   ├── actions/          # Server Actions (Cloudinary API calls)
│   ├── page.tsx          # Main Knowledge Hub Interface
│   └── layout.tsx        # App Shell
├── components/
│   ├── hub/              # Core Feature Components
│   │   ├── video-stage.tsx      # Video Player Engine
│   │   ├── insights-sidebar.tsx # Searchable Transcript UI
│   │   └── video-playlist.tsx   # Recent Sessions Grid
│   └── ui/               # Shared shadcn/ui components
└── lib/
    └── media.ts          # Transcript parsing utilities

```

## 🤝 Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.