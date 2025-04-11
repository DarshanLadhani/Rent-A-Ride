import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});


export const uploadOnCloudinary = async function (localFilePath) {
    try {
        if (!localFilePath) return null;

        // Upload File
        const response = await cloudinary.uploader.upload(localFilePath , {
            resource_type:'auto', // Detect Type of file
        })

        // File Uploaded Successfully
        // console.log("File Has Uploaded Sucessfully");
        // console.log(response); // Complete response object
        // console.log(response.url); // Cloudinary URL
        
        fs.unlinkSync(localFilePath);

        return response
        
    } catch (error) {
        fs.unlinkSync(localFilePath) // Remove the locally saved temporary file as the upload operation got failed 
        return null;
    } 
}