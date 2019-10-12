export enum CellStatus {
  Hidden,
  Flagged,
  Revealed
}
export interface ICell {
  row: number
  col: number
  mine: boolean
  exploded: boolean
  status: CellStatus
  hintValue: number | null
}

export interface ICellProps {
  cell: ICell
  gameOver: boolean
  handleClick: (row: number, col: number) => void
  handleContextMenu: (row: number, col: number) => void
}

export interface IGameProps {
  height: number
  width: number
  mineCount: number
  handleNewGameSubmit: () => void
}

export interface ISettingsProps {
  handleSettingsSubmit: (height: number, width: number, mineCount: number) => void
}

export enum GameStatus {
  New,
  Running,
  Over,
  Settings,
  Won
}

export interface IGame {
  data: ICell[][]
  status: GameStatus
  safeCellCount: number
}

export interface ITimerProps {
  //onStart: () => void
  //onPause: () => void
  //onReset: () => void
  days: number
  hours: number
  minutes: number
  seconds: number
}