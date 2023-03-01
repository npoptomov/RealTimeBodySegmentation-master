import React, { useState } from 'react'
import '../node_modules/bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Profile from './components/Profile'
export default function App() {
  return (
    <div className="container mt-5">
      <Profile />
    </div>
  )
}