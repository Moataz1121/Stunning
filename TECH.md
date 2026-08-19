# Technology Evaluation: Model Context Protocol (MCP)

## 1. What is it?

The **Model Context Protocol (MCP)** is an open specification introduced in late 2024 and actively standardized across 2025/2026. Inspired by the Language Server Protocol (LSP) in IDEs, MCP defines a universal client-server protocol that standardizes how AI applications (hosts) discover, request, and execute external context, prompts, and tools from third-party services (servers).

Instead of requiring developers to write custom API wrappers, prompt templates, and schema transformers for every tool, MCP provides a standardized JSON-RPC protocol over stdio or HTTP/SSE for:
- **Resources**: Exposing contextual data (files, database records, API responses).
- **Tools**: Declaring executable functions with JSON Schema validation for tool calling.
- **Prompts**: Providing predefined prompt templates and system instructions.

---

## 2. How Could Stunning Use It?

In Stunning's AI Builder, the current implementation uses **dummy integration strings** (`Stripe`, `Shopify`, `Gmail`, `Slack`, `Google Sheets`) injected directly into system prompts.

By adopting MCP, Stunning can evolve from static text prompts to dynamic tool integration:

1. **NestJS Backend as an MCP Host**:
   - The NestJS backend acts as an MCP client host.
   - When a user selects `Stripe` and `Slack`, NestJS connects to standard Stripe and Slack MCP servers.

2. **Dynamic Tool Schema Injection**:
   - NestJS queries the MCP servers for available tools (e.g., `stripe.create_payment_intent`, `slack.post_message`).
   - The tool schemas are automatically passed into the LLM (Gemini/OpenAI) tool-calling parameter, allowing the model to generate accurate API payloads or code structures.

3. **From Architectural Blueprint to Execution**:
   - Users can move from generating static Markdown specs to executing real actions (e.g., verifying a Shopify product schema or posting a test notification to Slack) in a controlled environment.

---

## 3. What Are Its Limitations?

1. **Security & Privilege Boundaries**:
   - MCP servers run tools with access to real backend credentials or APIs. Prompt injection attacks could exploit exposed tools if permissions are not strictly scoped.
   - Lack of fine-grained per-tenant OAuth token management out of the box.

2. **Network Latency & Operational Complexity**:
   - Managing multiple long-lived MCP server processes or HTTP connections introduces network latency and IPC overhead during prompt generation.

3. **Ecosystem & Tool Maturity**:
   - While gaining rapid adoption, community-maintained MCP servers vary in schema quality, error handling, and security updates.

---

## 4. Would I Use It Today? Why or Why Not?

### **Conclusion: YES, with a hybrid execution model.**

#### **Why**:
- **Eliminates Custom Integration Glue**: Using standard MCP tools prevents Stunning from maintaining custom, proprietary integration logic for hundreds of third-party platforms.
- **Standardized Architecture**: Developers building apps inside Stunning can reuse standard MCP servers across environments.

#### **Production Strategy for Stunning**:
- **Phase 1 (Read-Only & Schema Generation)**: Enable MCP servers in read-only mode to inject accurate, live schemas into Gemini prompt generations without risk.
- **Phase 2 (Controlled Tool Execution)**: Enforce human-in-the-loop confirmation before executing any destructive MCP tool call (such as real Stripe charges or Slack channel alerts).
