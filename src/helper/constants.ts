export const userDetailHeaderText:string = "Let's get to know you a bit before we move forward!"
export const userDetailsValidationText:string = "Something went wrong. Please make sure that you've entered all the valid information."
export const quizHeaderText:string = "Quiz time!!"
export const instructionsHeaderText:string = "Instructions"
export const resultsHeaderText:string = "Results!!"
export const timePickerPlaceholder:string = "HH:MM";
export const momentTimeFormat = "hh:mm A";
export const momentDateFormat = "YYYY-MM-DD";
export const IdQueryParamName ="ID";
export const currentDateReplacePlaceHolder = "<currentdate>";
export const answerNotSelectedText = "Please enter or select an answer.";
export const qualificationScore = 50;
export const congratulationText = "Congratulations!!"
export const failedText = "Better luck next time!!"

export const reactRoutes = {
    instructions:"/",
    userDetails:"/user",
    quiz:"/quizNext",
    results:"/result"
}

export const SPLists = {
    quizResponseTitle:"Quiz Responses",
    quizResponseInternalName:"QuizResponses",
    quizQuestionsMasterTitle:"Questions Master",
    configListTitle:"Config",
    errorLogsTitle:"Error Logs",
    errorLogsInternalName:"ErrorLogs",
    quizInstructionsTitle:"Quiz Instructions"
} 

export const SPAPIQueryString = {
    questionsQueryString:'$select=Id,Question,Answer,Choices,QuestionType,Config,APIURL&$orderby=Sequence&$filter=IsActive eq 1',
    quizResultQueryString:'$select=Id,Score',
    quizInstructionsQueryString : '$select=Id,Instruction,Sequence&$orderby=Sequence&$filter=IsActive eq 1'
}

export const userResponseJsonKeys = {
    questionObjectKey : "QID",
    answerObjKey : "UserAns",
    correctAnswerObjKey: "CorrectAns"
}

export const AzureFunctionKeys = {
    azureFunctionGetTimeAPIURLKey: "AzureFunctionGetTimeAPIURL"
}

export const questionMasterColumns = {
    question:"Question",
    answer:"Answer",
    choices:"Choices",
    questionType:"QuestionType",
    sequence:"Sequence",
    config:"Config",
    APIURL:"APIURL"
}

export const questionTypes = {
    choice:"Choice",
    time:"Time"
}


