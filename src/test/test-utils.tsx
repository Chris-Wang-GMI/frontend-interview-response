import { ReactElement } from 'react'
import { vi } from 'vitest'
import { render, RenderOptions } from '@testing-library/react'
import { Maze, MazeCell } from '../../types'

// Test utilities for creating mock mazes
export const createTestMaze = (pattern: string[]): Maze => {
  return pattern.map(row => 
    row.split('').map(cell => {
      switch(cell) {
        case 'S': return 'start' as MazeCell
        case 'E': return 'end' as MazeCell  
        case '#': return 'wall' as MazeCell
        case '.': return 'path' as MazeCell
        default: return 'wall' as MazeCell
      }
    })
  )
}

// Mock mazes for testing
export const simpleMaze = createTestMaze([
  '#####',
  '#S..#',
  '#.#.#',
  '#..E#',
  '#####'
])

export const noSolutionMaze = createTestMaze([
  '#####',
  '#S#E#',
  '#####'
])

export const complexMaze = createTestMaze([
  '###########',
  '#S.......##',
  '#.#####.###',
  '#.....#.###',
  '#####.#.###',
  '#.....#...#',
  '#.#######.#',
  '#.........#',
  '#########E#',
  '###########'
])

// Helper to wait for async operations
export const waitFor = (ms: number) => 
  new Promise(resolve => setTimeout(resolve, ms))

// Custom render with providers
const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, options)

// Mock fetch for API calls
export const mockApiResponse = (mazes: Maze[]) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => mazes,
  }) as any
}

export const mockApiError = () => {
  global.fetch = vi.fn().mockRejectedValue(new Error('API Error')) as any
}

export * from '@testing-library/react'
export { customRender as render }