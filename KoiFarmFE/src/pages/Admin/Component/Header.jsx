/* eslint-disable no-unused-vars */
import React from 'react'
import './component.css'

function Header() {
  return (
    <div className='Header d-flex justify-content-around p-2'>
        <div className='start-stuff'>Admin</div> 
        <div className='middle-stuff'>Stuff</div>
        <div className='end-stuff'>Stuffs</div>
    </div>
  )
}

export default Header