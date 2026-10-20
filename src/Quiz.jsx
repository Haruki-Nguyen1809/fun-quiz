import { useState } from "react";
import { NextBtn } from "../NextBtn/NextBtn";
import { AnswerDiv } from "../AnswerDiv/AnswerDiv";
import { RestartBtn } from "../RestartBtn/Restart";
// chooseAnswer contains an obeject ({answer: ..., correct: ...})

export function Quiz({quizArray, onReset, saveScore}) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const quizContent = quizArray[currentQuestion];
    const [chooseAnswer, setChooseAnswer] = useState(null);
    const [currentScore, setCurrentScore] = useState(0);
    const [isFinished, setIsFinished] = useState(false);
    const [sumOfCorrectQuestion, setSumOfCorrectQuestion] = useState(0);
    function handleClick(click) {
        if (chooseAnswer === null) {
            return;
        }
        if ((currentQuestion + 1) < quizArray.length) {
            setCurrentQuestion(click);
            setChooseAnswer(null);
        } else {
            setIsFinished(true);
            saveScore(currentScore);
        }
    }
    function clickAnswer(value) {
        if (chooseAnswer === null) {
            setChooseAnswer(value);
            calculatePoints(value);
        }
    }
    function calculatePoints(point) {
        if (point.correct === true) {
            setCurrentScore(currentScore + 1);
            setSumOfCorrectQuestion(sumOfCorrectQuestion + 1);
        } else {
            if (currentScore > 0) {
                setCurrentScore(currentScore - 1);
            }
        }
    }
    function chooseStatus(option) {
        if (chooseAnswer === null) {
            return null;
        } else if (option.correct === true) {
            return true;
        } else if (chooseAnswer.answer === option.answer) {
            return false;
        } else {
            return null;
        }
    }
    if (isFinished === true) {
        return (
            <div className="card result final-score detail">
                <p>Point: {currentScore}</p>
                <p>You have answered correctly {sumOfCorrectQuestion} out of {quizArray.length} questions</p>
                <RestartBtn onRestart={onReset}>Restart</RestartBtn>
            </div>
        );
    }
    return (
        <div className="score">
            <p>Point: {currentScore}</p>
            <p className="question-text">{currentQuestion + 1}.{quizContent.question}</p>
            {quizContent.options.map((answers) => (
                <AnswerDiv key={answers.answer} onPress={() => clickAnswer(answers)} status={chooseStatus(answers)}>
                    {answers.answer}
                </AnswerDiv>
            ))}
            <NextBtn onSelected={() => handleClick(currentQuestion + 1)}>{currentQuestion + 1 === quizArray.length ? "Finish" : "Next"}</NextBtn>
            <p className="progress">Question {currentQuestion + 1} of {quizArray.length}</p>
        </div>
    );
}