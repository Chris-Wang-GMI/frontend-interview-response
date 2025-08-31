import { useState, useCallback } from 'react'
import { Maze } from '../../types'

type Position = { row: number; col: number }

interface SearchState {
  currentPosition: Position | null
  visitedPath: Position[]
  isSearching: boolean
  isCompleted: boolean
  foundKey: boolean
}

export function useMazeSearch(maze: Maze) {
  const [searchState, setSearchState] = useState<SearchState>({
    currentPosition: null,
    visitedPath: [],
    isSearching: false,
    isCompleted: false,
    foundKey: false
  })

  const findStart = useCallback((): Position | null => {
    for (let row = 0; row < maze.length; row++) {
      for (let col = 0; col < maze[row].length; col++) {
        if (maze[row][col] === 'start') {
          return { row, col }
        }
      }
    }
    return null
  }, [maze])

  const isValidMove = useCallback((pos: Position): boolean => {
    return (
      pos.row >= 0 && 
      pos.row < maze.length && 
      pos.col >= 0 && 
      pos.col < maze[0].length &&
      maze[pos.row][pos.col] !== 'wall'
    )
  }, [maze])

  const startSearch = useCallback(() => {
    const startPos = findStart()
    if (!startPos) return

    // DFS implementation
    const stack: Position[] = [startPos]
    const visited = new Set<string>()
    const searchSteps: Position[] = []

    const dfsStep = () => {
      if (stack.length === 0) {
        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          isCompleted: true
        }))
        return
      }

      const current = stack.pop()!
      const key = `${current.row},${current.col}`

      if (visited.has(key)) {
        setTimeout(dfsStep, 300)
        return
      }

      visited.add(key)
      searchSteps.push(current)

      // Update UI
      setSearchState(prev => ({
        ...prev,
        currentPosition: current,
        visitedPath: [...searchSteps]
      }))

      // Check if found key
      if (maze[current.row][current.col] === 'end') {
        setSearchState(prev => ({
          ...prev,
          isSearching: false,
          isCompleted: true,
          foundKey: true
        }))
        return
      }

      // Explore neighbors (right, down, left, up)
      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]]
      for (const [dr, dc] of directions) {
        const next = { row: current.row + dr, col: current.col + dc }
        if (isValidMove(next) && !visited.has(`${next.row},${next.col}`)) {
          stack.push(next)
        }
      }

      setTimeout(dfsStep, 300) // 300ms delay for animation
    }

    setSearchState({
      currentPosition: startPos,
      visitedPath: [startPos],
      isSearching: true,
      isCompleted: false,
      foundKey: false
    })

    setTimeout(dfsStep, 300)
  }, [maze, findStart, isValidMove])

  const resetSearch = useCallback(() => {
    setSearchState({
      currentPosition: null,
      visitedPath: [],
      isSearching: false,
      isCompleted: false,
      foundKey: false
    })
  }, [])

  return {
    ...searchState,
    startSearch,
    resetSearch
  }
}