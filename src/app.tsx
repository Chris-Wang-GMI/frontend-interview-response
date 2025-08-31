import { useEffect } from 'react'
import { CheckCircle, ArrowRight, Trophy, Play, RotateCcw } from 'lucide-react'
import { useMazeStore, useMazeSelectors } from './store/useMazeStore'
import { useMazeSearch } from './hooks/useMazeSearch'
import { MazeComponent } from './components/maze-component'

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

  const getButtonStyle = () => {
    if (isSearching) return 'px-8 py-3 bg-yellow-500 text-white rounded-lg text-lg font-semibold cursor-not-allowed'
    if (isCompleted && foundKey) return 'px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-semibold hover:bg-green-700 transition-colors'
    if (isCompleted) return 'px-8 py-3 bg-red-500 text-white rounded-lg text-lg font-semibold hover:bg-red-600 transition-colors'
    return 'px-8 py-3 bg-blue-500 text-white rounded-lg text-lg font-semibold hover:bg-blue-600 transition-colors'
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
            <button
              key={index}
              onClick={() => setCurrentMazeIndex(index)}
              disabled={isSearching}
              className={`px-4 py-2 rounded transition-colors ${
                currentMazeIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isSearching ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Maze {index + 1}
              {isMazeCompleted(index) && <CheckCircle size={16} className="ml-1 text-green-500" />}
            </button>
          ))}
        </div>

        {/* Main Action Buttons */}
        <div className="flex gap-4">
          {/* Start/Reset Button */}
          <button 
            onClick={handleButtonClick}
            disabled={isSearching}
            className={getButtonStyle()}
          >
            {getButtonText()}
          </button>

          {/* Next Maze Button - Only show when current maze is completed and has next maze */}
          {foundKey && hasNextMaze && (
            <button 
              onClick={() => {
                goToNextMaze()
              }}
              className="px-8 py-3 bg-purple-500 text-white rounded-lg text-lg font-semibold hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              Next Maze 
              <ArrowRight size={16} />
            </button>
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
