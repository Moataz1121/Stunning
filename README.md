# Stunning — AI Builder Landing Page

A full-stack application that allows users to describe a software application or workflow prompt, select context integrations (**Stripe**, **Shopify**, **Gmail**, **Slack**, **Google Sheets**), and generate software architecture specifications powered by Google Gemini AI.

---

## 🚀 Tech Stack

- **Frontend**: React 19, Vite, Vanilla CSS
- **Backend**: NestJS 11, TypeScript, `@google/genai` (Gemini API), `class-validator`, `class-transformer`, `@nestjs/config`
- **AI Model**: Google Gemini (`gemini-3.6-flash`)

---

## 📁 Project Structure

```text
stunning-task/
├── backend/                  # NestJS API application
│   ├── src/
│   │   ├── generator/        # Feature module for AI prompt generation
│   │   │   ├── dto/          # Input validation DTOs (GeneratePromptDto)
│   │   │   ├── generator.controller.ts # POST /api/generate endpoint
│   │   │   ├── generator.service.ts    # System prompt builder & Gemini API client
│   │   │   └── generator.module.ts
│   │   ├── app.module.ts     # Root module with ConfigModule & CORS
│   │   └── main.ts           # Application bootstrap & global ValidationPipe
│   └── test/                 # Integration tests
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── services/         # API fetch client (api.js)
│   │   ├── App.jsx           # Main landing page UI & state management
│   │   └── App.css           # Styling & responsive layout
│   └── index.html
├── DECISIONS.md              # Architectural decisions & production risk analysis
├── TECH.md                   # Latest technology evaluation (Model Context Protocol)
└── README.md                 # Project documentation
```

---

## ⚙️ Prerequisites

- **Node.js**: v18.x or higher
- **npm**: v9.x or higher
- **Google Gemini API Key**: Obtain a free key from [Google AI Studio](https://aistudio.google.com/)

---

## 🔐 Environment Variables

Create `.env` files in both the `backend` and `frontend` directories (or copy from `.env.example`):

### Backend (`backend/.env`)
```env
PORT=3000
FRONTEND_URL=http://localhost:5173
GEMINI_API_KEY=your_gemini_api_key_here
```

### Frontend (`frontend/.env`)
```env
VITE_API_BASE_URL=http://localhost:3000
```

---

## 📦 Installation

Install dependencies for both backend and frontend:

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

---

## 💻 Running the Application

### 1. Start Backend Server
```bash
cd backend
npm run start:dev
```
The NestJS backend will start at `http://localhost:3000`.

### 2. Start Frontend App
In a new terminal window:
```bash
cd frontend
npm run dev
```
The React frontend will start at `http://localhost:5173`.

---

## 🌐 API Endpoint Specification

### `POST /api/generate`

#### Request Body
```json
{
  "prompt": "Build an automated order processing app that notifies team members.",
  "integrations": ["Shopify", "Slack"]
}
```

#### Validation Rules
- `prompt`: String, required, minimum 10 characters, maximum 2000 characters.
- `integrations`: Array of strings, optional. Allowed values: `Stripe`, `Shopify`, `Gmail`, `Slack`, `Google Sheets`.

#### Response Body (`200 OK`)
```json
{
  "result": "Generated software architecture specification markdown..."
}
```

---

## 🔌 How Context Integrations Work

The selected integrations (**Stripe**, **Shopify**, **Gmail**, **Slack**, **Google Sheets**) act as **dummy capabilities context**. 

When selected:
1. The backend dynamically constructs a system prompt injecting the selected tools.
2. The system prompt instructs Gemini to incorporate mock event handlers, webhook triggers, or data schemas for those integrations into the generated software architecture.
3. No real connections or OAuth credentials for third-party services are required or established.

---

## 🧪 Running Tests & Build Checks

### Backend Unit Tests & Build
```bash
cd backend
npm test         # Run unit test suites (Controller, Service, App)
npm run build    # Verify NestJS TypeScript compilation
```

### Frontend Build & Lint Check
```bash
cd frontend
npm run lint     # Run ESLint validation
npm run build    # Verify Vite production bundle build
```

---

## 📄 Additional Documentation
- [DECISIONS.md](DECISIONS.md) — What was improved, intentionally omitted, and the single biggest production risk with a 60-minute mitigation plan.
- [TECH.md](TECH.md) — Evaluation of recent industry technology (**Model Context Protocol - MCP**) and its application to Stunning.
