export interface QuizQuestionsProps {
    context: any;

}
export interface QuizQuestionsStates {
    currentQuestionIndex: number,
    questions: any[],
    selectedAnswer: string,
    resetComponent: boolean,
    showAnswerSelectionError: boolean;
    showAnswerFeedback: boolean;
    userRecordID: number;
    isAnswerCorrect: boolean;
    score: number;
    isLoading:boolean;
}