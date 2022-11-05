import { DefaultLayout } from '../layouts'

import Home from '../pages/Home'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import PageNotFound from '../pages/PageNotFound'
import Profile from '../pages/Profile'
import Explore from '../pages/Explore'
import {ChatList, Inbox, ChatDetails} from '../pages/Chat'

const publicRoutes = [
    {
        key: 'landing-page',
        path: '/',
        mainElement: <Landing/>, 
        layout: null, 
    }, 
    {
        key: 'login-page', 
        path: '/login',
        mainElement: <Login/>,
        layout: null, 
    },
    {
        key: 'register-page',
        path: '/register',
        mainElement: <Register/>,
        layout: null, 
    },
    {
        key: '404-not-found', 
        path: '/*',
        mainElement: <PageNotFound/>,
    },
]

const privateRoutes = [
    {
        key: 'homepage', 
        path: '/home',
        mainElement: <Home/>,
        layout: DefaultLayout,
    }, 
    {
        key: 'profile-page', 
        path: '/profile',
        mainElement: <Profile/>,
        layout: DefaultLayout,
    },
    {
        key: 'explore-page',
        path: '/explore',
        mainElement: <Explore/>,
    },
    {
        key: 'chat-page', 
        path: '/chat',
        leftElement: <ChatList/>,
        mainElement: <Inbox/>,
        rightElement: <ChatDetails/>,
        layout: DefaultLayout,
    },
    {
        key: 'chat-page-with-id',
        path: '/chat/:id',
        leftElement: <ChatList/>,
        mainElement: <Inbox/>,
        rightElement: <ChatDetails/>,
        layout: DefaultLayout,
    },
]

export {
    publicRoutes, 
    privateRoutes,
}