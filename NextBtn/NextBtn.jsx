export function NextBtn({children, onSelected}) {
        return (
            <div>
                <button onClick={onSelected}>{children}</button>
            </div>
        );
}