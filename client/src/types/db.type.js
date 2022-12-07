export const GenderTypes = Object.freeze({
    MALE: "male",
    FEMALE: "female",
    OTHER: "other",
})

export const RoomTypes = Object.freeze({
    SINGLE: "single",
    GROUP: "group",
    ALL: "all",
})

export const MessageTypes = Object.freeze({
    TEXT: "text",
    IMAGE: "image",
    VIDEO: "video",
    AUDIO: "audio",
})

export const PostNotificationTypes = Object.freeze({
    POST_LIKES: 1, 
    POST_COMMENTS: 2, 
})

export const ChannelNotificationTypes = Object.freeze({
    CHANNEL_INVITE: 1,
    CHANNEL_REQUEST: 2,
    CHANNEL_DECLINED: 3,
    CHANNEL_ACCEPTED: 4,
})