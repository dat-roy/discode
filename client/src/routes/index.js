import React from "react";
import { DefaultLayout, ChannelLayout } from '../layouts'

import Home from '../pages/Home'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import PageNotFound from '../pages/PageNotFound'
import Profile from '../pages/Profile'
import Explore from '../pages/Explore'
import { ChatList, Inbox, ChatDetails } from '../pages/Chat'
import Publish from "../pages/Posts/Publish";
import PostView from "../pages/Posts/PostView";
import Feed from "../pages/Posts/Feed";
import { ChannelList, ChannelDiscover, ChannelCreator, RoomList } from "../pages/Channel";
import ChannelInbox from "../pages/Channel/Inside/ChannelInbox";
import Notification from "../pages/Notification";
import ChannelHome from "../pages/Channel/Inside/ChannelHome";

const publicRoutes = [
    {
        key: 'landing-page',
        path: '/',
        mainElement: <Landing />,
        layout: null,
    },
    {
        key: 'login-page',
        path: '/login',
        mainElement: <Login />,
        layout: null,
    },
    {
        key: 'register-page',
        path: '/register',
        mainElement: <Register />,
        layout: null,
    },
    {
        key: '404-not-found',
        path: '/*',
        mainElement: <PageNotFound />,
    },
]

const privateRoutes = [
    {
        key: 'homepage',
        path: '/home',
        mainElement: <Home />,
        layout: DefaultLayout,
    },
    {
        key: 'profile-page',
        path: '/profile',
        mainElement: <Profile />,
        layout: DefaultLayout,
    },
    {
        key: 'explore-page',
        path: '/explore',
        mainElement: <Explore />,
    },
    {
        key: 'notification',
        path: '/notifications',
        mainElement: <Notification />,
    },
    {
        key: 'chat-page',
        path: '/chat',
        leftElement: <ChatList />,
        mainElement: <Inbox />,
        rightElement: <ChatDetails />,
        layout: DefaultLayout,
    },
    {
        key: 'chat-page-with-id',
        path: '/chat/:id',
        leftElement: <ChatList />,
        mainElement: <Inbox />,
        rightElement: <ChatDetails />,
        layout: DefaultLayout,
    },
    {

        key: 'channels',
        path: '/channels',
        leftElement: <ChannelList />,
        mainElement: <ChannelDiscover />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'create-channel',
        path: '/channels/create',
        leftElement: <ChannelList />,
        mainElement: <ChannelCreator />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'new-feed',
        path: '/posts',
        leftElement: null,
        mainElement: <Feed />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'new-feed-override',
        path: '/posts/view',
        leftElement: null,
        mainElement: <Feed />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'publish-posts',
        path: '/posts/publish',
        leftElement: null,
        mainElement: <Publish />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'view-a-post',
        path: '/posts/view/:id',
        leftElement: null,
        mainElement: <PostView />,
        rightElement: null,
        layout: DefaultLayout,
    },
    {
        key: 'channels-with-id',
        path: '/channels/:id',
        leftElement: <RoomList />,
        mainElement: <ChannelHome />,
        rightElement: null,
        layout: DefaultLayout,
    },
]

const privateChannelRoutes = [
    // {
    //     key: 'channels-with-id',
    //     path: '/channels/:id',
    //     mainElement: null,
    //     layout: {
    //         DefaultLayout,
    //         ChannelLayout,
    //     },
    // },
    {

        key: 'channels-with-id-and-room-id',
        path: '/channels/:id/:room_id',
        mainElement: <ChannelInbox />,
        layout: {
            DefaultLayout,
            ChannelLayout,
        }
    },
]

export {
    publicRoutes,
    privateRoutes,
    privateChannelRoutes,
}