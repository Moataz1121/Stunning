# Decisions

## What I Improved

Based on the requirements and constraints of the architecture generator, the following core engineering improvements were implemented across the codebase:

1. **Strict Input Validation (`class-validator`)**:
   - Implemented `GeneratePromptDto` enforcing prompt length bounds (10–2000 characters) and restricting selected integrations to a strict whitelist (`Stripe`, `Shopify`, `Gmail`, `Slack`, `Google Sheets`).
   - Configured global `ValidationPipe({ whitelist: true, transform: true })` in NestJS to strip unapproved fields automatically.

2. **Integration-Aware Dynamic Prompt Construction**:
   - Built a dedicated `GeneratorService` that dynamically constructs the system prompt based on user-selected dummy integrations.
   - Formats integration context explicitly so the Gemini model incorporates relevant dummy schemas and workflows into the response.

3. **Secure Environment & Credential Isolation**:
   - Isolated `GEMINI_API_KEY` strictly to the server-side environment via `@nestjs/config`.
   - Prevented key leakage to the client bundle and abstracted external API errors into safe, user-friendly messages.

4. **Resilient Frontend UX & Single-Flight Protection**:
   - Implemented loading states, error alert banners, and auto-disabling submit button behavior while requests are pending.
   - Handled network drops, non-2xx HTTP responses, and prompt validation states gracefully in the React UI.

5. **Automated Unit Testing & Modular Design**:
   - Structured backend functionality into a clean `GeneratorModule`.
   - Wrote unit tests covering `GeneratorController`, `GeneratorService`, and `AppController` with 100% pass rate.

---

## What I Intentionally Left Out

To keep the solution focused, clean, and achievable within the 2-hour take-home scope, the following features were deliberately left out:

* **Real OAuth & Third-Party Service Connections**: Integrations (`Stripe`, `Shopify`, `Gmail`, `Slack`, `Google Sheets`) serve strictly as context capabilities for the AI prompt and do not execute real API requests or store OAuth tokens.
* **Authentication & User Accounts**: Omitted user registration, JWT session management, and access control.
* **Database Persistence**: Designed as a stateless API. Prompt requests and AI responses are not saved to a database or persistent chat log.
* **Response Streaming / Server-Sent Events (SSE)**: Used standard JSON REST requests/responses rather than chunked streaming.
* **Backend Queues & Asynchronous Workers**: Omitted Redis, RabbitMQ, and background job queueing.
* **Production Rate Limiting & Throttling**: Omitted Redis-backed rate limiters (`@nestjs/throttler`).

---

## Biggest Production Risk

### **Risk: Unbounded External AI API Dependency & Rate Limiting / Cost Spikes**

The single biggest production risk is the direct, un-throttled dependency on an external LLM provider (Google Gemini API) without server-side rate limiting or queuing.

#### **Why it is the biggest risk**:
If this feature goes to production tomorrow under heavy user traffic, multiple concurrent requests will quickly hit Google's free/paid tier rate limits (returning `429 Too Many Requests` or `503 Service Unavailable` errors). Additionally, long prompts or repeated submissions could cause unexpected API cost spikes and high server latency.

#### **60-Minute Production Mitigation Plan**:
1. **Add Rate Limiting**: Implement `@nestjs/throttler` to enforce strict per-IP request limits (e.g. 5 requests per minute).
2. **Implement Retries & Circuit Breaker**: Wrap the Gemini API call in a retry wrapper with exponential backoff to handle transient 503 errors gracefully.
3. **Response Caching**: Add a Redis cache key based on `hash(prompt + integrations)` to serve instant cached responses for identical requests.
