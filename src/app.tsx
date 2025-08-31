import { useState, useEffect } from 'react'
import { useMazeData } from './hooks/useMazeData'
import { useMazeSearch } from './hooks/useMazeSearch'
import { MazeComponent } from './components/maze-component'

export default function App() {
  const { mazes, loading, error } = useMazeData()
  const [selectedMazeIndex, setSelectedMazeIndex] = useState(0)
  
  const currentMaze = mazes[selectedMazeIndex]
  const { 
    currentPosition, 
    visitedPath, 
    isSearching, 
    isCompleted,
    foundKey,
    startSearch, 
    resetSearch 
  } = useMazeSearch(currentMaze || [])

  // Reset search when maze changes
  useEffect(() => {
    resetSearch()
  }, [selectedMazeIndex, resetSearch])

  if (loading) return <div className="p-8">Loading mazes...</div>
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>
  if (mazes.length === 0) return <div className="p-8">No mazes found</div>

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
      return foundKey ? 'Key Found! Reset' : 'Search Complete! Reset'
    }
    return 'Start Search'
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
          {foundKey && <p className="text-green-600 font-medium">🎉 Key found!</p>}
        </div>
        <MazeComponent 
          maze={currentMaze} 
          currentPosition={currentPosition}
          visitedPath={visitedPath}
        />
      </div>

      {/* Controls */}
      <div className="flex flex-col items-center gap-4">
        {/* Maze Selector */}
        <div className="flex gap-2">
          {mazes.map((_, index) => (
            <button
              key={index}
              onClick={() => setSelectedMazeIndex(index)}
              disabled={isSearching}
              className={`px-4 py-2 rounded transition-colors ${
                selectedMazeIndex === index
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              } ${isSearching ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              Maze {index + 1}
            </button>
          ))}
        </div>

        {/* Start/Reset Button */}
        <button 
          onClick={handleButtonClick}
          disabled={isSearching}
          className={getButtonStyle()}
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  )
}
