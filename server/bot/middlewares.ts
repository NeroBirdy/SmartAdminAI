import { SessionManager } from '@vk-io/session';
import { SceneManager } from '@vk-io/scenes';

import { vk } from './vk';

export const session = new SessionManager();

export const sceneManager = new SceneManager();

vk.updates.on('message_new', session.middleware);
vk.updates.on('message_event', session.middleware);

vk.updates.on('message_new', sceneManager.middleware);
vk.updates.on('message_event', sceneManager.middleware);

vk.updates.on('message_new', sceneManager.middlewareIntercept);
vk.updates.on('message_event', sceneManager.middlewareIntercept);