import { IMAGE_UPLOAD_EXTENSIONS, imageUploadMimeTypes } from "@/lib/upload";
import { createFileSchema } from "@/validators/pdf.validator";

export const imageUploadSchema = createFileSchema({
  allowedMimeTypes: imageUploadMimeTypes,
  allowedExtensions: IMAGE_UPLOAD_EXTENSIONS,
});
