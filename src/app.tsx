import { useEffect } from 'react'
import { CheckCircle, ArrowRight, Trophy, Play, RotateCcw } from 'lucide-react'
import { useMazeStore, useMazeSelectors } from './store/useMazeStore'
import { useMazeSearch } from './hooks/useMazeSearch'
import { MazeComponent } from './components/maze-component'
import { Button } from './components/button'

export default function App() {
  const { 
    loading, 
    error, 
    currentMazeIndex, 
    setCurrentMazeIndex, 
    goToNextMaze,
    fetchMazes 
  } = useMazeStore()
  
  const { 
    currentMaze, 
    hasNextMaze,
    totalMazes,
    completedCount,
    isMazeCompleted 
  } = useMazeSelectors()
  
  const { 
    currentPosition, 
    visitedPath, 
    isSearching, 
    isCompleted,
    foundKey,
    startSearch, 
    resetSearch 
  } = useMazeSearch(currentMaze || [])

  // Fetch mazes on mount
  useEffect(() => {
    fetchMazes()
  }, [fetchMazes])

  // Reset search when maze changes
  useEffect(() => {
    resetSearch()
  }, [currentMazeIndex, resetSearch])

  if (loading) return <div className="p-8">Loading mazes...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (totalMazes === 0) return <div className="p-8">No mazes found</div>

  const handleButtonClick = () => {
    if (isSearching) return // Prevent clicking during search
    if (isCompleted) {
      resetSearch()
    } else {
      startSearch()
    }
  }

  const getButtonText = () => {
    if (isSearching) return 'Searching...'
    if (isCompleted) {
      return (
        <span className="flex items-center gap-2">
          <RotateCcw size={16} />
          {foundKey ? 'Key Found! Reset' : 'Search Complete! Reset'}
        </span>
      )
    }
    return (
      <span className="flex items-center gap-2">
        <Play size={16} />
        Start Search
      </span>
    )
  }

  const getButtonVariant = () => {
    if (isSearching) return 'warning'
    if (isCompleted && foundKey) return 'success'
    if (isCompleted) return 'destructive'
    return 'default'
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-8 p-8">
      {/* Maze Display */}
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">Maze Navigator</h1>
        <div className="text-center">
          <p className="text-gray-600 mb-2">DFS Algorithm - Ghost searching for key</p>
          {isSearching && <p className="text-blue-600 font-medium">Searching in progress...</p>}
          {foundKey && (
            <p className="text-green-600 font-medium flex items-center gap-2 justify-center">
              <Trophy size={16} />
              Key found!
            </p>
          )}
        </div>
        <MazeComponent 
          maze={currentMaze} 
          currentPosition={currentPosition}
          visitedPath={visitedPath}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        {/* Progress Info */}
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600">
            Progress: {completedCount}/{totalMazes} mazes completed
          </p>
        </div>

        {/* Maze Selector */}
        <div className="flex gap-2">
          {Array.from({ length: totalMazes }, (_, index) => (
            <Button
              key={index}
              onClick={() => setCurrentMazeIndex(index)}
              disabled={isSearching}
              variant={currentMazeIndex === index ? 'default' : 'secondary'}
              className="flex items-center gap-2"
            >
              Maze {index + 1}
              {isMazeCompleted(index) && <CheckCircle size={16} className="text-green-500" />}
            </Button>
          ))}
        </div>

        {/* Main Action Buttons */}
        <div className="flex gap-4">
          {/* Start/Reset Button */}
          <Button 
            onClick={handleButtonClick}
            disabled={isSearching}
            variant={getButtonVariant()}
            size="lg"
          >
            {getButtonText()}
          </Button>

          {/* Next Maze Button - Only show when current maze is completed and has next maze */}
          {foundKey && hasNextMaze && (
            <Button 
              onClick={() => {
                goToNextMaze()
              }}
              variant="purple"
              size="lg"
              className="flex items-center gap-2"
            >
              Next Maze 
              <ArrowRight size={16} />
            </Button>
          )}

          {/* All Completed Message */}
          {foundKey && !hasNextMaze && (
            <div className="px-8 py-3 bg-green-100 text-green-800 rounded-lg text-lg font-semibold flex items-center gap-2">
              <Trophy size={20} className="text-green-600" />
              All mazes completed!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
