// services/ChatService.js
import NotificationService from './NotificationService';
import {
  // Chat Request APIs
  sendChatRequest,
  getPendingChatRequests,
  getSentChatRequests,
  approveChatRequest,
  rejectChatRequest,
  cancelChatRequest,
  checkChatRequestStatus,
  getChatRequestStats,
  // Chat APIs
  getChatUser,
  getChatAllUser,
  getChatHistory,
  sendChatMessage,
  getNewMsg,
  getChatForEdit,
  updateChatMessage,
  deleteChatMessage,
  acceptedChatRequest,
} from '../reduxSlice/apiSlice';

class ChatService {
  /**
   * ============================================
   * CHAT REQUEST MODULE
   * ============================================
   */

  /**
   * Send chat request to a user
   * @param {number} userId - Target user ID
   * @param {string} message - Optional message with request
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async sendChatRequest(userId, message = '', dispatch) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const data = message ? { message } : {};
      const response = await dispatch(sendChatRequest(userId, data));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Chat request sent successfully',
        );
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(response?.message || 'Failed to send chat request');
      }
    } catch (error) {
      console.error('Send chat request error:', error);
      NotificationService.error(
        error.message || 'Failed to send chat request',
      );
      throw error;
    }
  }

  /**
   * Get pending chat requests (received) with pagination and search
   * @param {Object} dispatch - Redux dispatch
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @param {string} searchQuery - Search query (default: '')
   * @returns {Promise<Object>}
   */
  async getPendingRequests(dispatch, page = 1, pageSize = 20, searchQuery = '') {
    try {
      // For now, we'll get all and handle pagination on frontend
      // In future, backend should support pagination params
      const response = await dispatch(getPendingChatRequests());

      if (response?.success || response?.data) {
        let requests = response.data || [];

        // Apply search filter if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          requests = requests.filter(request =>
            request?.sender_name?.toLowerCase()?.includes(query) ||
            request?.message?.toLowerCase()?.includes(query) ||
            request?.created_at?.toLowerCase()?.includes(query)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedRequests = requests.slice(startIndex, endIndex);
        const hasMore = endIndex < requests.length;

        return {
          success: true,
          requests: paginatedRequests,
          count: paginatedRequests.length,
          totalCount: requests.length,
          hasMore,
          currentPage: page,
        };
      } else {
        throw new Error(
          response?.message || 'Failed to fetch pending requests',
        );
      }
    } catch (error) {
      console.error('Get pending requests error:', error);
      NotificationService.error(
        error.message || 'Failed to load chat requests',
      );
      throw error;
    }
  }

