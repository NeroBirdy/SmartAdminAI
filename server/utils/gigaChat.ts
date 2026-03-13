import { GigaChat } from "gigachat";
import { Agent } from "node:https";

const httpsAgent = new Agent({
  rejectUnauthorized: false,
});

const gigachat = new GigaChat({
  timeout: 600,
  model: "GigaChat-2-Pro",
  credentials: process.env.GIGACHAT_CRED,
  scope: process.env.GIGACHAT_SCOPE,
  httpsAgent: httpsAgent,
});

export { gigachat };
