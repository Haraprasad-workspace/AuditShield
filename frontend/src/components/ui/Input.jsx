import React from 'react'

const Input = ({ label, placeholder, type = "text", className = "", ...props }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      {label && <label className="text-xs uppercase tracking-widest text-cobalt-muted font-bold ml-1">{label}</label>}
      <input 
        type={type}
        placeholder={placeholder}
        className={`bg-cobalt-bg border border-cobalt-border text-white rounded-lg px-4 py-3 focus:outline-none focus:border-cobalt-accent transition-colors placeholder:text-gray-600 ${className}`}
        {...props}
      />
    </div>
  )
}

export default Input