  /**
   * Get sent chat requests with pagination and search
   * @param {Object} dispatch - Redux dispatch
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @param {string} searchQuery - Search query (default: '')
   * @returns {Promise<Object>}
   */
  async getSentRequests(dispatch, page = 1, pageSize = 20, searchQuery = '') {
    try {
      // For now, we'll get all and handle pagination on frontend
      const response = await dispatch(getSentChatRequests());

      if (response?.success || response?.data) {
        let requests = response.data || [];

        // Apply search filter if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          requests = requests.filter(request =>
            request?.receiver_name?.toLowerCase()?.includes(query) ||
            request?.message?.toLowerCase()?.includes(query) ||
            request?.status?.toLowerCase()?.includes(query) ||
            request?.created_at?.toLowerCase()?.includes(query)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedRequests = requests.slice(startIndex, endIndex);
        const hasMore = endIndex < requests.length;

        return {
          success: true,
          requests: paginatedRequests,
          count: paginatedRequests.length,
          totalCount: requests.length,
          hasMore,
          currentPage: page,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch sent requests');
      }
    } catch (error) {
      console.error('Get sent requests error:', error);
      NotificationService.error(
        error.message || 'Failed to load sent requests',
      );
      throw error;
    }
  }

  /**
   * Approve chat request
   * @param {number} requestId - Chat request ID
   * @param {string} responseMessage - Optional response message
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async approveChatRequest(requestId, responseMessage = '', dispatch) {
    try {
      if (!requestId) {
        throw new Error('Request ID is required');
      }

      const data = responseMessage ? { response_message: responseMessage } : {};
      const response = await dispatch(approveChatRequest(requestId, data));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Chat request approved',
        );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to approve request');
      }
    } catch (error) {
      console.error('Approve chat request error:', error);
      NotificationService.error(error.message || 'Failed to approve request');
      throw error;
    }
  }

  /**
   * Reject chat request
   * @param {number} requestId - Chat request ID
   * @param {string} responseMessage - Optional response message
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async rejectChatRequest(requestId, responseMessage = '', dispatch) {
    try {
      if (!requestId) {
        throw new Error('Request ID is required');
      }

      const data = responseMessage ? { response_message: responseMessage } : {};
      const response = await dispatch(rejectChatRequest(requestId, data));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Chat request rejected',
        );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to reject request');
      }
    } catch (error) {
      console.error('Reject chat request error:', error);
      NotificationService.error(error.message || 'Failed to reject request');
      throw error;
    }
  }

  /**
   * Cancel chat request (for sent requests)
   * @param {number} requestId - Chat request ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>} acceptedChat
   */
  async cancelChatRequest(requestId, dispatch) {
    try {
      if (!requestId) {
        throw new Error('Request ID is required');
      }

      const response = await dispatch(cancelChatRequest(requestId));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Chat request cancelled',
        );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Cancel chat request error:', error);
      NotificationService.error(error.message || 'Failed to cancel request');
      throw error;
    }
  }


   async acceptedChat(requestId, dispatch) {
    try {
      if (!requestId) {
        throw new Error('Request ID is required');
      }

      const response = await dispatch(acceptedChatRequest(requestId));

      if (response?.success) {
        // NotificationService.success(
        //   response?.message || 'Chat request cancelled',
        // );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to cancel request');
      }
    } catch (error) {
      console.error('Cancel chat request error:', error);
      NotificationService.error(error.message || 'Failed to cancel request');
      throw error;
    }
  }

  /**
   * Check chat request status with a specific user
   * @param {number} userId - User ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async checkRequestStatus(userId, dispatch) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await dispatch(checkChatRequestStatus(userId));

      return {
        success: true,
        status: response?.data?.status || 'none',
        canChat: response?.data?.can_chat || false,
        requestId: response?.data?.request_id || null,
        data: response?.data || null,
      };
    } catch (error) {
      console.error('Check request status error:', error);
      return {
        success: false,
        status: 'error',
        canChat: false,
      };
    }
  }

  /**
   * Get chat request statistics
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getChatRequestStats(dispatch) {
    try {
      const response = await dispatch(getChatRequestStats());

      if (response?.success || response?.data) {
        return {
          success: true,
          stats: response.data || {},
          pendingCount: response.data?.pending_count || 0,
          sentCount: response.data?.sent_count || 0,
          approvedCount: response.data?.approved_count || 0,
          rejectedCount: response.data?.rejected_count || 0,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Get chat request stats error:', error);
      return {
        success: false,
        stats: {},
      };
    }
  }

  /**
   * ============================================
   * CHAT MODULE
   * ============================================
   */

