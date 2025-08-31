import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { act, renderHook } from '@testing-library/react'
import { useMazeStore, useMazeSelectors } from '../useMazeStore'
import { mockApiResponse, mockApiError, simpleMaze, complexMaze } from '../../test/test-utils'

describe('useMazeStore - Zustand Store Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    useMazeStore.setState({
      mazes: [],
      loading: true,
      error: null,
      currentMazeIndex: 0,
      completedMazes: new Set(),
    })
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Happy Path Scenarios', () => {
    it('should correctly fetch maze data on initialization', async () => {
      // GIVEN: API server is running and returning maze data
      const testMazes = [simpleMaze, complexMaze, simpleMaze]
      mockApiResponse(testMazes)
      
      const { result } = renderHook(() => useMazeStore())

      expect(result.current.loading).toBe(true)
      expect(result.current.mazes).toEqual([])

      // WHEN: fetchMazes is called
      await act(async () => {
        await result.current.fetchMazes()
      })

      // THEN: Store should contain 3 mazes
      expect(result.current.mazes).toHaveLength(3)
      expect(result.current.mazes).toEqual(testMazes)
      
      // AND: Loading state should be false
      expect(result.current.loading).toBe(false)
      
      // AND: Error should be null
      expect(result.current.error).toBe(null)
      
      // AND: currentMazeIndex should be 0
      expect(result.current.currentMazeIndex).toBe(0)
    })

    it('should correctly track maze completion', () => {
      // GIVEN: Store is initialized with mazes
      const { result } = renderHook(() => useMazeStore())
      
      act(() => {
        result.current.setMazes([simpleMaze, complexMaze, simpleMaze])
      })

      expect(result.current.completedMazes.size).toBe(0)

      // WHEN: markMazeCompleted is called for maze 0
      act(() => {
        result.current.markMazeCompleted(0)
      })

      // THEN: completedMazes Set should contain index 0
      expect(result.current.completedMazes.has(0)).toBe(true)
      expect(result.current.completedMazes.size).toBe(1)

      // Test multiple completions
      act(() => {
        result.current.markMazeCompleted(2)
      })

      expect(result.current.completedMazes.has(2)).toBe(true)
      expect(result.current.completedMazes.size).toBe(2)
    })

    it('should handle maze progression correctly', () => {
      // GIVEN: User is on maze 0 and store has multiple mazes
      const { result } = renderHook(() => useMazeStore())
      
      act(() => {
        result.current.setMazes([simpleMaze, complexMaze, simpleMaze])
        result.current.setCurrentMazeIndex(0)
      })

      expect(result.current.currentMazeIndex).toBe(0)

      // WHEN: goToNextMaze is called
      act(() => {
        result.current.goToNextMaze()
      })

      // THEN: currentMazeIndex should change to 1
      expect(result.current.currentMazeIndex).toBe(1)

      // Test progression to last maze
      act(() => {
        result.current.goToNextMaze()
      })

      expect(result.current.currentMazeIndex).toBe(2)
    })

    it('should provide correct selectors data', () => {
      // GIVEN: Store with mazes and some completed
      const { result: storeResult } = renderHook(() => useMazeStore())
      
      act(() => {
        storeResult.current.setMazes([simpleMaze, complexMaze, simpleMaze])
        storeResult.current.setCurrentMazeIndex(1)
        storeResult.current.markMazeCompleted(0)
        storeResult.current.markMazeCompleted(2)
      })

      const { result: selectorResult } = renderHook(() => useMazeSelectors())

      // THEN: Selectors should provide correct computed values
      expect(selectorResult.current.currentMaze).toBe(complexMaze)
      expect(selectorResult.current.isCurrentMazeCompleted).toBe(false)
      expect(selectorResult.current.hasNextMaze).toBe(true)
      expect(selectorResult.current.totalMazes).toBe(3)
      expect(selectorResult.current.completedCount).toBe(2)
      expect(selectorResult.current.isMazeCompleted(0)).toBe(true)
      expect(selectorResult.current.isMazeCompleted(1)).toBe(false)
      expect(selectorResult.current.isMazeCompleted(2)).toBe(true)
    })
  })

  describe('Exception Path Scenarios', () => {
    it('should handle API fetch failure', async () => {
      // GIVEN: API server is down or returns error
      mockApiError()
      
      const { result } = renderHook(() => useMazeStore())

      // WHEN: fetchMazes is called
      await act(async () => {
        await result.current.fetchMazes()
      })

      // THEN: Loading should be false
      expect(result.current.loading).toBe(false)
      
      // AND: Error message should be set
      expect(result.current.error).toBe('API Error')
      
      // AND: Mazes array should remain empty
      expect(result.current.mazes).toEqual([])
    })

    it('should prevent progression beyond last maze', () => {
      // GIVEN: User is on the last maze (index 2)
      const { result } = renderHook(() => useMazeStore())
      
      act(() => {
        result.current.setMazes([simpleMaze, complexMaze, simpleMaze])
        result.current.setCurrentMazeIndex(2) // Last maze
      })

      expect(result.current.currentMazeIndex).toBe(2)

      // WHEN: goToNextMaze is called
      act(() => {
        result.current.goToNextMaze()
      })

      // THEN: currentMazeIndex should remain 2
      expect(result.current.currentMazeIndex).toBe(2)
    })

    it('should handle duplicate maze completion calls', () => {
      // GIVEN: A maze that's already completed
      const { result } = renderHook(() => useMazeStore())
      
      act(() => {
        result.current.markMazeCompleted(0)
      })

      expect(result.current.completedMazes.size).toBe(1)
      expect(result.current.completedMazes.has(0)).toBe(true)

      // WHEN: Same maze is marked completed again
      act(() => {
        result.current.markMazeCompleted(0)
      })

      // THEN: Should not create duplicates
      expect(result.current.completedMazes.size).toBe(1)
      expect(result.current.completedMazes.has(0)).toBe(true)
    })

    it('should handle invalid maze index operations', () => {
      // GIVEN: Store with limited mazes
      const { result } = renderHook(() => useMazeStore())
      
      act(() => {
        result.current.setMazes([simpleMaze])
      })

      // WHEN: Try to set invalid current maze index
      act(() => {
        result.current.setCurrentMazeIndex(5) // Invalid index
      })

      // THEN: Store should handle gracefully
      expect(result.current.currentMazeIndex).toBe(5) // Store allows this, UI should handle validation
      
      const { result: selectorResult } = renderHook(() => useMazeSelectors())
      
      // Selectors should handle undefined gracefully
      expect(selectorResult.current.currentMaze).toBeUndefined()
      expect(selectorResult.current.hasNextMaze).toBe(false)
    })
  })

  describe('Store Integration', () => {
    it('should maintain state consistency across multiple operations', () => {
      // GIVEN: Fresh store
      const { result } = renderHook(() => useMazeStore())
      
      // WHEN: Multiple operations are performed
      act(() => {
        result.current.setMazes([simpleMaze, complexMaze, simpleMaze])
        result.current.setCurrentMazeIndex(0)
        result.current.markMazeCompleted(0)
        result.current.goToNextMaze()
        result.current.markMazeCompleted(1)
        result.current.goToNextMaze()
      })

      // THEN: State should be consistent
      expect(result.current.currentMazeIndex).toBe(2)
      expect(result.current.completedMazes.has(0)).toBe(true)
      expect(result.current.completedMazes.has(1)).toBe(true)
      expect(result.current.completedMazes.has(2)).toBe(false)
      expect(result.current.completedMazes.size).toBe(2)
    })
  })
})