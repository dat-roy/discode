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
        path: '/',
        mainElement: <Landing/>, 
        layout: null, 
    }, 
    {
        path: '/login',
        mainElement: <Login/>,
        layout: null, 
    },
    {
        path: '/register',
        mainElement: <Register/>,
        layout: null, 
    },
    {
        path: '/*',
        mainElement: <PageNotFound/>,
    },
]

const privateRoutes = [
    {
        path: '/home',
        mainElement: <Home/>,
        layout: DefaultLayout,
    }, 
    {
        path: '/profile',
        mainElement: <Profile/>,
        layout: DefaultLayout,
    },
    {
        path: '/explore',
        mainElement: <Explore/>,
    },
    {
        path: '/chat',
        leftElement: <ChatList/>,
        mainElement: <Inbox/>,
        rightElement: <ChatDetails/>,
        layout: DefaultLayout,
    },
    {
        path: '/chat/:id',
        leftElement: <ChatList/>,
        mainElement: <Inbox/>,
        rightElement: <ChatDetails/>,
        layout: DefaultLayout,
    }
]

export {
    publicRoutes, 
    privateRoutes,
}