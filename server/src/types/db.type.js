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

const NotiSourceTypes = Object.freeze({
    POST: 'post', 
    CHANNEL: 'channel', 
    USER: 'user', 
})

const PostNotificationTypes = Object.freeze({
    POST_LIKES: 1, 
    POST_COMMENTS: 2, 
})

const ChannelNotificationTypes = Object.freeze({
    CHANNEL_INVITE: 1, 
    CHANNEL_REQUEST: 2, 
    CHANNEL_DECLINED: 3, 
    CHANNEL_ACCEPTED: 4,     //welcome
})

module.exports = {
    GenderTypes,
    RoomTypes,
    MessageTypes,
    NotiSourceTypes, 
    PostNotificationTypes, 
    ChannelNotificationTypes, 
}