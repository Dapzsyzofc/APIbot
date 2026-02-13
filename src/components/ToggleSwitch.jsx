export default function ToggleSwitch({ active, onToggle, checked, onChange, label, disabled = false }) {
    // Support both prop styles: active/onToggle AND checked/onChange
    const isActive = active !== undefined ? active : checked;
    const handleClick = onToggle || onChange;

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={`toggle-switch ${isActive ? 'active' : 'inactive'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={label}
        >
            <span
                className={`toggle-dot ${isActive ? 'translate-x-5' : 'translate-x-1'}`}
            />
        </button>
    );
}
