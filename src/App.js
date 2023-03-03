import React, { useState, useRef, useEffect } from 'react';

import logo from './logo.svg';
import './App.css';


// todo: Welcome player greeting, depending on gameHasStarted flag on gameState
function App() {
  return (
    <>
      <div className="Game">
          <Game />
      </div>
    </>
  );
}

function Game() {
    let dictionary = useRef([]); 

    useEffect(() => fetch_dictionary(dictionary), []);

    let [game_state, setGameState] = useState(
        { 
            board: generate_board(), 
            lastClickedIndex: -1,
            currentWord: '',
            tallyTable: [],
            currentScore: 0,
            currentTime: 180,
            highScoreTable: [],
            gameHasStarted: true,
    });

    window.game_state = game_state;

    return (
        <>
            <Timer gameState={game_state} setState={setGameState} />
            <Board gameState={game_state} setState={setGameState} />
            <CurrentWord gameState={game_state} setState={setGameState} dictionary={dictionary}/>
            <ScoreTally gameState={game_state} setState={setGameState}/>
        </>
    );
}

function Timer({gameState, setState}) {

    // todo: SetState not working for currentTime.
    // todo: correctly display high-score table
    useEffect(
        () => {
            setInterval(() => {
                // setState({...gameState, currentTime: gameState.currentTime - 1});
                console.log(gameState);

                if (gameState.currentTime <= 0) {
                    let score_message = "Your score is: ";
                    let user_name_msg = "Please enter your name: ";
                    let user_name = prompt(score_message + gameState.currentScore + '\n' + user_name_msg);

                    let highScoreTmp = [...gameState.highScoreTable];
                    highScoreTmp.push(user_name + ' | ' + gameState.currentScore);

                    // setState({...gameState, highScoreTable: highScoreTmp});
                }
            }, 1000)
        }, []
    );

    return (
        <>
            <h4>Time Remaining:</h4>
            <span>{gameState.currentTime}</span>
        </>
    );
}

function ScoreTally({gameState, setGameState}) {
    return (
        <>
            <table>
                {gameState.tallyTable.map(
                    (item, currentIndex) => {
                        return <ScoreRow item={item} key={currentIndex} /> 
                    }
                )}
                <tr>{gameState.currentScore}</tr>
            </table>
        </>
    );
}

// item[0] is word itself
// item[1] is the score value
function ScoreRow({item, currentIndex}) {
    return (
        <tr>
            <td>{item[0]}</td> 
            <td>{item[1]}</td>
        </tr>
    );
}

function Board({gameState, setState}) {
    const select_space = (index) => {
        if (space_is_valid_adjacent(gameState, index, gameState.lastClickedIndex) || gameState.lastClickedIndex == -1) {
            setState({...gameState, 
                currentWord: gameState.currentWord + gameState.board[index],
                lastClickedIndex: index
            });
        }
    };

    return (
        <>
            <div>
                <Space selectSpace={() => select_space(0)} value={gameState.board[0]}/>
                <Space selectSpace={() => select_space(1)} value={gameState.board[1]}/>
                <Space selectSpace={() => select_space(2)} value={gameState.board[2]}/>
                <Space selectSpace={() => select_space(3)} value={gameState.board[3]}/>
                <Space selectSpace={() => select_space(4)} value={gameState.board[4]}/>
            </div>
            <div>
                <Space selectSpace={() => select_space(5)} value={gameState.board[5]}/>
                <Space selectSpace={() => select_space(6)} value={gameState.board[6]}/>
                <Space selectSpace={() => select_space(7)} value={gameState.board[7]}/>
                <Space selectSpace={() => select_space(8)} value={gameState.board[8]}/>
                <Space selectSpace={() => select_space(9)} value={gameState.board[9]}/>
            </div>
            <div>
                <Space selectSpace={() => select_space(10)} value={gameState.board[10]}/>
                <Space selectSpace={() => select_space(11)} value={gameState.board[11]}/>
                <Space selectSpace={() => select_space(12)} value={gameState.board[12]}/>
                <Space selectSpace={() => select_space(13)} value={gameState.board[13]}/>
                <Space selectSpace={() => select_space(14)} value={gameState.board[14]}/>
            </div>
            <div>
                <Space selectSpace={() => select_space(15)} value={gameState.board[15]}/>
                <Space selectSpace={() => select_space(16)} value={gameState.board[16]}/>
                <Space selectSpace={() => select_space(17)} value={gameState.board[17]}/>
                <Space selectSpace={() => select_space(18)} value={gameState.board[18]}/>
                <Space selectSpace={() => select_space(19)} value={gameState.board[19]}/>
            </div>
            <div>
                <Space selectSpace={() => select_space(20)} value={gameState.board[20]}/>
                <Space selectSpace={() => select_space(21)} value={gameState.board[21]}/>
                <Space selectSpace={() => select_space(22)} value={gameState.board[22]}/>
                <Space selectSpace={() => select_space(23)} value={gameState.board[23]}/>
                <Space selectSpace={() => select_space(24)} value={gameState.board[24]}/>
            </div>
        </>
    );
}

