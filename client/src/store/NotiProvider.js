import React, { useEffect } from "react";
import { useReducer } from "react";
import reducer, { initialState } from "./reducers/notiReducer";
import NotiContext from "./NotiContext";
import { useStore } from "./hooks";
import { handleCountAllUnreadMessagesAPI } from "../services";
import { RoomTypes } from "../types/db.type";
import { NotiActionTypes } from "./actions/constants";

const NotiProvider = ({ children }) => {
    const [state,] = useStore();
    const [notiState, notiDispatch] = useReducer(reducer, initialState);
    useEffect(() => {
        if (state.user.id) {
            Promise.all([
                handleCountAllUnreadMessagesAPI(state.user.id, RoomTypes.SINGLE),
            ])
                .then(responses => {
                    notiDispatch({
                        type: NotiActionTypes.INCREASE,
                        payload: {
                            badge: {
                                notification: 0,
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