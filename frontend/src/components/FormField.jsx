export default function FormField ({name, label, placeholder, type, isTextArea, className, required}) {
   
    return(
      isTextArea ? (
         <div style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <label htmlFor={name}>{label}</label>
            <textarea 
                required={required}
                name={name} 
                id="" 
                placeholder={placeholder}
                rows="10"
            ></textarea>
       </div>
      ):(
        <div className={className} style={{display: "flex", flexDirection: "column", gap: "10px"}}>
            <label htmlFor={name}>{label}</label>
            <input
                required={required}                 
                type={type} 
                placeholder={placeholder} 
                name={name} 
                step='0.1'
            />
       </div>
      )
        
    )
}