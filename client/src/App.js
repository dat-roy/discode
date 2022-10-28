import React  from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PageNotFound from './pages/PageNotFound'
import PrivateRoute from './routes/PrivateRoute'

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
            <Route exact path='/*' element={<PageNotFound/>} />
        </Routes>
    )
}

export default App
