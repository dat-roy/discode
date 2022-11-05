import React from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

import { publicRoutes, privateRoutes } from './routes'
import { DefaultLayout } from './layouts'
import "./App.css"

import LayoutWrapper from './layouts/LayoutWrapper'

function App() {
    return (
        <Routes>
            <Route path='/'>  
                {publicRoutes.map((route, index) => {
                    return getRouteComponents(route, index, false);
                })}
            </Route>

            <Route path='/' element={
                <PrivateRoute>
                    <DefaultLayout />
                </PrivateRoute>
            }>
                {privateRoutes.map((route, index) => {
                    return getRouteComponents(route, index, true);
                })}
            </Route>
        </Routes>
    )
}

function getRouteComponents(route, index, isPrivate) {
    // let Layout = DefaultLayout
    // if (route.layout) {
    //     Layout = route.layout
    // } else if (route.layout === null) {
    //     Layout = Fragment
    // }

    //Special case: Landing page
    if (route.path === '/' && !isPrivate) {
        return <Route index element={ route.mainElement } />
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
