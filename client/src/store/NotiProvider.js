import React, { useEffect } from "react";
import { useReducer } from "react";
import reducer, { initialState } from "./reducers/notiReducer";
import NotiContext from "./NotiContext";
import { useStore, useSocket } from "./hooks";
import {
    handleCountAllUnreadMessagesAPI,
    handleGetGlobalNotisAPI,
} from "../services";
import { RoomTypes } from "../types/db.type";
import { NotiActionTypes } from "./actions/constants";

const NotiProvider = ({ children }) => {
    const [state,] = useStore();
    const [socketState,] = useSocket();
    const socket = socketState?.instance;

    const [notiState, notiDispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        if (!socket) return;
        socket.on("receiveChatMessageGlobally", () => {
            notiDispatch({
                type: NotiActionTypes.INCREASE,
                payload: {
                    badge: { message: 1 },
                },
            })
        })
        return () => {
            socket.off("receiveChatMessageGlobally");
        }
    }, [socket])

    useEffect(() => {
        if (state.user.id) {
            Promise.all([
                handleCountAllUnreadMessagesAPI(state.user.id, RoomTypes.SINGLE),
                handleGetGlobalNotisAPI(state.user.id, 'post'),
                handleGetGlobalNotisAPI(state.user.id, 'channel'),
            ])
                .then(responses => {
                    const unread_post_notis =
                        (responses[1].data?.notis).filter(noti => noti.status === 0).length;
                    const unread_channel_notis =
                        (responses[2].data?.notis).filter(noti => noti.status === 0).length;
                    notiDispatch({
                        type: NotiActionTypes.INCREASE,
                        payload: {
                            badge: {
                                notification: unread_post_notis + unread_channel_notis,
                                message: responses[0].data?.unread,
                                channel: 0,
                            }
                        }
                    })
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [state.user.id])

    return (
        <NotiContext.Provider value={[notiState, notiDispatch]}>
            {children}
        </NotiContext.Provider>
    )
}
export default NotiProvider;