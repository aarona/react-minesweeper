import { ICell, IGame, GameStatus, CellStatus } from "./interfaces"

export const newGameState = (height: number, width: number, mineCount: number): IGame => {
  const rows = new Array<ICell[]>(height)
  const safeCellCount = height * width - mineCount

  for (let row = 0; row < rows.length; row++) {
    rows[row] = Array<ICell>(width)
    for (let col = 0; col < rows[row].length; col++) {
      rows[row][col] = {
        row,
        col,
        mine: false,
        exploded: false,
        status: CellStatus.Hidden,
        hintValue: null
      }
    }
  }

  return { data: rows, status: GameStatus.New, safeCellCount }
}

export const startingGameState = (
  game: IGame,
  height: number,
  width: number,
  mineCount: number,
  row: number,
  col: number
  ): IGame => {
  
  const { data: rows } = game
  game.status = GameStatus.Running
  
  const safeCellCount = height * width - mineCount
  createMines(rows, height, width, mineCount, row, col)

  return { data: rows, status: GameStatus.Running, safeCellCount }
}

export const revealCell = (game: IGame, row: number, col: number): boolean => {
  let { data } = game
  let currentCell = data[row][col]

  // You stepped on a mine! Ouch!
  if (currentCell.mine) {
    return false

  // This cell has already been revealed so we can skip
  // revealing its neighbors and just return a success.
  // Flagged cells should not be revealed also so we skip
  // revealing unless the cell is specifically in the hidden
  // state
  } else if (currentCell.status !== CellStatus.Hidden) {
    return true

  // This is a cell with no mine that is currently hidden
  // and needs to be revealed and the rest of its neighbors
  // should be tested to see if they should also be revealed.
  } else {
    revealNeighbors(game, currentCell)
    return true
  }
}

export const getHintValueClasses = (hintValue: number): string => {
  const valueClasses = ["one", "two", "three", "four", "five", "six", "sevem", "eight"]
  
  return valueClasses[hintValue - 1]
}

const createMines = (
  rows: ICell[][],
  height: number,
  width: number,
  mineCount: number,
  row: number,
  col: number
  ): void => {

  const shuffleArray = (array: Array<[number, number]>): void => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  const cells = new Array<[number, number]>()

  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      // remove the cell the player clicked from the list
      // so they don't get a mine the first time.
      if(!(row === r && col === c)) {
        cells.push([r, c])      
      }
    }
  }

  shuffleArray(cells)
  
  const dangerousCells = cells.slice(0, mineCount)

  dangerousCells.forEach((cell) => {
    const [row, col] = cell
    rows[row][col].mine = true
  })
} 

// Determines the hint number for a cell after it's been clicked.
const getNeighborMineCount = (game: IGame, cell: ICell): number => {
  let neighbors = getNeighbors(game, cell)
  
  neighbors = neighbors.filter((cell) => {
    return cell.mine
  })

  return neighbors.length
}

const revealNeighbors = (game: IGame, currentCell: ICell): void => {
  // We've tried revealing this cell before and succeeded so
  // we dont have to do it again.
  if (currentCell.status !== CellStatus.Hidden) {
    return
  }

  // We haven't set the mine count for this cell yet so lets do that.
  if(!currentCell.hintValue) {
    currentCell.hintValue = getNeighborMineCount(game, currentCell)
  }

  currentCell.status = CellStatus.Revealed
  game.safeCellCount = game.safeCellCount - 1

  if(currentCell.hintValue > 0) {
    return
  } else {
    let hiddenNeighbors = getNeighbors(game, currentCell)

    // We only want to continue revealing neighbors if the neighbor cell
    // doesn't have a mine and it hasn't been revealed but also that its
    // not a flagged cell (Player thinks the cell is a mine)
    hiddenNeighbors = hiddenNeighbors.filter((c) => {
      return c.status === CellStatus.Hidden && !c.mine
    })

    hiddenNeighbors.forEach((cell) => {
      revealNeighbors(game, cell)
    })
  }
}

const getNeighbors = (game: IGame, currentCell: ICell): ICell[] => {
  const { row, col } = currentCell
  const [top, bottom, left, right] = [row - 1, row + 1, col - 1, col + 1]
  let { data } = game
  let cells: ICell[] = []

  // Look for a top row and cells.
  if (data[top]) {
    // Does a top left cell exist?
    if (data[top][left]) {
      cells.push(data[top][left])
    }

    // Does a top right cell exist?
    if (data[top][right]) {
      cells.push(data[top][right])
    }

    // Because the "if" block checks for a row above,
    // we can assume that there is a top cell.
    cells.push(data[top][col])
  }

  // Look for a left side cell.
  if (data[row][left]) {
    cells.push(data[row][left])
  }

  // Look for a right side cell.
  if (data[row][right]) {
    cells.push(data[row][right])
  }

  // Look for a bottom row and cells.
  if (data[bottom]) {

    // Does a bottom left cell exist?
    if (data[bottom][left]) {
      cells.push(data[bottom][left])
    }

    // Does a bottom right cell exist?
    if (data[bottom][right]) {
      cells.push(data[bottom][right])
    }

    // Because the "if" block checks for a row below,
    // we can assume that there is a bottom cell.
    cells.push(data[bottom][col])
  }

  return cells
}