const routes = [
    {
        path: '/',
        element: <Landing/>, 
    }, 
    {
        path: '/login',
        element: <Login/>,
    },
    {
        path: '/register',
        element: <Register/>,
    },
    {
        path: '/*',
        element: <PageNotFound/>,
    },
]

export default routes