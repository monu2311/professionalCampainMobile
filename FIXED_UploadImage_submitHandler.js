// FIXED submitHanlder - Replace in UploadImage.js

// Add this import at the top of UploadImage.js
import { createFormData } from '../../apiServices/apiConfig';

const submitHanlder = async () => {
  try {
    setLoader(true);

    // Prepare data object for createFormData helper
    const uploadData = {
      is_editing: route.name === 'Gallery' ? 'true' : 'false'
    };

    // Add profile image if it's a new upload
    if(typeof image !== "string" && image){
      uploadData.profile_image = {
        uri: image.uri,
        type: image.type,
        name: image.name || 'profile_image.jpg',
      };
      console.log("Added profile image:", uploadData.profile_image);
    }

    // Add gallery images (only new uploads)
    const galleryImages = [];
    for (let i = 0; i < arrayImage.length; i++) {
      const galleryImage = arrayImage[i];
      // Check if it's a new upload (has uri property and doesn't include "uploads")
      if(galleryImage?.uri && !galleryImage?.uri?.includes("uploads")){
        galleryImages.push({
          uri: galleryImage.uri,
          type: galleryImage.type,
          name: galleryImage.name || `gallery_${i}.jpg`,
        });
        console.log(`Added gallery image ${i}:`, galleryImages[galleryImages.length - 1]);
      }
    }

    if (galleryImages.length > 0) {
      uploadData.gallery_images = galleryImages;
    }

    console.log("Upload data before FormData creation:", uploadData);

    // Use the working createFormData helper function
    const formData = createFormData(uploadData, ['profile_image', 'gallery_images']);

    console.log("FormData created successfully");

    // Call v2 API step 2 using ProfileService
    const ProfileService = require('../../apiServices/ProfileService').default;
    const response = await ProfileService.uploadImages(uploadData);

    if (response?.success) {
      // Show success message
      const { showSuccessMessage } = require('../../utils/messageHelpers');
      showSuccessMessage('Success', response.message || 'Images uploaded successfully');

      // Navigate based on route
      if (route.name === 'Gallery') {
        navigation?.goBack();
      } else {
        navigation.navigate('Details');
      }
    } else {
      // Handle API error response
      const { showErrorMessage } = require('../../utils/messageHelpers');

      // Check for specific error types
      if (response?.status === 422 && response?.error_type === 'file_upload_format_error') {
        showErrorMessage(
          'File Upload Error',
          'Your app needs to be updated to support the new file upload format. Please contact support.'
        );
      } else {
        showErrorMessage('Upload Error', response.message || 'Failed to upload images');
      }
    }
  } catch (error) {
    console.log("upload error:", error);
    // Enhanced error handling with user feedback
    const { showErrorMessage, showNetworkError } = require('../../utils/messageHelpers');
    const errorMessage = error?.message || 'Failed to upload images';

    if (error?.code === 'NETWORK_ERROR' || !error?.response) {
      showNetworkError();
    } else if (error?.response?.status === 413) {
      showErrorMessage('File Too Large', 'Please select smaller images (max 5MB each)');
    } else if (error?.response?.status === 422) {
      const errorData = error?.response?.data;
      if (errorData?.error_type === 'file_upload_format_error') {
        showErrorMessage(
          'Format Error',
          'File upload format not supported. Please update the app.'
        );
      } else {
        showErrorMessage('Validation Error', errorMessage);
      }
    } else {
      showErrorMessage('Error', errorMessage);
    }
  } finally {
    setLoader(false);
  }
};