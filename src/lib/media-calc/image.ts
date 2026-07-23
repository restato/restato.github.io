export type ImageOutputMime = 'image/jpeg' | 'image/webp' | 'image/png';

const formatName = (mime: string) => mime.split('/')[1]?.replace('jpeg', 'JPG').toUpperCase() ?? mime;

export async function decodeAndEncodeImage(file: File, output: ImageOutputMime, quality = 0.9): Promise<Blob> {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    const input = file.name.split('.').pop()?.toUpperCase() || file.type || 'image';
    throw new Error(`This browser does not decode ${input}. Try Safari or convert the file on a device that supports it.`);
  }
  try {
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable in this browser.');
    if (output === 'image/jpeg') {
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, canvas.width, canvas.height);
    }
    context.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, output, quality));
    if (!blob || blob.type !== output) throw new Error(`This browser cannot encode ${formatName(output)}.`);
    return blob;
  } finally {
    bitmap.close();
  }
}

export async function createIconBlobs(file: File, sizes = [16, 32, 48, 180, 192, 512]): Promise<Array<{ size: number; blob: Blob }>> {
  let bitmap: ImageBitmap;
  try { bitmap = await createImageBitmap(file); } catch { throw new Error('This browser cannot decode that image.'); }
  try {
    return await Promise.all(sizes.map(async (size) => {
      const canvas = document.createElement('canvas');
      canvas.width = size; canvas.height = size;
      const context = canvas.getContext('2d');
      if (!context) throw new Error('Canvas is unavailable in this browser.');
      context.clearRect(0, 0, size, size);
      const scale = Math.min(size / bitmap.width, size / bitmap.height);
      const width = bitmap.width * scale; const height = bitmap.height * scale;
      context.drawImage(bitmap, (size - width) / 2, (size - height) / 2, width, height);
      const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
      if (!blob) throw new Error('PNG encoding failed.');
      return { size, blob };
    }));
  } finally { bitmap.close(); }
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename; anchor.click();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