function fetch_dictionary(dictionary_ref) {
    // fetch
    let result = fetch('https://raw.githubusercontent.com/raun/Scrabble/master/words.txt')
        .then((res) => res.text())
        .then((resT) => {
            dictionary_ref.current = resT.split('\n');
        })
}

function evaluate_point_of_word(word, dictionary) {
    if (dictionary.current.includes(word)) {
        if (word.length == 4 || word.length == 3) {
            return [word, 1]
        }
        if (word.length == 5) {
            return [word, 2]
        }
        if (word.length == 6) {
            return [word, 3]
        }
        if (word.length == 7) {
            return [word, 5]
        }
        if (word.length >= 8) {
            return [word, 11]
        }
    }
    else {
        return [word, -2];
    }
}

// todo: most recent letter needs to render a different character
// todo: click handler on the most recent letter to undo.
function CurrentWord({gameState, setState, dictionary}) {
    const submitWord = () => {
        // look up....
        let new_item = evaluate_point_of_word(gameState.currentWord, dictionary);

        // add 
        setState({...gameState, 
            tallyTable: [...gameState.tallyTable, new_item],
            currentWord: '',
            lastClickedIndex: -1,
            currentScore: gameState.currentScore + new_item[1]
        });
    }

    return (
        <>
            <h4>{gameState.currentWord}</h4>
            <button onClick={() => submitWord()}>Submit Word</button>
        </>
    );
}


function space_is_valid_adjacent(gameState, current_index, last_index) {
    // Corners
    if (last_index == 0) {
        return current_index == 1 || current_index == 5 || current_index == 6;
    }
    if (last_index == 4) {
        return current_index == 3 || current_index == 9 || current_index == 8;
    }
    if (last_index == 20) {
        return current_index == 21 || current_index == 15 || current_index == 16;
    }
    if (last_index == 24) {
        return current_index == 23 || current_index == 19 || current_index == 18;
    }

    // Top, bottom row
    if (last_index > 0 && last_index < 4) {
        return current_index == last_index - 1 
            || current_index == last_index + 1 
            || current_index == last_index + 4
            || current_index == last_index + 5
            || current_index == last_index + 6;
    }
    if (last_index > 20 && last_index < 24) {
        return current_index == last_index - 1 
            || current_index == last_index + 1 
            || current_index == last_index - 4
            || current_index == last_index - 5
            || current_index == last_index - 6;
    }

    // Left, right column
    if (last_index == 5
        || last_index == 10
        || last_index == 15
    ) {
        return current_index == last_index - 5 
            || current_index == last_index + 5
            || current_index == last_index - 4
            || current_index == last_index + 1
            || current_index == last_index + 6;
    }
    if (last_index == 9
        || last_index == 14
        || last_index == 19
    ) {
        return current_index == last_index - 5 
            || current_index == last_index + 5
            || current_index == last_index - 6
            || current_index == last_index - 1
            || current_index == last_index + 4;
    }

    // Non-bordered space.
    return current_index == last_index - 6 
        || current_index == last_index - 5
        || current_index == last_index - 4
        || current_index == last_index - 1
        || current_index == last_index + 1
        || current_index == last_index + 4
        || current_index == last_index + 5
        || current_index == last_index + 6;
}

function Space({selectSpace, value}) {
    return (
        <button className="Space" onClick={selectSpace}>{value}</button>
    );
}

function generate_board() {
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    const dice =  [
        "aaafrs",
        "aaeeee",
        "aafirs",
        "adennn",
        "aeeeem",

        "aeegmu",
        "aegmnn",
        "afirsy",
        "bjkqxz",
        "ccenst",

        "ceiilt",
        "ceilpt",
        "ceipst",
        "ddhnot",
        "dhhlor",

        "dhlnor",
        "dhlnor",
        "eiiitt",
        "emottt",
        "ensssu",

        "fiprsy",
        "gorrvw",
        "iprrry",
        "nootuw",
        "ooottu",
    ];

    let result = [];

    while (dice.length > 0) {
        let chosen_dice = dice[getRandomInt(dice.length)];

        let char_index = getRandomInt(6);
        if (chosen_dice[char_index] == 'q') {
            result.push('QU');
        }
        else {
            result.push(chosen_dice[char_index].toUpperCase());
        }

        dice.splice(chosen_dice, 1);
    }

    return result;
}

export default App;
