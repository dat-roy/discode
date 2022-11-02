import React  from 'react'
import { Routes, Route } from 'react-router-dom'
import PrivateRoute from './routes/PrivateRoute'

import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PageNotFound from './pages/PageNotFound'
import Profile from './pages/Profile'
import Search from './pages/Search'
import Chatbox from './pages/Chatbox'
import "./App.css"

function App() {
    return (
        <Routes>
            <Route exact path='/' element={<Landing/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/register' element={<Register/>} />
            <Route exact path='/home' 
                element={
                    <PrivateRoute>
                        <Home/>
                    </PrivateRoute>
                } 
            />
            <Route exact path='/profile' 
                element={
                    <PrivateRoute>
                        <Profile/>
                    </PrivateRoute>
                }
            />

            <Route exact path='/chatbox' 
                element={
                    <PrivateRoute>
                        <Chatbox/>
                    </PrivateRoute>
                } 
            />
            <Route exact path='/search' element={<Search/>} />
            <Route exact path='/*' element={<PageNotFound/>} />
        </Routes>
    )
}

export default App
