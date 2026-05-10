import { vk } from "./vk";
import { session, sceneManager } from "./middlewares";

import { registerScenes } from "./scenes";

import { registerMessageHandler } from "./handlers/message.handler";
import { registerChatMessageHandler } from "./handlers/chatMessage.handler";
import { registerEventHandler } from "./handlers/event.handler";

registerScenes();

export async function startBot() {
  vk.updates.on("message_new", session.middleware);
  vk.updates.on("message_event", session.middleware);

  vk.updates.on("message_new", sceneManager.middleware);
  vk.updates.on("message_event", sceneManager.middleware);

  vk.updates.on("message_new", sceneManager.middlewareIntercept);
  vk.updates.on("message_event", sceneManager.middlewareIntercept);

  registerMessageHandler();
  registerChatMessageHandler();
  registerEventHandler();

  await vk.updates.start();

  console.log("VK bot started");
}
