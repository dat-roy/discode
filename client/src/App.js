import React  from 'react'
import { Routes, Route } from 'react-router-dom'

import Home from './pages/Home'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import PageNotFound from './pages/PageNotFound'

function App() {
    return (
        <Routes>
            <Route exact path='/' element={<Landing/>} />
            <Route exact path='/login' element={<Login/>} />
            <Route exact path='/register' element={<Register/>} />
            <Route exact path='/home' element={<Home/>} />
            <Route exact path='/*' element={<PageNotFound/>} />
        </Routes>
    )

    // const [user, setUser] = useState({});

    // function handleCallbackResponse(response) {
    //     axios.post('http://localhost:3030/user/auth/google-login', {
    //         credential: response.credential
    //     })
    //     .then(res => {
    //         if (res.status === 200) {
    //             if (res.data.user_data) {
    //                 //Go to protected page;
    //             } else {
    //                 //Render signin page;
    //             }
    //         } else {
    //             console.log("Error: " + res.data.message);
    //         }
            
    //         const userObject = res.data.user_data;
    //         console.log(res.data.user_data);
    //         if (userObject != null) {
    //             setUser(userObject);
    //         }
    //     })
    // }

    // let conponent;
    // if (Object.keys(user).length !== 0) {
    //     conponent = <div>
    //         <UserInfo user = {user}/>
    //         <SignOut user = {user} />
    //     </div>
    // } else {
    //     conponent = <SignIn />
    // }

    // return (
    //     <div className="App">
    //         { conponent }
    //     </div>
    // );

    // function SignIn() {
    //     return (
    //         <div id="sign-in-wrapper">
    //             <p>Hello, welcome to Discode. Please sign in!</p>
    //             <div id="sign-in"></div>
    //         </div>
    //     );
    // }

    // function UserInfo(props) {
    //     const user = props.user;
    //     return (
    //         <div id="user-info">
    //             {
    //                 user && 
    //                 <div>
    //                     <img src={user.picture} alt="avt"></img>
    //                     <h3>{user.name}</h3>
    //                 </div>
    //             }
    //         </div>
    //     );
    // }

    // function SignOut(props) {
    //     function handleSignOut(event) {
    //         setUser({});
    //     }
        
    //     const user = props.user;
    //     return (
    //         <div id = "sign-out">
    //             {
    //                 Object.keys(user).length !== 0 &&
    //                 <button onClick={ (e) => handleSignOut(e)}
    //                 >Sign out </button>
    //             }
    //         </div>
    //     );
    // }
}

export default App
