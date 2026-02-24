'use client';

import { useState, useCallback } from 'react';

interface UploadResult {
  url: string;
  publicId: string;
}

interface UseCloudinaryUploadReturn {
  upload: (file: File) => Promise<UploadResult>;
  uploadMultiple: (files: File[]) => Promise<UploadResult[]>;
  uploading: boolean;
  progress: number;
  error: string | null;
  reset: () => void;
}

const CLOUDINARY_CLOUD = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '';
const CLOUDINARY_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'bangaborn_products';
const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD}/image/upload`;

export function useCloudinaryUpload(): UseCloudinaryUploadReturn {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setUploading(false);
    setProgress(0);
    setError(null);
  }, []);

  const upload = useCallback(async (file: File): Promise<UploadResult> => {
    if (!CLOUDINARY_CLOUD) throw new Error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_PRESET);
    formData.append('folder', 'bangaborn');

    try {
      const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      setProgress(100);
      return { url: data.secure_url as string, publicId: data.public_id as string };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Upload failed';
      setError(msg);
      throw err;
    } finally {
      setUploading(false);
    }
  }, []);

  const uploadMultiple = useCallback(
    async (files: File[]): Promise<UploadResult[]> => {
      setUploading(true);
      setProgress(0);
      const results: UploadResult[] = [];
      for (let i = 0; i < files.length; i++) {
        const result = await upload(files[i]);
        results.push(result);
        setProgress(Math.round(((i + 1) / files.length) * 100));
      }
      setUploading(false);
      return results;
    },
    [upload]
  );

  return { upload, uploadMultiple, uploading, progress, error, reset };
}