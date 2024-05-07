import { ConversationModel, MessageModel } from "../../../system";
class ConversationService {
    async getAllConversations(){
        return await ConversationModel.find();
    }
    async createConversation(){
        return await ConversationModel.create({});
    }
    async getConversationById(id) {
        return await ConversationModel.findById(id)
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 } } // Sắp xếp theo trường createdAt (tăng dần)
            });
    }
    async deleteConversation(id) {
        return await ConversationModel.findByIdAndDelete(id);
    }
    async createMessage(conversationId, message) {
        const conversation = await ConversationModel.findById(conversationId);
        if (!conversation) {
            throw new Error('Conversation not found');
        }
    
        // Create a new message document using the MessageModel
        const newMessage = new MessageModel({
            senderId: message.senderId,
            isAdmin: message.isAdmin,
            message: message.message,
        });
    
        // Save the new message document to the database
        await newMessage.save();
    
        // Push the new message's ObjectId to the conversation's messages array
        conversation.messages.push(newMessage);
        conversation.lastMessage = message.message;
    
        // Save the updated conversation back to the database
        await conversation.save();
    
        return conversation;
    }
    
}
export const conversationService = new ConversationService();
