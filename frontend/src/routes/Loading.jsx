import React from 'react'

const Loading = () => {
  return (
    <div className='d-flex flex-column align-items-center justify-content-center vh-100 bg-white loading-container'>
      <div className="scroll-indicator">
        <div className="scroll-dot"></div>
        <div className="scroll-dot"></div>
        <div className="scroll-dot"></div>
        <div className="scroll-dot"></div>
        <div className="scroll-dot"></div>
      </div>
    </div>
  )
}

export default Loading