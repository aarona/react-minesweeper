import React, { useState } from 'react';
import { Game } from './components/Game';
import { Settings } from './components/Settings';
import { Row, Col, Container, Accordion } from 'react-bootstrap'

const App: React.FC = () => {
  const [height, setHeight] = useState(0)
  const [width, setWidth] = useState(0)
  const [mineCount, setMineCount] = useState(0)
  const [settingsMode, setSettingsMode] = useState(true)

  const handleSettingsSubmit = (height: number, width: number, mineCount: number): void => {
    setSettingsMode(false)
    setHeight(height)
    setWidth(width)
    setMineCount(mineCount)
  }

  const handleNewGameSubmit = (): void => {
    setSettingsMode(true)
    setHeight(0)
    setWidth(0)
    setMineCount(0)
  }

  return (
    <Container>
      <Row>
      {settingsMode ? (
        <Settings handleSettingsSubmit={handleSettingsSubmit} />
      ) : (
        <Game height={height} width={width} mineCount={mineCount} handleNewGameSubmit={handleNewGameSubmit} />
      )}
      </Row>
      <Row>
        <Col sm="12" md={{ span: 8, offset: 2 }} className="button-row">
          <Accordion>
            <div>
              <Accordion.Toggle as={"h4"} eventKey="0">
                &raquo; Minesweeper instructions <span>(Click to view)</span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="0">
                <>
                <p>
                  You are presented with a board of squares. Some squares contain mines (bombs), others don't.
                  If you click on a square containing a bomb, you lose. If you manage to click all the squares
                  (without clicking on any bombs) you win. Clicking a square which doesn't have a bomb reveals
                  the number of neighbouring squares containing bombs. Use this information plus some guess work
                  to avoid the bombs. To open a square, point at the square and click on it. To mark a square you
                  think is a bomb, point and right-click (or if you're on a mobile devise, use the "Flag Mode"
                  button to turn flagging on or off).
                </p>
                <p>
                  A squares "neighbours" are the squares adjacent above, below, left, right, and all 4 diagonals.
                  Squares on the sides of the board or in a corner have fewer neighbors. The board does not wrap
                  around the edges. If you open a square with 0 neighboring bombs, all its neighbors will automatically
                  open. This can cause a large area to automatically open. To remove a flag marker from a square,
                  point at it and right-click again (or use the "Flag Mode" buttong if you're on mobile). The first
                  square you open is never a bomb. Incorrect bomb marking doesn't kill you, but it can lead to
                  mistakes which do. You don't have to mark any of the bombs to win; you just need to open all
                  non-bomb squares.
                </p>
                <p>
                  Underneath the game is a running tally of how many flags you've placed on the board. If you solve
                  the puzzle correctly, you shouldn't end up with more flags than there should be (the number of
                  mines there are in the game).
                </p>
                </>
              </Accordion.Collapse>
            </div>
            <div>
              <Accordion.Toggle as={"h4"} eventKey="1">
                &raquo; Source code <span>(Click to view)</span>
              </Accordion.Toggle>
              <Accordion.Collapse eventKey="1">
                <p>
                  Source code link to go here...
                </p>
              </Accordion.Collapse>
            </div>
          </Accordion>
        </Col>
      </Row>
    </Container>
  );
}

export default App;
