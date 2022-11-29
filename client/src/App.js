import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

import { publicRoutes, privateRoutes, privateChannelRoutes } from './routes'
import { DefaultLayout } from './layouts'
import { ChannelLayout } from './layouts'
import LayoutWrapper from './layouts/LayoutWrapper'

import "./App.css"
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
    return (
        <>
            <Routes>
                <Route path='/' key={"public-routes"}>
                    {
                        publicRoutes.map((route) => {
                            return getRouteComponents(route, false);
                        })
                    }
                </Route>

                <Route path='/' key={"private-routes"} element={
                    <PrivateRoute>
                        <DefaultLayout />
                    </PrivateRoute>
                }>
                    {
                        privateRoutes.map((route) => {
                            return getRouteComponents(route, true);
                        })
                    }

                    {/* Special case: Need refactoring. */}
                    <Route path='/channels' key={"private-routes-of-channels"} element={
                        <ChannelLayout />
                    }>
                        {
                            privateChannelRoutes.map((route) => {
                                return getRouteComponents(route, true);
                            })
                        }
                    </Route>
                </Route>
            </Routes>
            <ToastContainer
                position="top-center"
                autoClose={2500}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </>
    )
}

function getRouteComponents(route, isPrivate) {
    //Special case: Landing page
    if (route.path === '/' && !isPrivate) {
        return <Route index key={"index-route"} element={route.mainElement} />
    }

    return (
        <Route
            key={route.key}
            path={route.path}
            element={
                <LayoutWrapper key={route.key}
                    leftElement={route.leftElement}
                    mainElement={route.mainElement}
                    rightElement={route.rightElement}
                />
            }
        />
    )
}

export default App
