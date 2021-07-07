import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";




const chatRoomSchema = new mongoose.Schema({
    _id: {
        type: String, default: () => uuidv4().replace(/\-/g, ""),
    },
    userIds: Array,
    chatInitiator: String,
},
{
    timestamps: true,
    collection: "chatrooms",
}
);

chatRoomSchema.statics.initiateChat = async function(
    userIds, chatInitiator
) {
    try {
        const availableRoom = await this.findOne({
            userIds: {
                $size: userIds.length,
                $all: [...userIds],
            },
        });

        if(availableRoom) {
            return {
                isNew: false,
                message: "retrieving an old chat room",
                chatRoomId: availableRoom._doc._id,
            };
        }

        const newRoom = await this.create({
            userIds, chatInitiator
        })
        return {
            isNew: true,
            message: "creating a new chat room",
            chatRoomId: newRoom._doc._id,
        }
    } catch (error) {
        console.log("error on chat", error);

        throw error;
    }
};

chatRoomSchema.statics.getChatRoomsByUserId = async function (userId) {
    try {
      const rooms = await this.find({ userIds: { $all: [userId] } });
      return rooms;
    } catch (error) {
      throw error;
    }
  }
  


chatRoomSchema.statics.getChatRoomByRoomId = async function (roomId) {
    try {
        const room = await this.findOne({ _id: roomId });
        return room;
    } catch (error) {
        throw error;
    }
};


export default mongoose.model("ChatRoom", chatRoomSchema);