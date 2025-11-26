// FIXED submitHanlder method - Replace lines 264-346 in UploadImage.js

  const submitHanlder = async () => {
    try {
      setLoader(true);

      const formdata = new FormData();

      // Add profile image if it's a new upload
      if(typeof image !== "string" && image){
        formdata.append('profile_image', {
          uri: image.uri,
          type: image.type,
          name: image.name || 'profile_image.jpg',
        });
        console.log("Added profile image:", {
          uri: image.uri,
          type: image.type,
          name: image.name || 'profile_image.jpg',
        });
      }

      // Add gallery images (only new uploads)
      for (let i = 0; i < arrayImage.length; i++) {
        const galleryImage = arrayImage[i];
        // Check if it's a new upload (has uri property and doesn't include "uploads")
        if(galleryImage?.uri && !galleryImage?.uri?.includes("uploads")){
          formdata.append('gallery_images[]', {
            uri: galleryImage.uri,
            type: galleryImage.type,
            name: galleryImage.name || `gallery_${i}.jpg`,
          });
          console.log(`Added gallery image ${i}:`, {
            uri: galleryImage.uri,
            type: galleryImage.type,
            name: galleryImage.name || `gallery_${i}.jpg`,
          });
        }
      }

      // Check if this is editing mode
      if (route.name === 'Gallery') {
        formdata.append('is_editing', 'true');
      } else {
        formdata.append('is_editing', 'false');
      }

      console.log("Final formdata for step 2:", formdata);

      // Call v2 API step 2
      const response = await AuthService.submitStep2(formdata);

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