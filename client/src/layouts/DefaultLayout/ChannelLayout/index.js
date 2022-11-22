import { Outlet } from "react-router-dom";
import { ChannelDetail, RoomList } from "../../../pages/Channel";
import LayoutWrapper from "../../LayoutWrapper";

export default function ChannelLayout() {
    return (
        <LayoutWrapper
            leftElement={<RoomList />}
            mainElement={<Outlet />}
            rightElement={<ChannelDetail />}
        />
    )
}