import React, { Fragment } from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

import { publicRoutes, privateRoutes } from './routes'
import { DefaultLayout } from './layouts'
import "./App.css"

function App() {
    return (
        <Routes>
            {publicRoutes.map((route, index) => {
                return getRouteComponents(route, index, false);
            })}

            {privateRoutes.map((route, index) => {
                return getRouteComponents(route, index, true);
            })}
        </Routes>
    )
}

function getRouteComponents(route, index, isPrivate) {
    let Layout = DefaultLayout
    if (route.layout) {
        Layout = route.layout
    } else if (route.layout === null) {
        Layout = Fragment
        return (
            <Route
                key={index}
                exact path={route.path}
                element={
                    <Layout>
                        {route.mainElement}
                    </Layout>
                }
            />
        )
    }

    if (!isPrivate) {
        return (
            <Route
                key={index}
                exact path={route.path}
                element={
                    <Layout
                        leftElement={route.leftElement}
                        mainElement={route.mainElement}
                        rightElement={route.rightElement}
                    />
                }
            />
        )
    } else {
        return (
            <Route
                key={index}
                exact path={route.path}
                element={
                    <PrivateRoute key={index}>
                        <Layout
                            leftElement={route.leftElement}
                            mainElement={route.mainElement}
                            rightElement={route.rightElement}
                        />
                    </PrivateRoute>
                }
            />
        )
    }
}

export default App
