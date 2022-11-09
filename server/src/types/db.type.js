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

module.exports = {
    GenderTypes,
    RoomTypes,
    MessageTypes,
}