# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a maze navigation application where a ghost uses Depth-First Search (DFS) algorithm to find keys in different mazes. It's built as a React + TypeScript + Vite application with a Hono backend server.

## Development Commands

```bash
# Install dependencies
npm install

# Start development (runs both client and server concurrently)
npm run dev

# Client only (Vite dev server on localhost:5173)
npm run dev:client

# Server only (Hono server on localhost:8080)
npm run dev:server
```

## Architecture

### Backend (Server)
- **Server**: Hono API server (`server/main.ts`) serving maze data on port 8080
- **API Endpoint**: `GET /api/maze` returns array of 3 pre-defined mazes
- **Maze Data**: Static maze configurations in `server/models/index.ts`
- **Types**: Maze interface defined in `types/index.ts` as `Maze = MazeCell[][]` where `MazeCell = 'start' | 'wall' | 'path' | 'end'`

### Frontend Architecture
- **Entry Point**: `src/app.tsx` - Main application component
- **File Structure**:
  - `src/hooks/` - Custom React hooks (useMazeData, useMazeSearch)  
  - `src/components/` - React components (maze-component.tsx)
- **State Management**: Currently uses React hooks, designed to be converted to Zustand
- **Styling**: Tailwind CSS with specific color requirements:
  - Walls: `sky-800`
  - Paths: `sky-100` 
  - Visited paths: `sky-300`
  - Ghost/Key: `red-400`
- **Icons**: Lucide React (`<Ghost/>`, `<Key/>`)

### Core Features
1. **Maze Rendering**: Grid-based visualization with color-coded cells
2. **DFS Algorithm**: Step-by-step ghost navigation with 300ms animation intervals
3. **Interactive Controls**: Start/reset buttons, maze selection
4. **Real-time Visualization**: Shows current ghost position and visited path

### Key Implementation Details
- **DFS Search**: Uses stack-based implementation in `useMazeSearch` hook
- **Animation**: Recursive setTimeout calls for step-by-step visualization
- **State Management**: Search state includes currentPosition, visitedPath, isSearching, isCompleted, foundKey
- **Maze Selection**: User can switch between 3 different maze complexities

### Current Development Focus
The codebase is structured for adding Zustand state management and implementing maze progression features (next maze button when current maze is completed).