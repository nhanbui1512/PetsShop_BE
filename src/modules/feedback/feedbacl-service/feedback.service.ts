import { FeedbackModel } from '../../../system'

 class FeedBackService {
    async getAllFeedbacks(){
        return await FeedbackModel.find();
    }
    async createFeedback(body){
       try {
        return await FeedbackModel.create({
            userId: body.userId,
            feedback: body.feedback,
            links: body.links,
            feedbackNumber: body.feedbackNumber,
            cardBreedsId: body.cardBreedsId
        });
       } catch (error) {
        throw new Error('Create feedback failed');
       }
    }
    async getFeedbackById(id) {
        try {
            return await FeedbackModel.findById(id);
        } catch (error) {
            throw new Error('Feedback not found');
        }   
    }
    async deleteFeedback(id) {
        try {
            return await FeedbackModel.findByIdAndDelete(id);
        } catch (error) {
            throw new Error('Feedback not found');
        }
        
    }
}

export const feedBackService = new FeedBackService();