import React from 'react'

const Input = ({ 
  label, 
  placeholder, 
  type = "text", 
  className = "", 
  containerClassName = "",
  icon: Icon, // New: Pass a Lucide icon component
  error,      // New: Pass an error string to turn the border red
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-2 w-full ${containerClassName}`}>
      {/* Label with improved spacing and font weight */}
      {label && (
        <label className="text-[10px] uppercase tracking-[0.2em] text-cobalt-muted font-black ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* Optional Icon Rendering */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cobalt-muted group-focus-within:text-cobalt-accent transition-colors">
            {React.cloneElement(Icon, { size: 18 })}
          </div>
        )}

        <input 
          type={type}
          placeholder={placeholder}
          className={`
            w-full bg-cobalt-bg text-white rounded-xl px-4 py-3.5
            text-sm font-medium transition-all duration-200
            placeholder:text-gray-600 placeholder:font-normal
            outline-none border
            ${Icon ? 'pl-12' : 'px-5'}
            ${error 
              ? 'border-risk-high shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : 'border-cobalt-border focus:border-cobalt-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.15)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            ${className}
          `}
          {...props}
        />
      </div>

      {/* Error Message Helper */}
      {error && (
        <span className="text-[10px] text-risk-high font-bold uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input