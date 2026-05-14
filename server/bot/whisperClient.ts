import axios from 'axios';
import FormData from 'form-data';

export async function transcribeWithWhisper(fileBuffer: Buffer): Promise<string> {
  const form = new FormData();
  form.append('file', fileBuffer, {
    filename: 'audio.ogg',
    contentType: 'audio/ogg',
  });

  form.append('model', 'small');
  form.append('language', 'ru');
  form.append('response_format', 'json');

  const res = await axios.post(
    'http://127.0.0.1:2638/v1/audio/transcriptions',
    form,
    { headers: form.getHeaders() },
  );

  const data = res.data as { text?: string };
  return data.text ?? '';
}