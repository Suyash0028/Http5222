// Question.jsx
import React, { useState, useEffect } from 'react';
import './Question.css';

const Question = () => {
    const [category, setCategory] = useState(null);
    const [question, setQuestion] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [revealed, setRevealed] = useState(false);
    const fetchQuestion = async () => {
        const response = await fetch('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium&type=boolean');
        const data = await response.json();
        const [result] = data.results;
        setCategory(result.category);
        setQuestion(result.question);
        setAnswer(result.correct_answer);
    };
    useEffect(() => {
        fetchQuestion();
    }, []);

    const showAnswer = () => {
        setRevealed(true);
    };

    return (
        <>
            <div className="container">
                <h1>
                    Welcome to Trivia
                </h1>
                <p>Here's your random question</p>
                <h2>True or false:</h2>
                <div className="question-container">
                    <div style={{ color: "grey" }}><i>{category}</i></div>
                    <h3><div dangerouslySetInnerHTML={{ __html: question }}></div></h3>
                    {revealed && <div className='answer-container'>{answer}</div>}
                    <button type="button" onClick={showAnswer}>Reveal answer</button>
                </div>
            </div>
        </>
    );
}

export default Question;
