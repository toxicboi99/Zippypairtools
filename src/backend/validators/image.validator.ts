import { IMAGE_UPLOAD_EXTENSIONS, imageUploadMimeTypes } from "@/backend/lib/upload";
import { createFileSchema } from "@/backend/validators/pdf.validator";

export const imageUploadSchema = createFileSchema({
  allowedMimeTypes: imageUploadMimeTypes,
  allowedExtensions: IMAGE_UPLOAD_EXTENSIONS,
});
