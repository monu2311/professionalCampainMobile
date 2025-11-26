// FIXED submitStep2 method - Replace lines 197-222 in AuthService.js

  /**
   * Profile Creation Step 2 - Upload Images
   * @param {FormData} formData - Images and metadata
   * @returns {Promise} API response
   */
  async submitStep2(formData) {
    try {
      console.log("Submitting step 2 with formData:", formData);

      // IMPORTANT: Don't set Content-Type header for FormData
      // Let axios automatically set the correct multipart/form-data boundary
      const response = await apiV2Client.post('/profile/step/2', formData, {
        timeout: 60000, // Extended timeout for file uploads
        headers: {
          // Remove Content-Type to let axios handle it automatically
          'Content-Type': undefined,
        },
        transformRequest: [function (data) {
          // Return data as-is for FormData
          return data;
        }],
      });

      console.log("Step 2 response:", response.data);

      // Update account step in storage
      if (response.data?.data?.current_step) {
        await AsyncStorage.setItem('accountStep', response.data.data.current_step.toString());
      }

      return handleApiSuccess(response);
    } catch (error) {
      console.log('submitStep2 Error:', error.response?.data || error.message);
      return handleApiError(error);
    }
  }