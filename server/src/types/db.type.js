const GenderTypes = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
})

const RoomTypes = Object.freeze({
    SINGLE: "single",
    GROUP: "group",
    ALL: "all",
})

const MessageTypes = Object.freeze({
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
})

const PostNotificationTypes = Object.freeze({
    POST_LIKES: 1, 
    POST_COMMENTS: 2, 
})

const ChannelNotificationTypes = Object.freeze({
    CHANNEL_INVITE: 1, 
    CHANNEL_REQUEST: 2, 
})

module.exports = {
    GenderTypes,
    RoomTypes,
    MessageTypes,
    PostNotificationTypes, 
    ChannelNotificationTypes, 
}