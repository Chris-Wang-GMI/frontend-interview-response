import { create } from 'zustand'
import { Maze } from '../../types'

interface MazeState {
  // Maze data
  mazes: Maze[]
  loading: boolean
  error: string | null
  
  // Current maze selection
  currentMazeIndex: number
  
  // Maze progression tracking
  completedMazes: Set<number>
  
  // Actions
  setMazes: (mazes: Maze[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  setCurrentMazeIndex: (index: number) => void
  markMazeCompleted: (index: number) => void
  goToNextMaze: () => void
  fetchMazes: () => Promise<void>
}

export const useMazeStore = create<MazeState>((set, get) => ({
  // Initial state
  mazes: [],
  loading: true,
  error: null,
  currentMazeIndex: 0,
  completedMazes: new Set(),

  // Actions
  setMazes: (mazes) => set({ mazes }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  setCurrentMazeIndex: (index) => set({ currentMazeIndex: index }),
  
  markMazeCompleted: (index) => 
    set((state) => ({
      completedMazes: new Set([...state.completedMazes, index])
    })),
    
  goToNextMaze: () => {
    const { currentMazeIndex, mazes } = get()
    const nextIndex = currentMazeIndex + 1
    if (nextIndex < mazes.length) {
      set({ currentMazeIndex: nextIndex })
    }
  },

  fetchMazes: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch('http://localhost:8080/api/maze')
      if (!response.ok) throw new Error('Failed to fetch mazes')
      const data = await response.json()
      set({ mazes: data, loading: false })
    } catch (err) {
      set({ 
        error: err instanceof Error ? err.message : 'Unknown error',
        loading: false 
      })
    }
  }
}))

// Computed selectors
export const useMazeSelectors = () => {
  const { mazes, currentMazeIndex, completedMazes } = useMazeStore()
  
  return {
    currentMaze: mazes[currentMazeIndex],
    isCurrentMazeCompleted: completedMazes.has(currentMazeIndex),
    hasNextMaze: currentMazeIndex < mazes.length - 1,
    totalMazes: mazes.length,
    completedCount: completedMazes.size,
    isMazeCompleted: (index: number) => completedMazes.has(index)
  }
}