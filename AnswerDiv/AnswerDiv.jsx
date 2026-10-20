import './AnswerDiv.css';

export function AnswerDiv({children, onPress, status}) {
    return(
            <div className={status === true ? 'correct': status === false ? 'incorrect' : 'notClick' } onClick={onPress}>{children}</div>
    );
}