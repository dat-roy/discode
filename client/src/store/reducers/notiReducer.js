import { NotiActionTypes } from "../actions/constants";

const initialState = {
    badge: {
        notification: 0,
        message: 0,
        channel: 0,
    },
}

function reducer(state, action) {
    const badge = action.payload?.badge;
    if (badge && action.type === NotiActionTypes.DECREASE) {
        for (const key in badge) {
            badge[key] = -badge[key];
        }
    }

    switch (action.type) {
        case NotiActionTypes.INCREASE:
        case NotiActionTypes.DECREASE:
            return {
                ...state,
                badge: {
                    ...state.badge,
                    ...(badge?.notification && {
                        notification: Math.max(state.badge.notification + badge.notification, 0)
                    }),
                    ...(badge?.message && {
                        message: Math.max(state.badge.message + badge.message, 0)
                    }),
                    ...(badge?.channel && {
                        channel: Math.max(state.badge.channel + badge.channel, 0)
                    }),
                },
            }
        default:
            return {
                ...state,
            }
    }
}

export { initialState };
export default reducer;