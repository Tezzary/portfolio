# GOLFZ.IO

[GOLFZ.IO](https://golfz.io) is an online multiplayer browser game where players compete in short rounds in a mini-golf style format to try and beat their opponents!

Feel free to keep reading to hear the technical details of the project and give the game a go at: https://golfz.io

![GOLFZ.IO image](/resources/golfzio.png "Optional title")

## What Was Involved

1. Map Generation (A* Pathfinding)
2. Project Structure
3. Game Loop
4. Networking 
5. Networking 2.0
6. Accounts + Database

### 1. Map Generation (A* Pathfinding)

This project as with all projects started with a completely different idea in mind. Initially this project was going to be a regular maze solver that would generate a random maze, then would allow the user to visualise different maze solving algorithms such as Dijkstra's and A* algorithm.

![IMAGE](/resources/golfzio/earlymazegen.png)

The algorithm would start with some predefined X * Y grid, have some 'chanceOfFill' in the case of above 0.5 and would randomly fill in walls at the rate defined. It would then pick a random start and end coordinate in the graph and would run the algorithm.

Now there is a chance that a maze generated wasn't solvable so in this case the algorithm was placed in a loop that would rerun until it found a solvable maze.

This led to images such as the one above being created generating some very nice solutions to these terrains that often had a snaky pattern.

This idea of 'rerunning until solvable' could also be used for other aspects of creating interesting solutions such as, rerun the algorithm if solution isn't atleast 20 tiles in length or more than 40 tiles in length.  

```js
//re-run no solution
if (path === -1) {
    continue
}
//re-run if solution too short
if(path.length < 20) {
    continue
}
//re-run if solution too long
if(path.length > 40) {
    continue
}
```

Using this setup the maze solver was creating very unique patterns, very reliably and very randomly.