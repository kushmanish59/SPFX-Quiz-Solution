import * as React from 'react';
import { Component } from 'react';

export interface QuizOptionProps {
    option: string;
    isCorrect: boolean;
    isSelected: boolean;
    showCorrectAnswer: boolean;
    onSelect: () => void;
}

export default class QuizOption extends Component<QuizOptionProps> {
    render() {
        const { option, isCorrect, isSelected, showCorrectAnswer, onSelect } = this.props;
        let backgroundColor = '';
        if (isSelected && showCorrectAnswer) {
            backgroundColor = isCorrect ? 'green' : 'red';
        }
        return (
            <div
                className="quiz-option"
                style={{ backgroundColor: backgroundColor }}
                onClick={onSelect}
            >
                {option}
                {showCorrectAnswer && isCorrect && <span style={{ color: 'green' }}> (Correct)</span>}
            </div>
        );
    }
}
