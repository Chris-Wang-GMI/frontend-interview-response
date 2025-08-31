# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a maze navigation application where a ghost uses Depth-First Search (DFS) algorithm to find keys in different mazes. It's built as a React + TypeScript + Vite application with a Hono backend server.

## Development Commands

```bash
# Install dependencies  
pnpm install

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
  - `src/hooks/` - Custom React hooks (useMazeSearch)
  - `src/components/` - React components (maze-component.tsx)
  - `src/store/` - Zustand state management (useMazeStore.ts)
- **State Management**: Zustand store managing maze data, completion tracking, and progression
- **Styling**: Tailwind CSS with specific color requirements:
  - Walls: `sky-800`
  - Paths: `sky-100` 
  - Visited paths: `sky-300`
  - Ghost/Key: `red-400`
- **Icons**: Lucide React (`<Ghost/>`, `<Key/>`)

### Core Features
1. **Maze Rendering**: Grid-based visualization with color-coded cells and Lucide React icons
2. **DFS Algorithm**: Step-by-step ghost navigation with 300ms animation intervals
3. **Interactive Controls**: Start/reset buttons, maze selection, next maze progression
4. **Real-time Visualization**: Shows current ghost position and visited path
5. **Progress Tracking**: Tracks completed mazes, shows completion status with icons
6. **Maze Progression**: Automatic "Next Maze" button when key is found

### Key Implementation Details
- **DFS Search**: Uses stack-based implementation in `useMazeSearch` hook
- **Animation**: Recursive setTimeout calls for step-by-step visualization
- **Zustand Store**: Manages maze data, completion tracking, current maze selection, and progression logic
- **State Integration**: useMazeSearch hook integrates with store to mark mazes as completed
- **UI Icons**: Lucide React icons for visual feedback (CheckCircle, Play, RotateCcw, ArrowRight, Trophy)

### Dependencies
- **React + TypeScript**: Core framework
- **Vite**: Build tool and dev server  
- **Zustand**: Global state management
- **Tailwind CSS**: Styling system
- **Lucide React**: Icon library
- **Hono**: Backend API framework