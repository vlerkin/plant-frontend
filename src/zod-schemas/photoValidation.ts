import { ACCEPTED_IMAGE_TYPES, MAX_FILE_SIZE } from "@/lib/utils";
import { z } from "zod";

export const checkPhotoUploadFormData = z.object({
  photo: z
    .any()
    .refine(
      (files) => !files || !files[0] || files?.[0]?.size <= MAX_FILE_SIZE,
      `Max image size is 10MB.`
    )
    .refine(
      (files) =>
        !files || !files[0] || ACCEPTED_IMAGE_TYPES.includes(files?.[0]?.type),
      "Only .jpg, .jpeg, .png and .webp formats are supported."
    ),
});

export type DataFromPhotoUploadForm = z.infer<typeof checkPhotoUploadFormData>;
