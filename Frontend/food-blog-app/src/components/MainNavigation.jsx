import React from 'react'
import Navbar from './Navbar'
import { Outlet } from 'react-router-dom'  //todo: ---- Outlet is used for nested routing in React Router. It tells React Router where to render child routes inside a parent layout. Outlet = Placeholder for child components.
import Footer from './Footer'

const MainNavigation = () => {
  return (
    <div>
      <Navbar/>
      <Outlet/>  
      <Footer/>

    </div>
  )
}

export default MainNavigation
