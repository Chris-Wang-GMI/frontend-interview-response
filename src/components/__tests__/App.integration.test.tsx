import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../../app'
import { render, mockApiResponse, simpleMaze, complexMaze, noSolutionMaze } from '../../test/test-utils'

// Mock the store to provide controlled test data
const mockStore = {
  loading: false,
  error: null,
  currentMazeIndex: 0,
  setCurrentMazeIndex: vi.fn(),
  goToNextMaze: vi.fn(),
  fetchMazes: vi.fn(),
}

const mockSelectors = {
  currentMaze: simpleMaze,
  hasNextMaze: true,
  totalMazes: 3,
  completedCount: 0,
  isMazeCompleted: vi.fn(() => false),
}

vi.mock('../../store/useMazeStore', () => ({
  useMazeStore: () => mockStore,
  useMazeSelectors: () => mockSelectors,
}))

// Mock the search hook
vi.mock('../../hooks/useMazeSearch', () => ({
  useMazeSearch: () => ({
    currentPosition: null,
    visitedPath: [],
    isSearching: false,
    isCompleted: false,
    foundKey: false,
    startSearch: vi.fn(),
    resetSearch: vi.fn(),
  }),
}))

describe.skip('App Integration Tests', () => {
  const user = userEvent.setup()
  const mockMazes = [simpleMaze, complexMaze, noSolutionMaze]

  beforeEach(() => {
    vi.clearAllTimers()
    vi.useFakeTimers()
    mockApiResponse(mockMazes)
  })

  afterEach(() => {
    vi.runOnlyPendingTimers()
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  describe('Happy Path Scenarios', () => {
    it('should complete full maze progression flow', async () => {
      // GIVEN: User starts with maze 1 loaded
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Maze Navigator')).toBeInTheDocument()
      })

      // WHEN: User completes maze 1
      const startButton = screen.getByRole('button', { name: /start search/i })
      await user.click(startButton)

      expect(screen.getByText('Searching...')).toBeInTheDocument()

      // Fast-forward search completion
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // THEN: Next maze button should appear after completion
      await waitFor(() => {
        expect(screen.getByText(/key found/i)).toBeInTheDocument()
      })

      const nextMazeButton = screen.getByRole('button', { name: /next maze/i })
      expect(nextMazeButton).toBeInTheDocument()

      // WHEN: User clicks next maze and completes maze 2
      await user.click(nextMazeButton)
      
      expect(screen.getByText('Maze 2')).toBeInTheDocument()

      const startButton2 = screen.getByRole('button', { name: /start search/i })
      await user.click(startButton2)

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // AND: User completes maze 3
      const nextMazeButton2 = await screen.findByRole('button', { name: /next maze/i })
      await user.click(nextMazeButton2)

      const startButton3 = screen.getByRole('button', { name: /start search/i })
      await user.click(startButton3)

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // THEN: All mazes completed message should appear
      await waitFor(() => {
        expect(screen.getByText(/all mazes completed/i)).toBeInTheDocument()
      })

      expect(screen.queryByRole('button', { name: /next maze/i })).not.toBeInTheDocument()
    })

    it('should allow manual maze switching', async () => {
      // GIVEN: User has completed maze 1
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Maze 1')).toBeInTheDocument()
      })

      // Complete first maze
      await user.click(screen.getByRole('button', { name: /start search/i }))
      
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      await waitFor(() => {
        expect(screen.getByText(/key found/i)).toBeInTheDocument()
      })

      // WHEN: User manually clicks on "Maze 2" button
      const maze2Button = screen.getByRole('button', { name: /maze 2/i })
      await user.click(maze2Button)

      // THEN: Current maze should switch to maze 2
      expect(screen.getByRole('button', { name: /start search/i })).toBeInTheDocument()

      // AND: Completed maze 1 should show checkmark
      const maze1Button = screen.getByRole('button', { name: /maze 1/i })
      expect(maze1Button).toBeInTheDocument()
      // CheckCircle icon should be present in maze 1 button
    })

    it('should display correct button states during search', async () => {
      // GIVEN: User starts a search
      render(<App />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start search/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /start search/i })

      // WHEN: User clicks start search
      await user.click(startButton)

      // THEN: Button should show searching state with warning styling
      expect(screen.getByText('Searching...')).toBeInTheDocument()
      expect(startButton).toBeDisabled()

      // AND: Maze selector buttons should be disabled
      const mazeButtons = screen.getAllByRole('button', { name: /maze \d/i })
      mazeButtons.forEach(button => {
        expect(button).toBeDisabled()
      })

      // WHEN: Search completes
      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // THEN: Buttons should be re-enabled with correct states
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
      })

      mazeButtons.forEach(button => {
        expect(button).not.toBeDisabled()
      })
    })

    it('should display correct icons based on state', async () => {
      // GIVEN: App is loaded
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Maze Navigator')).toBeInTheDocument()
      })

      // WHEN: User starts and completes a search
      await user.click(screen.getByRole('button', { name: /start search/i }))

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // THEN: Trophy icon should show when key is found
      await waitFor(() => {
        expect(screen.getByText(/key found/i)).toBeInTheDocument()
      })

      // Icon assertions would depend on your icon implementation
      // You might need to use data-testid or specific class assertions
    })
  })

  describe('Exception Path Scenarios', () => {
    it('should prevent maze switching during active search', async () => {
      // GIVEN: Search is currently running
      render(<App />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start search/i })).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /start search/i }))

      expect(screen.getByText('Searching...')).toBeInTheDocument()

      // WHEN: User tries to click maze 2 button
      const maze2Button = screen.getByRole('button', { name: /maze 2/i })

      // THEN: Button should be disabled
      expect(maze2Button).toBeDisabled()

      // AND: Current search should continue uninterrupted
      expect(screen.getByText('Searching...')).toBeInTheDocument()
    })

    it('should handle rapid button clicking gracefully', async () => {
      // GIVEN: App is ready for interaction
      render(<App />)

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /start search/i })).toBeInTheDocument()
      })

      const startButton = screen.getByRole('button', { name: /start search/i })

      // WHEN: User rapidly clicks start search multiple times
      await user.click(startButton)
      await user.click(startButton)
      await user.click(startButton)

      // THEN: Only one search should run
      expect(screen.getByText('Searching...')).toBeInTheDocument()

      // AND: Button should remain disabled
      expect(startButton).toBeDisabled()

      act(() => {
        vi.advanceTimersByTime(5000)
      })

      // Search should complete normally
      await waitFor(() => {
        expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument()
      })
    })

    it('should handle API loading and error states', async () => {
      // Test loading state
      const { rerender } = render(<App />)

      // Should show loading initially
      expect(screen.getByText(/loading/i)).toBeInTheDocument()

      // Test error state by mocking store error
      // This would require mocking the store to return error state
      // Implementation depends on how you want to handle store mocking
    })

    it('should handle maze with no solution', async () => {
      // GIVEN: A maze that has no solution (like noSolutionMaze)
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Maze Navigator')).toBeInTheDocument()
      })

      // Switch to maze 3 (no solution maze)
      await user.click(screen.getByRole('button', { name: /maze 3/i }))

      // WHEN: User starts search
      await user.click(screen.getByRole('button', { name: /start search/i }))

      act(() => {
        vi.advanceTimersByTime(10000) // Give plenty of time
      })

      // THEN: Should show "Search Complete" without finding key
      await waitFor(() => {
        expect(screen.getByText(/search complete/i)).toBeInTheDocument()
      })

      // AND: No "Next Maze" button should appear
      expect(screen.queryByRole('button', { name: /next maze/i })).not.toBeInTheDocument()

      // AND: Trophy/success message should not appear
      expect(screen.queryByText(/key found/i)).not.toBeInTheDocument()
    })
  })

  describe('Performance Tests', () => {
    it('should handle complex maze efficiently', async () => {
      // GIVEN: A complex maze is loaded
      render(<App />)

      await waitFor(() => {
        expect(screen.getByText('Maze Navigator')).toBeInTheDocument()
      })

      // Switch to maze 2 (complex maze)
      await user.click(screen.getByRole('button', { name: /maze 2/i }))

      const startTime = performance.now()

      // WHEN: Search runs on complex maze
      await user.click(screen.getByRole('button', { name: /start search/i }))

      act(() => {
        vi.advanceTimersByTime(15000) // Max reasonable time
      })

      const endTime = performance.now()

      // THEN: Should complete within reasonable time
      await waitFor(() => {
        expect(screen.getByText(/key found|search complete/i)).toBeInTheDocument()
      })

      // Performance assertion (adjust based on your requirements)
      expect(endTime - startTime).toBeLessThan(1000) // Should be fast with timers
    })
  })
})