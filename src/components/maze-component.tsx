import { Ghost, Key } from 'lucide-react'
import { Maze } from '../../types'

type Position = { row: number; col: number }

interface MazeComponentProps {
  maze: Maze
  currentPosition?: Position | null
  visitedPath?: Position[]
}

export function MazeComponent({ maze, currentPosition, visitedPath = [] }: MazeComponentProps) {
  const isCurrentPosition = (row: number, col: number): boolean => {
    return currentPosition?.row === row && currentPosition?.col === col
  }

  const isVisited = (row: number, col: number): boolean => {
    return visitedPath.some(pos => pos.row === row && pos.col === col)
  }

  const getCellStyle = (cell: string, row: number, col: number): string => {
    const baseStyle = 'w-6 h-6 flex items-center justify-center'
    
    if (cell === 'wall') return `${baseStyle} bg-sky-800`
    if (isCurrentPosition(row, col)) return `${baseStyle} bg-red-400` // Ghost position
    if (cell === 'end') return `${baseStyle} bg-red-400` // Key
    if (cell === 'start') return `${baseStyle} bg-green-400`
    if (isVisited(row, col)) return `${baseStyle} bg-sky-300` // Visited path
    
    return `${baseStyle} bg-sky-100` // Default path
  }

  const getCellContent = (cell: string, row: number, col: number) => {
    if (isCurrentPosition(row, col)) {
      return <Ghost size={16} className="text-white" />
    }
    if (cell === 'end') {
      return <Key size={16} className="text-white" />
    }
    return null
  }

  return (
    <div className="inline-block border-2 border-gray-400 p-4">
      <div className="grid gap-0" style={{ gridTemplateColumns: `repeat(${maze[0]?.length || 0}, 1fr)` }}>
        {maze.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={getCellStyle(cell, rowIndex, colIndex)}
            >
              {getCellContent(cell, rowIndex, colIndex)}
            </div>
          ))
        )}
      </div>
    </div>
  )
}