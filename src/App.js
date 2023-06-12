import React, { useReducer } from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import Data from "./data/questions.json";
import StartScreen from "./components/StartScreen";
import Question from "./components/Question";
import NextButton from "./components/NextButton";
import Progress from "./components/Progress";
import FinishedScreen from "./components/FinishedScreen";
import QuizTimer from "./components/QuizTimer";

const SECS_PER_QUESTION = 30;

const initialState = {
  questions: [...Data.questions],

  //'ready','active', 'finished'
  status: "ready",
  index: 0,
  answer: null,
  points: 0,
  highscore: 0,
  secondsRemaning: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "start":
      return {
        ...state,
        status: "active",
        secondsRemaning: state.questions.length * SECS_PER_QUESTION
      };

    case "newAnswer":
      const question = state.questions.at(state.index);
      return {
        ...state,
        answer: action.payload,
        points:
          action.payload === question.correctOption
            ? state.points + question.points
            : state.points
      };

    case "nextQuestion":
      return {
        ...state,
        index: state.index + 1,
        answer: null
      };

    case "finish":
      return {
        ...state,
        status: "finished",
        highscore:
          state.points > state.highscore ? state.points : state.highscore
      };

    case "restart":
      return {
        ...initialState,
        highscore: state.highscore
      };

    case "tick":
      return {
        ...state,
        secondsRemaning: state.secondsRemaning - 1,
        status: state.secondsRemaning === 0 ? "finished" : state.status
      };

    default:
      throw new Error("Unknown action");
  }
};

const App = () => {
  const [
    { questions, status, index, answer, points, highscore, secondsRemaning },
    dispatch
  ] = useReducer(reducer, initialState);

  const numQuestions = questions.length;
  const maxPossiblePoints = questions.reduce(
    (prev, curr) => prev + curr.points,
    0
  );

  return (
    <div className="app">
      <Header />
      <Main>
        {status === "ready" && (
          <StartScreen dispatch={dispatch} numQuestions={numQuestions} />
        )}
        {status === "active" && (
          <>
            <Progress
              index={index}
              points={points}
              numQuestions={numQuestions}
              maxPossiblePoints={maxPossiblePoints}
              answer={answer}
            />
            <Question
              dispatch={dispatch}
              answer={answer}
              question={questions[index]}
            />
            <footer>
              <QuizTimer
                secondsRemaning={secondsRemaning}
                dispatch={dispatch}
              />
              <NextButton
                dispatch={dispatch}
                answer={answer}
                index={index}
                numQuestions={numQuestions}
              />
            </footer>
          </>
        )}

        {status === "finished" && (
          <FinishedScreen
            points={points}
            maxPossiblePoints={maxPossiblePoints}
            highscore={highscore}
            dispatch={dispatch}
          />
        )}
      </Main>
    </div>
  );
};

export default App;
