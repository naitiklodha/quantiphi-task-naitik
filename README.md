# AI Chat Assistant

An intelligent chat interface with real-time streaming, conversation history, and multi-provider AI support.

**Live:** [quantiphi.naitiklodha.in](https://quantiphi.naitiklodha.in)

---

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | Next.js 16 (App Router) | Latest stable, server components, streaming support |
| Styling | Tailwind CSS + shadcn/ui | Utility-first CSS with accessible, copy-paste components |
| Backend | Next.js API Routes | Co-located API with frontend, no separate server needed |
| Database | MongoDB (Atlas) | Flexible schema for conversations, easy nested documents |
| ODM | Mongoose | Schema validation, connection caching, TypeScript support |
| AI - Primary | Google Gemini (`gemini-3.6-flash`) | Free tier, no API key needed for testing |
| AI - Alt | OpenAI (`gpt-4o`) | Industry standard, requires paid API key |
| AI - Alt | Anthropic Claude (`claude-sonnet-4-20250514`) | Strong reasoning, requires paid API key |
| Components | shadcn/ui | Accessible, customizable, lives in your codebase |
| Fonts | DM Sans + JetBrains Mono | Clean sans-serif for UI, monospace for code |

---

## Features

- **Real-time Streaming** — Text appears character-by-character via Server-Sent Events
- **Conversation History** — Sidebar with persistent threads stored in MongoDB
- **Tone Toggle** — Switch between Professional, Casual, and Concise response styles
- **Provider Selector** — Choose between Gemini, OpenAI, or Claude per conversation
- **Search** — `Cmd+K` to quickly find past conversations
- **Responsive** — Collapsible sidebar on mobile with hamburger menu
- **Error Handling** — Informative error states with dismiss options
- **Keyboard Navigation** — Full keyboard support with visible focus states

---

## Edge Cases Handled

| Case | Solution |
|------|----------|
| Empty message submission | Send button disabled when input is empty |
| Long messages | Auto-resizing textarea, max height capped |
| Concurrent requests | Send disabled while streaming is active |
| API failure | Error displayed with dismiss option, conversation preserved |
| Network disconnection | Graceful error message, partial response handling |
| Empty history | Friendly empty state with CTA to start first chat |
| Special characters / XSS | MongoDB sanitization, React auto-escaping |
| Rate limiting | Error surfaced from API with descriptive message |
| Streaming abort | Stream error handling, UI resets properly |
| Browser refresh | Conversations persist in MongoDB, reload restores state |
| Missing API keys | Validation on provider switch, clear error message |
| Invalid provider | Backend validation, fallback to default |

---

## Shneiderman's 8 Rules of Design

Applied throughout the interface:

### 1. Strive for Consistency
- Uniform color system (teal primary, navy sidebar)
- Consistent spacing, typography, and component patterns
- Same interaction patterns for similar elements

### 2. Seek Universal Usability
- Responsive design for mobile, tablet, and desktop
- Keyboard accessible with visible focus states
- ARIA labels on all interactive elements
- Screen reader friendly with semantic HTML

### 3. Offer Informative Feedback
- Streaming cursor shows AI is responding
- Typing indicator dots during initial load
- Error alerts with descriptive messages
- Toast-style feedback on provider switch failure

### 4. Design Dialogs to Yield Closure
- Empty state clearly indicates next action
- Search opens and closes with `Cmd+K` / `Escape`
- Conversation selection provides immediate visual feedback

### 5. Prevent Errors
- Send button disabled when no input
- Input disabled during streaming
- Provider switch validates API key availability
- Confirmation before destructive actions

### 6. Permit Easy Reversal of Actions
- Error dismiss button
- Search can be closed without selection
- Provider can be switched back anytime

### 7. Keep Users in Control
- Clear affordances on all buttons
- Predictable behavior (click = action)
- No unexpected state changes
- User controls tone and provider per conversation

### 8. Reduce Short-Term Memory Load
- Conversation history always visible in sidebar
- Active conversation highlighted
- Tone and provider state preserved per conversation
- Search finds past conversations instantly

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gemini API key (free from [Google AI Studio](https://aistudio.google.com/apikey))

### Installation

```bash
git clone https://github.com/naitiklodha/quantiphi-task-naitik.git
cd quantiphi-task-naitik
npm install
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Required:
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/ai-chat-app?appName=Cluster0
GEMINI_API_KEY=your_gemini_key_here
```

Optional (for OpenAI/Claude):
```
OPENAI_API_KEY=your_openai_key_here
CLAUDE_API_KEY=your_claude_key_here
```

### Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/conversations` | List all conversations |
| `POST` | `/api/conversations` | Create new conversation |
| `GET` | `/api/conversations/[id]` | Get conversation with messages |
| `DELETE` | `/api/conversations/[id]` | Delete a conversation |
| `PATCH` | `/api/conversations/[id]/tone` | Update response tone |
| `PATCH` | `/api/conversations/[id]/provider` | Update AI provider |
| `POST` | `/api/chat` | Send message, stream response (SSE) |

---

## Project Structure

```
ai-chat-app/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/route.ts          # Streaming chat endpoint
│   │   │   └── conversations/
│   │   │       ├── route.ts           # GET all, POST new
│   │   │       └── [id]/
│   │   │           ├── route.ts       # GET one, DELETE one
│   │   │           ├── tone/route.ts  # PATCH tone
│   │   │           └── provider/route.ts  # PATCH provider
│   │   ├── globals.css                # Tailwind + custom tokens
│   │   ├── layout.tsx                 # Root layout with fonts
│   │   └── page.tsx                   # Main chat page
│   ├── components/
│   │   ├── ChatArea.tsx               # Main chat view
│   │   ├── ChatInput.tsx              # Message input
│   │   ├── ChatMessage.tsx            # Message bubble
│   │   ├── ConversationSidebar.tsx    # History sidebar
│   │   ├── ProviderSelector.tsx       # AI provider dropdown
│   │   ├── SearchBar.tsx              # Cmd+K search
│   │   └── ToneToggle.tsx             # Tone selector
│   ├── lib/
│   │   ├── ai-providers.ts            # Gemini/OpenAI/Claude streaming
│   │   ├── mongodb.ts                 # Mongoose connection
│   │   └── utils.ts                   # shadcn utilities
│   └── models/
│       └── Conversation.ts            # Mongoose schema
├── .env.example                       # Env template
└── package.json
```

---

## Deployment

Deployed on [quantiphi.naitiklodha.in](https://quantiphi.naitiklodha.in) using Netlify.



---

## Testing Providers

| Provider | Status | How to Enable |
|----------|--------|---------------|
| Gemini | Working | Add `GEMINI_API_KEY` to `.env.local` |
| OpenAI | Endpoint ready | Add `OPENAI_API_KEY` to `.env.local` |
| Claude | Endpoint ready | Add `CLAUDE_API_KEY` to `.env.local` |

---

## License

MIT
