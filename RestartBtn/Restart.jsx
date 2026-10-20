export function RestartBtn({onRestart, children}) {
    return (
        <button onClick={onRestart}>{children}</button>
    );
}