'use client';

import { useCallback, useRef, useState } from 'react';
import { useUploadImageModal } from '@/components/cropper/upload-modal';
import Image from 'next/image';

type ImageSource = {
  dataUrl: string;
  file: File;
} | null;

export const ProfileImageUploader = ({ imageUrl, slug }: { imageUrl: string | null; slug: string }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [imgSrc, setImgSrc] = useState<ImageSource>(null);
  const { UploadImageModal, setShowUploadImageModal } = useUploadImageModal({
    imgSrc,
  });

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', () => {
          if (reader.result) {
            setImgSrc({
              dataUrl: reader.result.toString(),
              file,
            });
            setShowUploadImageModal(true);
          }
        });
        reader.readAsDataURL(file);
      }
      e.target.value = '';
    },
    [setShowUploadImageModal],
  );

  return (
    <div>
      <UploadImageModal />
      <input type="file" onChange={onFileChange} hidden ref={ref} accept="image/*" />
      {imageUrl ? (
        <div className="flex items-end gap-3">
          {/* biome-ignore lint/a11y/useKeyWithClickEvents: <explanation> */}
          <div
            onClick={() => ref.current?.click()}
            className="h-24 w-24 cursor-pointer overflow-hidden rounded-full border"
          >
            <Image src={imageUrl} alt={slug} className="h-full w-full object-cover" width={100} height={100} />
          </div>
        </div>
      ) : (
        // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
        <div
          onClick={() => ref.current?.click()}
          className="h-24 w-24 cursor-pointer rounded-full border-orange-200 bg-orange-200"
        >
          <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full text-white">
            <span className="text-3xl font-semibold">{slug.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  );
};
