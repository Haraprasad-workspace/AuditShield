import React from 'react'

const Input = ({ 
  label, 
  placeholder, 
  type = "text", 
  className = "", 
  containerClassName = "",
  icon: Icon, 
  error,      
  ...props 
}) => {
  return (
    <div className={`flex flex-col gap-1.5 md:gap-2 w-full ${containerClassName}`}>
      {/* Label: Scaled down slightly for mobile to save vertical space */}
      {label && (
        <label className="text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-cobalt-muted font-black ml-1">
          {label}
        </label>
      )}

      <div className="relative group">
        {/* Optional Icon: Scaled from 16 to 18 */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-cobalt-muted group-focus-within:text-cobalt-accent transition-colors">
            {React.cloneElement(Icon, { size: typeof window !== 'undefined' && window.innerWidth < 768 ? 16 : 18 })}
          </div>
        )}

        <input 
          type={type}
          placeholder={placeholder}
          className={`
            w-full bg-cobalt-bg text-white rounded-xl
            /* Mobile: py-3 (compact), Desktop: py-3.5 */
            px-4 py-3 md:py-3.5
            /* Prevents iOS from auto-zooming on focus by using 16px font if needed, but 14px (text-sm) is standard for custom UI */
            text-sm font-medium transition-all duration-200
            placeholder:text-gray-600 placeholder:font-normal
            outline-none border
            ${Icon ? 'pl-11 md:pl-12' : 'px-5'}
            ${error 
              ? 'border-risk-high shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
              : 'border-cobalt-border focus:border-cobalt-accent focus:shadow-[0_0_15px_rgba(56,189,248,0.15)]'
            }
            disabled:opacity-50 disabled:cursor-not-allowed
            /* Improves touch experience */
            appearance-none
            ${className}
          `}
          {...props}
        />
      </div>

      {/* Error Message: Scaled for mobile */}
      {error && (
        <span className="text-[9px] md:text-[10px] text-risk-high font-bold uppercase tracking-wider ml-1 animate-in fade-in slide-in-from-top-1">
          {error}
        </span>
      )}
    </div>
  )
}

export default Input