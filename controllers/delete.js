import ChatRoomModel from '../models/chatRoom.js';
import ChatMessageModel from '../models/chatMessage.js';

export default {
  deleteRoomById: async (req, res) => {
    try {
      const { roomId } = req.params;
      const room = await ChatRoomModel.findOneAndDelete({ _id: roomId });
      const messages = await ChatMessageModel.findOneAndDelete({ chatRoomId: roomId })
      return res.status(200).json({ 
        success: true, 
        message: "Room deleted successfully",
        deletedRoomsCount: room.deletedCount,
        deletedMessagesCount: messages.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
  deleteMessageById: async (req, res) => {
    try {
      const { messageId } = req.params;
      const message = await ChatMessageModel.findOneAndDelete({ _id: messageId });
      return res.status(200).json({ 
        success: true, 
        deletedMessagesCount: message.deletedCount,
      });
    } catch (error) {
      return res.status(500).json({ success: false, error: error })
    }
  },
}