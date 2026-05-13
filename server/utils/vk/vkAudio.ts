import axios from 'axios';
import type { AudioMessageAttachment } from 'vk-io';

export async function downloadAudioMessageToBuffer(
  audio: AudioMessageAttachment,
): Promise<Buffer> {
  const oggUrl = (audio as any).oggUrl || (audio as any).link_ogg;
  const mp3Url = (audio as any).mp3Url || (audio as any).link_mp3;

  const url = oggUrl || mp3Url;
  if (!url) {
    throw new Error('Audio message does not contain a downloadable url');
  }

  const res = await axios.get<ArrayBuffer>(url, { responseType: 'arraybuffer' });
  return Buffer.from(res.data);
}