  /**
   * Get list of users with active chats
   * @param {Object} dispatch - Redux dispatch
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @param {string} searchQuery - Search query (default: '')
   * @returns {Promise<Object>}
   */
  async getChatUsers(dispatch, page = 1, pageSize = 20, searchQuery = '') {
    try {
      const response = await dispatch(getChatUser());

      if (response?.success || response?.data) {
        let users = response.data || [];

        // Apply search filter if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          users = users.filter(user =>
            user?.name?.toLowerCase()?.includes(query) ||
            user?.latest_message?.toLowerCase()?.includes(query)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = users.slice(startIndex, endIndex);
        const hasMore = endIndex < users.length;

        return {
          success: true,
          users: paginatedUsers,
          count: paginatedUsers.length,
          totalCount: users.length,
          hasMore,
          currentPage: page,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch chat users');
      }
    } catch (error) {
      console.error('Get chat users error:', error);
      NotificationService.error(error.message || 'Failed to load chat users');
      throw error;
    }
  }

  /**
   * Get all available users for chat with pagination and search
   * @param {Object} dispatch - Redux dispatch
   * @param {number} page - Page number (default: 1)
   * @param {number} pageSize - Items per page (default: 20)
   * @param {string} searchQuery - Search query (default: '')
   * @returns {Promise<Object>}
   */
  async getAllChatUsers(dispatch, page = 1, pageSize = 20, searchQuery = '') {
    try {
      const response = await dispatch(getChatAllUser());

      if (response?.success || response?.data) {
        let users = response.data || [];

        // Apply search filter if provided
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          users = users.filter(user =>
            user?.name?.toLowerCase()?.includes(query) ||
            user?.latest_message?.toLowerCase()?.includes(query) ||
            user?.status?.toLowerCase()?.includes(query)
          );
        }

        // Apply pagination
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedUsers = users.slice(startIndex, endIndex);
        const hasMore = endIndex < users.length;

        return {
          success: true,
          users: paginatedUsers,
          count: paginatedUsers.length,
          totalCount: users.length,
          hasMore,
          currentPage: page,
        };
        
      } else {
        throw new Error(response?.message || 'Failed to fetch all users');
      }
    } catch (error) {
      console.error('Get all chat users error:', error);
      NotificationService.error(error.message || 'Failed to load users');
      throw error;
    }
  }

  /**
   * Get chat history with a specific user
   * @param {number} userId - User ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getChatHistory(userId, dispatch) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await dispatch(getChatHistory(userId));

      if (response?.success || response?.data) {
        return {
          success: true,
          messages: response.data?.messages || response.data || [],
          userInfo: response.data?.user_info || null,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch chat history');
      }
    } catch (error) {
      console.error('Get chat history error:', error);
      NotificationService.error(error.message || 'Failed to load messages');
      throw error;
    }
  }

  /**
   * Send a message to a user
   * @param {number} userId - Receiver user ID
   * @param {string} message - Message text
   * @param {string|File} file - Optional file attachment
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async sendMessage(userId, message, file = null, dispatch) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      if (!message && !file) {
        throw new Error('Message or file is required');
      }

      const payloadData = {
        message: message || '',
        ...(file && { file }),
      };

      const response = await dispatch(
        sendChatMessage({
          id: userId,
          payloadData,
        }),
      );

      if (response?.success) {
        return {
          success: true,
          data: response.data,
          message: response.message,
        };
      } else {
        throw new Error(response?.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Send message error:', error);
      NotificationService.error(error.message || 'Failed to send message');
      throw error;
    }
  }

  /**
   * Get new messages from a specific user
   * @param {number} userId - User ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getNewMessages(userId, dispatch) {
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }

      const response = await dispatch(getNewMsg(userId));

      if (response?.success || response?.data) {
        return {
          success: true,
          messages: response.data || [],
          count: response.data?.length || 0,
          hasNewMessages: (response.data?.length || 0) > 0,
        };
      } else {
        return {
          success: true,
          messages: [],
          count: 0,
          hasNewMessages: false,
        };
      }
    } catch (error) {
      console.error('Get new messages error:', error);
      return {
        success: false,
        messages: [],
        count: 0,
        hasNewMessages: false,
      };
    }
  }

  /**
   * Get chat message for editing
   * @param {number} chatId - Chat message ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async getChatForEdit(chatId, dispatch) {
    try {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }

      const response = await dispatch(getChatForEdit(chatId));

      if (response?.success || response?.data) {
        return {
          success: true,
          message: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to fetch message');
      }
    } catch (error) {
      console.error('Get chat for edit error:', error);
      NotificationService.error(error.message || 'Failed to load message');
      throw error;
    }
  }

  /**
   * Update chat message
   * @param {number} chatId - Chat message ID
   * @param {string} newMessage - Updated message text
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async updateMessage(chatId, newMessage, dispatch) {
    try {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }

      if (!newMessage) {
        throw new Error('Message text is required');
      }

      const response = await dispatch(
        updateChatMessage(chatId, { message: newMessage }),
      );

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Message updated successfully',
        );
        return {
          success: true,
          data: response.data,
        };
      } else {
        throw new Error(response?.message || 'Failed to update message');
      }
    } catch (error) {
      console.error('Update message error:', error);
      NotificationService.error(error.message || 'Failed to update message');
      throw error;
    }
  }

  /**
   * Delete chat message
   * @param {number} chatId - Chat message ID
   * @param {Object} dispatch - Redux dispatch
   * @returns {Promise<Object>}
   */
  async deleteMessage(chatId, dispatch) {
    try {
      if (!chatId) {
        throw new Error('Chat ID is required');
      }

      const response = await dispatch(deleteChatMessage(chatId));

      if (response?.success) {
        NotificationService.success(
          response?.message || 'Message deleted successfully',
        );
        return {
          success: true,
        };
      } else {
        throw new Error(response?.message || 'Failed to delete message');
      }
    } catch (error) {
      console.error('Delete message error:', error);
      NotificationService.error(error.message || 'Failed to delete message');
      throw error;
    }
  }

