# AI Code Reviewer — Backend

A production-ready Node.js backend that leverages the **Groq API** (LLaMA 3 70B) to provide structured, AI-powered code reviews. Submit source code or a diff and receive actionable feedback on bugs, performance, security, and style.

## Tech Stack

- **Node.js** (ES Modules)
- **Express.js**
- **groq-sdk**
- **dotenv**
- **cors**

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── groq.js              # Groq SDK client initialization
│   ├── constants/
│   │   └── prompts.js           # System prompt & prompt builders
│   ├── controllers/
│   │   └── review.controller.js # Thin request handler
│   ├── middleware/
│   │   ├── error.middleware.js   # Global error handler
│   │   └── validate.middleware.js# Request validation
│   ├── routes/
│   │   └── review.routes.js     # Route definitions
│   ├── services/
│   │   ├── groq.service.js      # Groq API interaction
│   │   └── review.service.js    # Review business logic
│   ├── utils/
│   │   └── parser.js            # Safe JSON parsing
│   ├── app.js                   # Express app setup
│   └── server.js                # Server entry point
├── .env
├── package.json
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend/` directory (or edit the existing one):

```env
GROQ_API_KEY=your_groq_api_key_here
PORT=3000
NODE_ENV=development
```

> Get your Groq API key from [https://console.groq.com](https://console.groq.com)

### 3. Run the Server

**Development** (with auto-restart on file changes):

```bash
npm run dev
```

**Production**:

```bash
npm start
```

The server will start at `http://localhost:3000`.

## API Routes

### `POST /api/review`

Submit code or a diff for AI-powered review.

**Request Body:**

```json
{
  "code": "string",
  "language": "javascript",
  "diff": "optional string"
}
```

- If `diff` is provided, only the diff is reviewed.
- Otherwise, the full `code` is reviewed.
- `language` is optional (defaults to `"unknown"`).

**Response:**

```json
{
  "issues": [
    {
      "type": "bug",
      "severity": "high",
      "line": 12,
      "message": "Possible null reference",
      "suggestion": "Check if variable exists before use"
    }
  ],
  "summary": "string"
}
```

**Issue Types:** `bug` | `performance` | `security` | `style`

**Severity Levels:** `low` | `medium` | `high`

---

### `GET /health`

Health check endpoint.

**Response:**

```json
{
  "status": "ok",
  "timestamp": "2026-03-22T07:05:52.000Z"
}
```

## Error Handling

All errors return a consistent JSON structure:

```json
{
  "error": "Something went wrong",
  "message": "Detailed error message (hidden in production)"
}
```

- **400** — Validation errors (missing `code`/`diff`, wrong types)
- **404** — Route not found
- **500** — Internal server errors
