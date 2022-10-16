import React from "react"
import { useSelector } from "react-redux"
import { Route, Redirect } from 'react-router-dom'

export default function PrivateRoute({ component: Component, ...rest }) {
    const user = useSelector((state) => state?.user?.user)

    // function renderComponent(props) {
    //     if (user) {
    //         return 
    //     }

    //     return (
    //         <Redirect
    //             to={{ pathname: LOGIN}}
    //         />
    //     )   
    // }
}