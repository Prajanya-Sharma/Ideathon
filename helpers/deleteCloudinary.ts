import { v2 as cloudinary } from "cloudinary";

export async function deleteResourceFromCloudinary(url: string) {
  try {
    // @ts-ignore
    const publicId = url.split("/").pop().split(".")[0]; // Extract the public ID from the URL
    await cloudinary.uploader.destroy(publicId);
    return true
  } catch (error) {
    console.log("Error deleting resource from cloudinary", error);
    return false;
  }
}
