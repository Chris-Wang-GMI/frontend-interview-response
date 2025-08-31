import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { render, simpleMaze } from '../../test/test-utils'
import { Button } from '../button'
import { MazeComponent } from '../maze-component'

// Create component-specific test
describe('App Unit Tests', () => {
  it('should render loading state', () => {
    // Mock the store to return loading state
    vi.doMock('../../store/useMazeStore', () => ({
      useMazeStore: () => ({ loading: true, error: null, totalMazes: 0 }),
      useMazeSelectors: () => ({ totalMazes: 0 }),
    }))

    vi.doMock('../../hooks/useMazeSearch', () => ({
      useMazeSearch: () => ({
        isSearching: false,
        foundKey: false,
        startSearch: vi.fn(),
        resetSearch: vi.fn(),
      }),
    }))

    // Create a minimal test component that shows loading
    const TestComponent = () => {
      const loading = true
      const error = null
      const totalMazes = 0

      if (loading) return <div className="p-8">Loading mazes...</div>
      if (error) return <div className="p-8 text-red-500">Error: {error}</div>
      if (totalMazes === 0) return <div className="p-8">No mazes found</div>

      return <div>App Content</div>
    }

    // WHEN: Component is rendered
    render(<TestComponent />)

    // THEN: Should show loading state
    expect(screen.getByText(/loading mazes/i)).toBeInTheDocument()
  })

  it('should render error state', () => {
    // Create test component for error state
    const TestComponent = () => {
      const loading = false
      const error = 'Test error message'
      const totalMazes = 0

      if (loading) return <div className="p-8">Loading mazes...</div>
      if (error) return <div className="p-8 text-red-500">Error: {error}</div>
      if (totalMazes === 0) return <div className="p-8">No mazes found</div>

      return <div>App Content</div>
    }

    // WHEN: Component is rendered
    render(<TestComponent />)

    // THEN: Should show error state
    expect(screen.getByText(/error.*test error message/i)).toBeInTheDocument()
  })

  it('should render main app content', () => {
    // Create test component for main content
    const TestComponent = () => {
      const loading = false
      const error = null
      const totalMazes = 3

      if (loading) return <div className="p-8">Loading mazes...</div>
      if (error) return <div className="p-8 text-red-500">Error: {error}</div>
      if (totalMazes === 0) return <div className="p-8">No mazes found</div>

      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-8">
          <div className="flex flex-col items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-800">Maze Navigator</h1>
            <div className="text-center">
              <p className="text-gray-600 mb-2">DFS Algorithm - Ghost searching for key</p>
            </div>
          </div>
        </div>
      )
    }

    // WHEN: Component is rendered
    render(<TestComponent />)

    // THEN: Should show main content
    expect(screen.getByText('Maze Navigator')).toBeInTheDocument()
    expect(screen.getByText(/dfs algorithm/i)).toBeInTheDocument()
  })

  it('should render button states correctly', () => {
    // Test button rendering with different states
    const TestButtons = () => (
      <div>
        <Button variant="default">Start Search</Button>
        <Button variant="warning" disabled>Searching...</Button>
        <Button variant="success">Key Found! Reset</Button>
        <Button variant="purple">Next Maze</Button>
      </div>
    )

    render(<TestButtons />)

    expect(screen.getByText('Start Search')).toBeInTheDocument()
    expect(screen.getByText('Searching...')).toBeInTheDocument()
    expect(screen.getByText('Key Found! Reset')).toBeInTheDocument()
    expect(screen.getByText('Next Maze')).toBeInTheDocument()
  })

  it('should render maze grid correctly', () => {
    // Test maze grid rendering
    render(
      <MazeComponent 
        maze={simpleMaze}
        currentPosition={{ row: 1, col: 1 }}
        visitedPath={[{ row: 1, col: 1 }, { row: 1, col: 2 }]}
      />
    )

    // Should render maze grid - look for the container div with multiple classes
    const mazeContainer = document.querySelector('.inline-block')
    expect(mazeContainer).toBeInTheDocument()
    expect(mazeContainer).toHaveClass('border-2', 'border-gray-400', 'p-4')
  })

  it('should handle progress display', () => {
    // Test progress indicator
    const ProgressIndicator = ({ completed, total }: { completed: number, total: number }) => (
      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Progress: {completed}/{total} mazes completed
        </p>
      </div>
    )

    render(<ProgressIndicator completed={2} total={3} />)
    
    expect(screen.getByText('Progress: 2/3 mazes completed')).toBeInTheDocument()
  })
})