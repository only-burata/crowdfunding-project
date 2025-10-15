export default function CustomButton ({text, onClick, className, style, disabled}) {
    return (
        <button 
            disabled={disabled}
            style={style}
            className={className}
            onClick={onClick}
        >{text}</button>
    )
}