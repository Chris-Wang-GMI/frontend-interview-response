
# Frontend Engineer Interview Assessment

Please fork this repository to your own GitHub and complete the assignment within `7 days`. After completing it, please provide us with the GitHub link.

> Please send us the link before the deadline.
> e.g. if you start on 06/01, please send us the link before 06/08 00:00:00.



## Task

Your goal for this task is to create a page where a ghost navigates through a maze to locate a key.

You need to retrieve the maze data by calling the `http://localhost:8080/api/maze` endpoint and display multiple maze maps on the page. Each map should have a button that toggles between starting and resetting the ghost's travel through the maze. When the user clicks the button, the ghost will either start traversing the maze using [Depth-First Search (DFS)](https://zh.wikipedia.org/zh-tw/%E6%B7%B1%E5%BA%A6%E4%BC%98%E5%85%88%E6%90%9C%E7%B4%A2), or the traversal will reset, allowing the user to restart from the beginning.

You can see the demo video at [here](https://drive.google.com/file/d/1DbIrPrw3dqPeQRbtQ5cDeziuAal4sMwJ/view?usp=sharing).

**Requirements:**
1. For styling, use [tailwindcss](https://tailwindcss.com/).
   - The color of the walls is `sky-800`.
   - The color of the paths is `sky-100`.
   - The color to **highlight** the current path is `sky-300`.
   - The color of the ghost is `red-400`.
   - The color of the key is `red-400`.
2. For icons, use [lucide-react](https://lucide.dev/).
   - The icon for the ghost is `<Ghost/>`.
   - The icon for the key is `<Key/>`.

**Bonus:**
1. Write unit tests.

**Note:**
1. get the maze data by calling the `http://localhost:8080/api/maze` endpoint.
2. Maze's interface is defined in `types/index.ts`.
3. Don't modify the `server` folder.
4. You may use any additional packages you need.

## How to run
```bash
# install dependencies
npm install

# run the app
npm run dev
```
