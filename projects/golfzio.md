# GOLFZ.IO

[GOLFZ.IO](https://golfz.io) is an online multiplayer browser game where players compete in short rounds in a mini-golf style format to try and beat their opponents!

Feel free to keep reading to hear how I made the project and give the game a go at: https://golfz.io

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

This was the point where I decided to pivot the project into a mini-golf game. The idea of generating random terrains and then finding a path through them could be used to create interesting mini-golf holes.

By changing the rendering route to use HTML canvas rather than DOM elements, setting a blue background and then only rendering the "maze solution" in green with some brown borders to represent the walls, and adding a coloured ball, I had the basis of a mini-golf hole.

![IMAGE](/resources/golfzio/golfzioearlymapview.png)

### 2. Project Structure

Now that the basis of the idea and the game was created, I needed to start thinking about how to structure the project.

I wanted the game to allow players to jump straight into a game, so I needed a main menu that would allow people to just press play and jump into a game. Although I also wanted an account system for players to keep track of their progress in the game, buy customizables and also compete on a leaderboard and also create custom matches to play with just their friends rather than matches with random players.

This lead to me dividing the project up into 4 main parts

1. Frontend (React)
    * Renders main menu
    * Renders HTML canvas
    * Completes API Requests
    * Listens to websocket data and sends data back

2. Backend Websocket Game Server (NodeJS with Socket.IO)
    * Listens for new game connections
    * Runs simulation of game
    * Listens for websocket messages from users
    * Sends game states to users
    * Sends data to account management server

3. Database (MySQL)
    * Stores player information
    * Stores shop items
    * Tracks player levels and item ownership

4. Backend Account Management (NodeJS + Express)
    * Http server listening for API requests
    * Creating accounts
    * Managing shop purchases
    * Serving endpoints such as leaderboard endpoints which queries database

### 3. Game Loop

The main idea for the game loop of GOLFZ.IO was players would sit in a game 'lobby', individual holes/rounds would last at most 1 minute which a randomly generated hole using the map generation algorithm, a full game would last 9 holes and the winner was the player with the least strokes at the end of the match.

![IMAGE](/resources/golfzio/leaderboard.png)

Initially when a player attempts to join a match they will be assigned a ball object and any holes they missed they will be assigned the max strokes for (9 strokes). Players on top of trying to win are also rewarded with experience points to level their account and gold to buy items in the shop dependant on their performance in each hole.

![IMAGE](/resources/golfzio/shop.png)

The game would work on a tick based system, where the game server runs at a tickrate of 30 ticks per second meaning it would update player positions, do physics calculations such as calculating collisions and send out data to clients at a rate of 30 times per second.

### 4. Networking

The most technical part of the project was the networking and optimizing the networking to reduce server costs.

Initially The networking had the structure:
1. Users connect to server
2. Server simulates game physics every tick
3. Server listens for messages from users, specifically requests to hit ball
4. Server then sends out to all users each tick the location of all player balls

This is the easiest and safest solution. The server at all times holds authority over the game simulation. It only listens to requests to hit the ball, meaning it can apply checks such as is the players ball stopped before hitting or is this a valid hit at this moment. This means the server can at any time reject a request from the client to perform an action in the game if it doesn't approve the action. 

This largely stops a lot of possible cheating in the game having the server hold full authority over game states, and stops what many other games experience such as cheaters teleporting their player or being able to fly.

This solution worked but had one big flaw.

Network usage!

As Steven Howse the creator of the viral multiplayer browser game [Slither.io](https://slither.io) said about his game ["It’s incredibly expensive because of the amount of bandwidth [the] game uses"](https://news.ycombinator.com/item?id=11929961).

With the server sending out 30 updates per second to each player, and each update containing the location of all players in the game, if we let number of players = n, this would mean that each tick the server would have to send out n x (n x (4 + 4)) bytes of data. This being each player gets sent 8 bytes of data per player (a 32 bit float per x and y coordinate).

More simply this is <i>8n<sup>2</sup></i> bytes of data sent out per tick.

This becomes important when you need to start thinking about deploying the server in a production environment that uses cloud computing.

Take AWS where GOLFZ.IO used to be hosted on a Melbourne EC2 instance (Since moved to DigitalOcean). They charge $0.114 per GB of data out from the Asia Pacific (Melbourne) region.

We can then 

| Avg Player Count | Bytes Per Tick | GB Per Day | Cost Per Day EC2 ($) |
|------------------|----------------|------------|----------------------|
| 1                | 8              | 0.0207     | $0.0024              |
| 5                | 200            | 0.5184     | $0.0591              |
| 10               | 800            | 2.0736     | $0.2364              |
| 20               | 3200           | 8.2944     | $0.9456              |
| 50               | 20000          | 51.8400    | $5.9098              |
| 100              | 80000          | 207.3600   | $23.6390             |

As we can see it starts off very cheap for lower player counts but due to the quadratic nature of the relationship between player count and network data output, this can become very very expenive very very quickly.