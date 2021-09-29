import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (<button className="square" style={props.styleSquare} onClick={() => props.onClick()}>
        {props.value}
    </button>)
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)}/>;
    }
    renderWinSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} styleSquare={{color: 'red'}}/>;
    }
    render() {
        const winStreak = this.props.winStreak;
        let board = []
        console.log(winStreak)
        for (let i = 0; i < 3; i++) {
            let row = []
            for (let j = 0; j < 3; j++) {
                if (winStreak.length != 0) {
                    if (winStreak.indexOf(i * 3 + j) != -1) {
                        row.push(this.renderWinSquare(i * 3 + j))
                    }
                    else {
                        row.push(this.renderSquare(i * 3 + j))
                    }
                    continue;
                }
                row.push(this.renderSquare(i * 3 + j))
            }
            board.push(<div className="board-row">{row}</div>)
        }
        return(
            <div>
                {board}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                posX: null,
                posY: null
            }],
            stepNumber: 0,
            xIsNext: true,
            isReverse: false,
            winStreak: null
        }
    }
    calculateWinner(squares) {
        const winLine = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]
        for (let i = 0; i < winLine.length; i++) {
            const [a, b, c] = winLine[i];
            if (squares[a] && squares[a] == squares[b] && squares[a] == squares[c]) {
                return {
                    winner: squares[a],
                    winStreak: winLine[i]
                }
            }
        }
        return null
    }
    jumpTo(stepNumber) {
        this.setState({
            stepNumber: stepNumber,
            xIsNext: (stepNumber % 2) === 0
        })
    }
    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (this.calculateWinner(squares) || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
                posX: Math.floor(i / 3),
                posY: i % 3,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        })
    }
    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const resultCaculateWinner = this.calculateWinner(current.squares);
        let winner = null;
        let winStreak = [];
        if (resultCaculateWinner) {
            winner = this.calculateWinner(current.squares).winner
            winStreak = this.calculateWinner(current.squares).winStreak
        }

        const isReverse = this.state.isReverse;

        const bold = {
            fontWeight: 'bold'
        }

        const normal = {
            fontWeight: 'normal'
        }

        const moves = history.map((step, move) => {
            const posX = this.state.history[move].posX;
            const posY = this.state.history[move].posY;
            const key = `${posX}, ${posY}`
            const desc = move ? 'Go to move #' + move + `(${posX}, ${posY})` : 'Go to game start';
            return (
                <li key={key}>
                    <button onClick={() => this.jumpTo(move)} style={this.state.stepNumber === move ? bold : normal}>{desc}</button>
                </li>
            )
        })
        let status;
        if (this.state.stepNumber === 9 && !resultCaculateWinner) {
            status = 'Draw match'
        }
        else if (resultCaculateWinner) {
            status = 'The winner is: ' + winner;
        }
        else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} winStreak={winStreak}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={()=>this.sortMoves()}>Sort</button>
                    <ol>{!isReverse ? moves : moves.reverse()}</ol>
                </div>
            </div>
        );
    }
    sortMoves() {
        this.setState({
            isReverse: !this.state.isReverse
        })
    }
}

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
