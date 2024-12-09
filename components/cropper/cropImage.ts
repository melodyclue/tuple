import type { Area } from "react-easy-crop";

// create the image with a src of the base64 string
const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

export const getCroppedImg = async (
  imageSrc: string,
  crop: Area,
  originalFile: File,
): Promise<Blob> => {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  /* setting canvas width & height allows us to
    resize from the original image resolution */
  canvas.width = 300;
  canvas.height = 300;

  if (!ctx) {
    throw new Error("Canvas context is null");
  }

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob !== null) {
        const file = new File([blob], originalFile.name, {
          type: "image/png", // PNGフォーマットに統一
        });
        resolve(file);
      }
    }, "image/png"); // PNGの場合は品質パラメータは不要
  });
};
