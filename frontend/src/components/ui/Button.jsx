import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  // Logic for different styles using Midnight Cobalt colors
  const baseStyles = "px-5 py-2.5 rounded-lg font-medium transition-all active:scale-95 flex items-center justify-center gap-2";
  
  const variants = {
    primary: "bg-cobalt-accent text-cobalt-bg hover:shadow-[0_0_15px_rgba(56,189,248,0.4)]",
    outline: "border border-cobalt-border text-white hover:bg-cobalt-surface",
    danger: "bg-risk-high text-white hover:bg-red-600"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}

export default Button