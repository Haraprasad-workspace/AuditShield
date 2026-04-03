import React from 'react'

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-cobalt-surface border border-cobalt-border rounded-xl p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  )
}

export default Card