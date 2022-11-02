import { DefaultLayout } from '../layouts'

import Home from '../pages/Home'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Register from '../pages/Register'
import PageNotFound from '../pages/PageNotFound'
import Profile from '../pages/Profile'
import SearchResults from '../pages/SearchResults'
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
        path: '/search',
        mainElement: <SearchResults/>,
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
        path: '/chat',
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