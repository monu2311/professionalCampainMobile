// Replace the submitStep2 method in AuthService.js with this debugging version:

async submitStep2(formData) {
  try {
    console.log("=== FormData Debug Info ===");
    console.log("FormData type:", typeof formData);
    console.log("FormData instanceof FormData:", formData instanceof FormData);

    // Debug FormData contents
    if (formData && typeof formData.entries === 'function') {
      console.log("FormData entries:");
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, typeof value === 'object' ? {
          type: value.type,
          name: value.name,
          uri: value.uri
        } : value);
      }
    } else {
      console.log("FormData has no entries method or is invalid");
    }

    // IMPORTANT: Don't set Content-Type header for FormData
    const response = await apiV2Client.post('/profile/step/2', formData, {
      timeout: 60000, // Extended timeout for file uploads
    });

    console.log("Step 2 response:", response.data);

    // Update account step in storage
    if (response.data?.data?.current_step) {
      await AsyncStorage.setItem('accountStep', response.data.data.current_step.toString());
    }

    return handleApiSuccess(response);
  } catch (error) {
    console.log("=== Error Debug Info ===");
    console.log("Full error:", error);
    console.log("Error response data:", error.response?.data);
    console.log("Error status:", error.response?.status);
    console.log("Error headers:", error.response?.headers);
    return handleApiError(error);
  }
}