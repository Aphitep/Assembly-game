import { useState } from "react";
import { languages } from "../language";
import clsx from "clsx";
import { getFarewellText , randomWord } from "../utils";

function App() {
  const [currentWord, setCurrentWord] = useState(randomWord());
  const [guessLetter, setGuessLetter] = useState([]);

  const wrongGuessCount = guessLetter.filter(
    (letter) => !currentWord.includes(letter)
  ).length;

  const lastGuessLetter = guessLetter[guessLetter.length - 1];
  const isLastGuessLetterIncorrect =
    lastGuessLetter && !currentWord.includes(lastGuessLetter);
  const guessLetterLeft = languages.length - 1;
  const isGameWon = currentWord
    .split("")
    .every((letter) => guessLetter.includes(letter));
  const isGameLost = wrongGuessCount >= guessLetterLeft;
  const isGameOver = isGameWon || isGameLost;

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  const alphabetElement = alphabet.split("").map((ele, index) => {
    const isCurrent = guessLetter.includes(ele);
    const isTrue = isCurrent && currentWord.includes(ele);
    const isFalse = isCurrent && !currentWord.includes(ele);
    const gameOver = isGameOver && currentWord.includes(ele)
    const className = clsx({
      correct: isTrue || gameOver,
      wrong: isFalse,
    });
    return (
      <button
        className={className}
        key={index}
        onClick={() => getGuessLetter(ele)}
        aria-disabled={currentWord.includes(ele)}
        aria-label={`Letter ${ele}`}
        disabled={isGameOver}
      >
        {ele.toLocaleUpperCase()}
      </button>
    );
  });

  const letterElement = currentWord
    .split("")
    .map((word, index) => {
      const className = clsx(
        isGameLost && !guessLetter.includes(word) && "missed-letter"
      )
      return (<span key={index} className={className}>
        {guessLetter.includes(word) || isGameOver ? word.toLocaleUpperCase() : " "}
      </span>)
    });

  const language = languages.map((lang, index) => {
    const isLanguageLost = index < wrongGuessCount;
    const style = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    const className = clsx("chips", isLanguageLost && "lost");

    return (
      <span key={index} className={className} style={style}>
        {lang.name}
      </span>
    );
  });
  function getGuessLetter(letter) {
    setGuessLetter((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  function newGame(){
    setCurrentWord(randomWord())
    setGuessLetter([])
  }

  function renderGameStatus() {
    if (!isGameOver && isLastGuessLetterIncorrect) {
      return (
        <>
          <p className="farewell-message">
            {getFarewellText(languages[wrongGuessCount - 1].name)}
          </p>
        </>
      );
    }

    if (isGameWon) {
      return (
        <>
          <h2>🎉You win!!🎉</h2>
          <p>Well done!!</p>
        </>
      );
    }
    if (isGameLost) {
      return (
        <>
          <h2>🎉Game Over!!🎉</h2>
          <p>Try Again!!</p>
        </>
      );
    }

    return null;
  }

  const gameStatusClass = clsx("game-status", {
    won: isGameWon,
    over: isGameLost,
    farewell: isLastGuessLetterIncorrect,
  });
  return (
    <main>
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word within 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section aria-live="polite" className={gameStatusClass}>
        {renderGameStatus()}
      </section>
      <section className="language-container">{language}</section>
      <section className="word-container">{letterElement}</section>
      <section className="keyboard">{alphabetElement}</section>
      <section className="sr-only" aria-live="polite" role="status">
        <p>
          {
            currentWord.includes(lastGuessLetter) 
            ? `Correct , the letter ${lastGuessLetter} is True`
            : `Sorry , the letter ${lastGuessLetter} is not Correct` 
          }
          You have {guessLetterLeft} attempts left.
        </p>
        <p>
          Current word:{" "}
          {currentWord
            .split("")
            .map((letter) =>
              guessLetter.includes(letter) ? letter + "." : "blank."
            )
            .join(" ")}
        </p>
      </section>
      {isGameOver && <button className="new-game" onClick={newGame}>New game</button>}
    </main>
  );
}

export default App;