  /**
   * ============================================
   * UTILITY METHODS
   * ============================================
   */

  /**
   * Validate message data
   */
  validateMessageData(userId, message, file) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!message && !file) {
      throw new Error('Message or file is required');
    }

    return true;
  }

  /**
   * Format chat list data
   */
  formatChatList(chatData) {
    if (!Array.isArray(chatData)) {
      return [];
    }

    return chatData.map(chat => ({
      id: chat.id,
      userId: chat.user_id,
      userName: chat.user_name,
      lastMessage: chat.last_message,
      lastMessageTime: chat.last_message_time,
      unreadCount: chat.unread_count || 0,
      isOnline: chat.is_online || false,
      avatar: chat.avatar || null,
    }));
  }

  /**
   * Format message history
   */
  formatMessageHistory(messages) {
    if (!Array.isArray(messages)) {
      return [];
    }

    return messages.map(msg => ({
      id: msg.id,
      senderId: msg.sender_id,
      receiverId: msg.receiver_id,
      message: msg.message,
      file: msg.file || null,
      timestamp: msg.created_at,
      isRead: msg.is_read || false,
      isSentByMe: msg.is_sent_by_me || false,
    }));
  }

  /**
   * Format chat request data
   */
  formatChatRequest(request) {
    if (!request) return null;

    return {
      id: request.id,
      senderId: request.sender_id,
      senderName: request.sender_name,
      receiverId: request.receiver_id,
      receiverName: request.receiver_name,
      message: request.message || '',
      responseMessage: request.response_message || '',
      status: request.status,
      createdAt: request.created_at,
    };
  }

  /**
   * Get chat request status badge
   */
  getRequestStatusBadge(status) {
    const badges = {
      pending: { text: 'Pending', color: '#FFA500' },
      approved: { text: 'Approved', color: '#4CAF50' },
      rejected: { text: 'Rejected', color: '#F44336' },
      cancelled: { text: 'Cancelled', color: '#9E9E9E' },
    };

    return badges[status?.toLowerCase()] || badges.pending;
  }

  /**
   * Check if can send message to user
   */
  canSendMessage(requestStatus) {
    return requestStatus === 'approved';
  }

  /**
   * Show network error
   */
  showNetworkError() {
    NotificationService.error(
      'Network connection failed. Please check your internet and try again.',
    );
  }

  /**
   * Show validation error
   */
  showValidationError(message) {
    NotificationService.warning(message);
  }
}

export default new ChatService();