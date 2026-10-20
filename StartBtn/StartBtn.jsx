import './StartBtn.css';

export function StartBtn({children, onStart}) {
    return (
        <button onClick={onStart}>{children}</button>
    );
}