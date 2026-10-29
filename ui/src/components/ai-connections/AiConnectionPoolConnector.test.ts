import { describe, expect, it } from "vitest";
import type { AiManagedConnectionSummary } from "@paperclipai/shared";
import { memberOf } from "./AiConnectionPoolConnector";

const account: AiManagedConnectionSummary = { id: "connection", grantId: "grant", companyId: "company", provider: "openai", method: "api_key", name: "Gateway", ownership: "personal", isDefault: false, status: "connected", routing: { kind: "gateway", protocol: "chat", auth: "bearer", baseUrl: "https://gateway.example/v1", models: [{ id: "model" }] } };

describe("connection pool member defaults", () => {
  it("uses OpenCode and the gateway model for a chat gateway", () => {
    expect(memberOf(account).profile).toEqual({ provider: "opencode", model: "paperclip/model" });
  });
  it.each([
    ["responses", { provider: "codex", model: "model" }],
    ["messages", { provider: "acpx", acpxAgent: "claude", model: "model" }],
  ] as const)("uses the %s protocol instead of the provider name", (protocol, profile) => {
    expect(memberOf({ ...account, routing: { ...account.routing!, protocol } }).profile).toEqual(profile);
  });
});
