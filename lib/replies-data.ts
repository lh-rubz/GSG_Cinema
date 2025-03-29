import { replies } from "@/data/replies";
import { Reply } from "@/types/types";

// Get a reply by ID
export const getReplyById = (id: string): Reply | undefined => {
    return replies.find(reply => reply.id === id);
  };
  
  // Get all replies
  export const getAllReplies = (): Reply[] => {
    return replies;
  };
  
  // Add a new reply
  export const createReply = (userId: string, comment: string): Reply => {
    const newReply: Reply = {
      id: (Math.random() * 100000).toString(), // Mock ID generation (replace with real ID generation)
      userId,
      comment,
      date: new Date().toISOString(),
      reportedBy:[] // Current date and time
    };
    replies.push(newReply);
    return newReply;
  };
  
  // Update an existing reply by ID
  export const updateReply = (id: string, newComment: string): Reply | undefined => {
    const reply = getReplyById(id);
    if (reply) {
      reply.comment = newComment;
      reply.date = new Date().toISOString(); // Update the date to the current time
      return reply;
    }
    return undefined;
  };
  
  // Delete a reply by ID
  export const deleteReply = (id: string): boolean => {
    const index = replies.findIndex(reply => reply.id === id);
    if (index !== -1) {
      replies.splice(index, 1);
      return true;
    }
    return false;
  };
  
  // Get all replies by a user ID
  export const getRepliesByUserId = (userId: string): Reply[] => {
    return replies.filter(reply => reply.userId === userId);
  };