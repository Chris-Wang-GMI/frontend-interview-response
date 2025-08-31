import { useState, useEffect } from 'react'
import { Maze } from '../../types'

export function useMazeData() {
  const [mazes, setMazes] = useState<Maze[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMazes = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/maze')
        if (!response.ok) throw new Error('Failed to fetch mazes')
        const data = await response.json()
        setMazes(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error')
      } finally {
        setLoading(false)
      }
    }

    fetchMazes()
  }, [])

  return { mazes, loading, error }
}