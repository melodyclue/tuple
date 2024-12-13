'use client';

import { type Dispatch, type SetStateAction, useCallback, useMemo, useState } from 'react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogOverlay } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { getCroppedImg } from './cropImage';
import Cropper, { type Area, type MediaSize } from 'react-easy-crop';
import { Slider } from '@/components/ui/slider';
import _revalidatePath from '@/utils/_revalidatePath';

const ASPECT_RATIO = 1;
const CROP_WIDTH = 300;

type ImageSource = {
  dataUrl: string;
  file: File;
} | null;

function UploadImageModal({
  showUploadImageModal,
  setShowUploadImageModal,
  imgSrc,
}: {
  showUploadImageModal: boolean;
  setShowUploadImageModal: Dispatch<SetStateAction<boolean>>;
  imgSrc: ImageSource;
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  /** info zoom */
  const [zoom, setZoom] = useState(1); // 1 - 0.4
  /** info minZoom */
  const [minZoom, setMinZoom] = useState(1);
  /** info cropped area */
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area>();

  const [isUploading, setIsUploading] = useState(false);

  const onCropComplete = useCallback((croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    if (!croppedAreaPixels || !imgSrc) return;
    setIsUploading(true);
    try {
      const croppedImageBlob = await getCroppedImg(imgSrc.dataUrl, croppedAreaPixels, imgSrc.file);

      const formData = new FormData();
      formData.append('file', croppedImageBlob);

      await fetch('/api/file-upload', {
        method: 'POST',
        body: formData,
        headers: {
          contentType: 'multipart/form-data',
        },
      });

      _revalidatePath('/protected/dashboard');
      setShowUploadImageModal(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsUploading(false);
    }
  }, [croppedAreaPixels, imgSrc, setShowUploadImageModal]);

  const onMediaLoaded = useCallback((mediaSize: MediaSize) => {
    const { width, height } = mediaSize;
    const mediaAspectRadio = width / height;
    if (mediaAspectRadio > ASPECT_RATIO) {
      // set zoom to fit the height
      const result = CROP_WIDTH / ASPECT_RATIO / height;
      setZoom(result);
      setMinZoom(result);
      return;
    }
    // set zoom to fit the width
    const result = CROP_WIDTH / width;
    setZoom(result);
    setMinZoom(result);
  }, []);

  return (
    <Dialog open={showUploadImageModal} onOpenChange={setShowUploadImageModal}>
      <DialogOverlay />
      <DialogContent className="w-full max-w-[425px] p-6">
        <DialogHeader className="flex justify-center pt-4">
          <DialogTitle className="text-center">Adjust your avatar</DialogTitle>
        </DialogHeader>
        {imgSrc && (
          <div className="mt-3 flex flex-col items-center justify-center">
            <div className="relative h-[300px] w-[300px] rounded-md">
              <Cropper
                image={imgSrc.dataUrl}
                crop={crop}
                zoom={zoom}
                minZoom={minZoom}
                maxZoom={minZoom + 3}
                aspect={ASPECT_RATIO}
                showGrid={false}
                cropShape="round"
                cropSize={{
                  width: CROP_WIDTH,
                  height: CROP_WIDTH / ASPECT_RATIO,
                }}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                onMediaLoaded={onMediaLoaded}
              />
            </div>
            <div className="mt-4 w-[300px]">
              <Slider
                defaultValue={[minZoom * 100]}
                min={minZoom * 100}
                max={(minZoom + 3) * 100}
                step={1}
                value={[zoom * 100]}
                onValueChange={(value) => {
                  setZoom(value[0] / 100);
                }}
              />
            </div>
            <div className="mt-4">
              <Button
                type="button"
                disabled={isUploading}
                onClick={showCroppedImage}
                className="rounded-3xl border bg-white px-8 py-2 font-medium text-zinc-700 shadow-none"
              >
                {isUploading && (
                  <span className="flex items-center pr-2">
                    <i className="i-tabler-loader-2 animate-spin text-zinc-700" />
                  </span>
                )}
                Crop Image
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export function useUploadImageModal({ imgSrc }: { imgSrc: ImageSource }) {
  const [showUploadImageModal, setShowUploadImageModal] = useState(false);

  const UploadImageModalCallback = useCallback(() => {
    return (
      <UploadImageModal
        imgSrc={imgSrc}
        showUploadImageModal={showUploadImageModal}
        setShowUploadImageModal={setShowUploadImageModal}
      />
    );
  }, [showUploadImageModal, imgSrc]);

  return useMemo(
    () => ({
      setShowUploadImageModal,
      UploadImageModal: UploadImageModalCallback,
    }),
    [UploadImageModalCallback],
  );
}
