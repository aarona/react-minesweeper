import React, { useState } from 'react'
import { Cell } from './Cell'
import { IGameProps, GameStatus, CellStatus } from '../lib/interfaces'
import { newGameState, revealCell, startingGameState } from '../lib/game-helpers'
import { Col, Container, Row, FormGroup } from 'react-bootstrap'
import { Button } from 'react-bootstrap'

export const Game: React.FC<IGameProps> = ({height, width, mineCount, handleNewGameSubmit}) => {
  const [game, setGame] = useState(newGameState(height, width, mineCount))
  const [bit, setBit] = useState(true)
  const [flags, setFlags] = useState(0)
  const [flagMode, setFlagMode] = useState(false)  

  const handleClick = (row: number, col: number) => {
    if(flagMode) {
      handleContextMenu(row, col)

    } else {
      const newGameState = game

      if (newGameState.status === GameStatus.Over || newGameState.status === GameStatus.Won) {
        return
      }

      if (newGameState.data[row][col].status === CellStatus.Flagged) {
        return
      }

      // As soon as the player clicks a cell we generate the mines and
      // set the state of the game to running.
      if (newGameState.status === GameStatus.New) {
        newGameState.status = GameStatus.Running
        setGame(startingGameState(newGameState, height, width, mineCount, row, col))
      }

      if (!revealCell(newGameState, row, col))
      {
        newGameState.status = GameStatus.Over
        newGameState.data[row][col].exploded = true
        setGame(newGameState)
      } else {
        if (newGameState.safeCellCount === 0) {
          newGameState.status = GameStatus.Won
        }
  
        setGame(newGameState)
      }
    }
    
    setBit(!bit)
  }

  const handleContextMenu = (row: number, col: number) => {
    const newGameState = game
    const cell = newGameState.data[row][col]

    if (newGameState.status === GameStatus.Running) {
      if(cell.status === CellStatus.Flagged) {
        
        cell.status = CellStatus.Hidden
        setFlags(flags - 1)
      } else if (cell.status === CellStatus.Hidden) {
        
        cell.status = CellStatus.Flagged
        setFlags(flags + 1)
      }
      setGame(newGameState)
    } else {
      return
    }

    setBit(!bit)
  }

  const handleFlagMode = () => {
    if(game.status === GameStatus.Running)
      setFlagMode(!flagMode)
  }

  const getTitleAndClass = (): string[] => {
    let titleClassName: string = ""
    let title: string = "Mine Sweeper"

    if (game.status === GameStatus.Over) {
      titleClassName = "game-over"
      title = "Game Over!"
    } else if (game.status === GameStatus.Won) {
      titleClassName = "won"
      title = "You Won!"
    }

    return [title, titleClassName]
  }

  const renderCells = () => {
    const rows = []
    const gameOver = game.status === GameStatus.Over

    for (let row = 0; row < height; row++) {
      const cells = []
      for (let col = 0; col < width; col++) {
        const cell = game.data[row][col]
        cells.push(
          <Cell
            key={`${row}-${col}`}
            cell={cell}
            gameOver={gameOver}
            handleClick={handleClick}
            handleContextMenu={handleContextMenu}
          />
        )
      }
      rows.push(<tr key={row}>{cells}</tr>)
    }

    return rows
  }
  
  const [title, titleClassName] = getTitleAndClass()
  const rows = renderCells()
  var t = new Date()
  t.setSeconds(t.getSeconds() + 600)

  return (
    <Col>
      <Container>
        <Row>
          <Col>
            <h1 className={titleClassName}>{title}</h1>
          </Col>
        </Row>
        <Row>
          <Col>
            <Container>
            <table className="game">
              <tbody>
                {rows}
              </tbody>
            </table>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col sm={{ span: 4 }} md={{ span: 3, offset: 2 }} className="button-row">
            <FormGroup>
              <Button onClick={handleNewGameSubmit}>New Game</Button>
            </FormGroup>
          </Col>
          <Col sm={{ span: 4 }} md={{ span: 3 }} className="button-row">
            <FormGroup>
              <Button variant={(flagMode ? "danger" : "primary")} onClick={handleFlagMode} disabled={game.status !== GameStatus.Running}>Flag Mode: {(flagMode ? "On" : "Off")}</Button>
            </FormGroup>
            <span className="note">(Right click cells if you're using a desktop)</span>
          </Col>
          <Col sm={{ span: 3 }} md={{ span: 3 }} className="button-row">
            <span className={(flags > mineCount ? "flags danger" : "flags")}>Flags: {flags}/{mineCount}</span>
          </Col>
        </Row>
      </Container>
    </Col>
  )
}