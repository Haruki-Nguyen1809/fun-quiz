import { Quiz_Content } from "./data";
import { Quiz } from "./src/Quiz";
import { useState } from "react";
import { StartBtn } from "./StartBtn/StartBtn";

export default function SelectionScreen() {
    const [settingScreen, setSettingScreen] = useState(true);
    const [topicOptions, setTopicOptions] = useState('animal');
    const [quizLevel, setQuizLevel] = useState('easy');
    const [numberOfQuestions, setNumberOfQuestions] = useState(5);
    const optionArray = [];
    const [highestScore, setHighestScore] = useState(0);
    function startQuiz(status) {
        setSettingScreen(status);
    }
    function topicSelection(e) {
        setTopicOptions(e.target.value);
    }
    function levelSelection(e) {
        setQuizLevel(e.target.value);
    }
    function questionSelection(e) {
        setNumberOfQuestions(Number(e.target.value));
    }
    function bestScore(point) {
        const newScore = Math.max(point, highestScore);
        setHighestScore(newScore);
    }
    const filterQuizArray = Quiz_Content.filter((option) => (
        (topicOptions === "all" || option.topic === topicOptions) && (quizLevel === "all" || option.level === quizLevel) 
    ));
    const maxQuestion = Math.min(filterQuizArray.length, 10);
    const usedQuestion = Math.min(numberOfQuestions, maxQuestion);
    for (let i = 5; i <= maxQuestion; i++) {
        optionArray.push(i);
    } 
    const finalArray = filterQuizArray.slice(0, usedQuestion);
    if (settingScreen === true) {
        return (
            <div className="card">
                <label htmlFor="topic-options">Choose a topic:</label><br></br>
                <select name="topic" id="topic-options" onChange={topicSelection} value={topicOptions}>
                    <option value="animal">Animal</option>
                    <option value="food">Food</option>
                    <option value="all">All</option>
                </select><br></br>
                <label htmlFor="level-options">Choose a level:</label><br></br>
                <select name="level" id="level-options" onChange={levelSelection} value={quizLevel}>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                    <option value="all">All</option>
                </select><br></br>
                <label htmlFor="question-options">Choose number of questions:</label><br></br>
                <select name="numberOfQuestions" id="question-options" onChange={questionSelection} value={usedQuestion}>
                    {optionArray.map((options) => (
                        <option key={options} value={options}>
                            {options}
                        </option>
                    ))}
                </select>
                <StartBtn onStart={() => startQuiz(!settingScreen)}>Start</StartBtn><br></br>
                <div className="summary">
                    <p>Topic: {topicOptions}</p><br></br>
                    <p>Level: {quizLevel}</p><br></br>
                    <p>Question: {usedQuestion}</p><br></br>
                </div>
                <p className="highestScore">Highest Score: {highestScore}</p>
            </div>
        );
    }
    return (
        <div className="card">
            <Quiz quizArray={finalArray} onReset={() => startQuiz(!settingScreen)} saveScore={bestScore}/>
        </div>
    );
} 