import { useContext, useState } from "react";
import { TransactionFormContext } from "../features/transactions/TransactionFormContextProvider";

export const useImageHandler = () => {
    const { updateForm } = useContext(TransactionFormContext);
    const [thumbnail, setThumbnail] = useState(null);

    //Recursive image compressor
    const compressImage = async (file, maxSize) => {
        return new Promise((resolve) => {
            //Define image to draw on canvas
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);

            img.onload = async () => {
                //Define canvas and canvas context to reduce uploaded image resolution. 
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                //Get original image resolution
                let width = img.width;
                let height = img.height;

                //Calculate original image megapixel
                const inputMP = width * height;

                //Calculate max image megapizel
                const maxMP = 1920 * 1080;

                //Downscale image resolution if original MP is bigger than max MP
                if (inputMP > maxMP) {
                    //Calculate resolution scale using formula
                    const mpScale = Math.sqrt((maxMP / inputMP))

                    //Set new resolution retaining aspect ratio
                    width = width * mpScale
                    height = height * mpScale
                }

                //Set canvas width and height before drawing image
                canvas.width = width;
                canvas.height = height;

                //Draw image on canvas
                ctx.drawImage(img, 0, 0, width, height)

                //Set image quality
                let imageQuality = 1
                let blob = await new Promise((resolve) =>
                    canvas.toBlob(resolve, 'image/jpeg', imageQuality)
                );

                //Compress image if file size is too large
                while (blob.size >= maxSize && imageQuality > 0.1) {
                    imageQuality -= 0.1;
                    blob = await new Promise((resolve) =>
                        canvas.toBlob(resolve, 'image/jpeg', imageQuality)
                    )
                }

                URL.revokeObjectURL(img.src);
                resolve(blob);
            };
        });
    };

    const setImageAndThumbnail = (image) => {
        updateForm('image', image);
        setThumbnail(URL.createObjectURL(image))
    }

    //Image field handler
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        const maxSize = 200 * 1024
        if (file) {
            console.log(file.name)
            if (file.size > maxSize) {
                const compressedImageBlob = await compressImage(file, maxSize);
                console.log(compressedImageBlob)
                const compressedImageFile = new File([compressedImageBlob], file.name, { type: compressedImageBlob.type, lastModified: Date.now() });
                setImageAndThumbnail(compressedImageFile)
            } else {
                setImageAndThumbnail(file)
            }
        }
    }

    return {
        thumbnail,
        handleImageChange
    };
}