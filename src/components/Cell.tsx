import React from 'react'
import { ICellProps, CellStatus } from '../lib/interfaces'
import { getHintValueClasses } from '../lib/game-helpers'
import mineImg from '../images/mine.png'
import explodedImg from '../images/exploded.png'
import flagImg from '../images/flag.png'

export const Cell: React.FC<ICellProps> = ({
  cell: {
    row,
    col,
    mine,
    exploded,
    status,
    hintValue
  },
  gameOver,
  handleClick,
  handleContextMenu
}) => {
  if (!hintValue)
    hintValue = 0

  const onClick = (e: React.FormEvent<HTMLDivElement>) => {
    handleClick(row, col)
  }

  const onContextMenu = (e: React.FormEvent<HTMLDivElement>) => {
    e.preventDefault()
    handleContextMenu(row, col)
  }

  const getClassNames = (status: CellStatus, hintValue: number): string => {
    const classNames = ["cell"]

    if (status === CellStatus.Revealed) {
      classNames.push("revealed")
      classNames.push(getHintValueClasses(hintValue))
    } else if (status === CellStatus.Flagged) {
      classNames.push("flagged")
    }

    if(mine && gameOver) {
      classNames.push("game-over")

      if (exploded) {
        classNames.push("exploded")
      }
    }

    return classNames.join(" ")
  }

  const getValue = (status: CellStatus, hintValue: number): string | JSX.Element => {
    let value: string = ""
    
    if (mine && gameOver) {
      return exploded ?
        <img className="mine" src={explodedImg} alt="" /> :
        <img className="mine" src={mineImg} alt="" />
    } else if (status === CellStatus.Flagged) {
      return <img className="mine" src={flagImg} alt="" />
    } else if(status === CellStatus.Revealed && hintValue !== 0) {
      value = hintValue.toString()
    }

    return value
  }

  return (
    <td className={getClassNames(status, hintValue)} onClick={onClick} onContextMenu={onContextMenu}>{getValue(status, hintValue)}</td>
  )
}