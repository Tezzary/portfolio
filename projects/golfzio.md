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
![IMAGE](/resources/golfzio/network1.png)

This is the easiest and safest solution. The server at all times holds authority over the game simulation. It only listens to requests to hit the ball, meaning it can apply checks such as is the players ball stopped before hitting or is this a valid hit at this moment. This means the server can at any time reject a request from the client to perform an action in the game if it doesn't approve the action. 

This largely stops a lot of possible cheating in the game having the server hold full authority over game states, and stops what many other games experience such as cheaters teleporting their player or being able to fly.

This solution worked but had one big flaw.

Network usage!

As Steven Howse the creator of the viral multiplayer browser game [Slither.io](https://slither.io) said about his game ["It’s incredibly expensive because of the amount of bandwidth [the] game uses"](https://news.ycombinator.com/item?id=11929961).

With the server sending out 30 updates per second to each player, and each update containing the location of all players in the game, if we let number of players = n, this would mean that each tick the server would have to send out <i>n x (n x (4 + 4) + 4 + 54)</i> bytes of data. This being each player gets sent 8 bytes of data per player (a 32 bit float per x and y coordinate) and also the mandatory 4 bytes from the websocket protocol and 54 bytes from TCP.

More simply this is <i>8n<sup>2</sup> + 58n</i> bytes of data sent out per tick.

This becomes important when you need to start thinking about deploying the server in a production environment that uses cloud computing.

Take AWS where GOLFZ.IO used to be hosted on a Melbourne EC2 instance (Since moved to DigitalOcean). They charge $0.114 per GB of data out from the Asia Pacific (Melbourne) region.

This can then be used to calculate a monthly cost per player count per server:

<!-- f(n)=(8n^2 + 58n) GB PER MONTH COLUMN-->
<!-- f(n)=((8n^2 + 58n)*30*60*60*24*30.4167/1000/1000/1000) GB PER MONTH COLUMN-->
<!-- f(n)=((8n^2 + 58n)*30*60*60*24*30.4167/1000/1000/1000*0.114 COST PER MONTH COLUMN) -->

| Avg Player Count | Bytes Per Tick | GB Per Month | Cost Per Month EC2 ($) |
|------------------|----------------|--------------|------------------------|
| 1                | 66             | 5.2034       | $0.59                  |
| 5                | 490            | 38.6316      | $4.40                  |
| 10               | 1380           | 108.7993     | $12.40                 |
| 20               | 4360           | 343.7428     | $39.19                 |
| 50               | 22900          | 1805.4380    | $205.82                |
| 100              | 85800          | 6764.4794    | $771.15                |

As we can see it starts off very cheap for lower player counts but due to the quadratic nature of the relationship between player count and network data output, this can become very very expenive very very quickly.

This was the first route of networking I chose for GOLFZ.IO

### 5. Networking 2.0

I then wanted to think of new ways to improve the networking for the project. I then decided to go with an approach known as Deterministic Lockstep. This approach allows the server to keep authority over the gamestate while all users browsers do their own physics calculations on the client side to stay synced with the server.

This new architecture follows this different structure:

![IMAGE](/resources/golfzio/network2.png) 

The most important difference is that instead of every tick the server sending player locations to every user, the server instead becomes more of an event based relay system that also keeps track of the game state so it can verify all player inputs before passing them on.

This approach also has other benefits of making it super easy to implement interpolation of player positions between ticks, meaning if you play on a high refresh rate monitor e.g. 144hz or 240hz the game can take advantage of that by interpolating between ticks every frame rather than being hard stuck at the same framerate as the servers tickrate which makes the game way smoother.

But is this better?

This solution has the downside that the game becomes a lot more intensive to run for clients as they now instead of just having solely a rendering job, also have to run the full server physics simulation themselves. This is not a huge issue in this scenario as this is not a hugely hardware intensive game to run. If we were talking about a more complicated triple A game it would probably be a different story and this would be a huge drawback.

But for the networking comparison lets redo the math:

let n = number of players  
let m = maximum strokes (9)

Every player on round start will be sent the full match data similarly to the original networking route meaning on the first tick every player is sent:

= <i>n x (4 + 4) + 54 + 4</i>  
= <i>8n + 54</i> bytes  

then every time a player hits a ball (maximum of m times per round) the angle and power(both 32 bit floats) must be sent to all players which also accounting for TCP/Websocket overhead gives:

= <i>n x m x (4 + 4 + 54 + 4)</i>  
= <i>n x 9 x 66</i>  
= <i>594n</i> bytes relayed to each player each round  

Adding these equations together and accounting for all players this gives:

= <i>n x (8n + 54 + 594n)</i>  
= <i>n x (604n + 54)</i>  
= <i>604n<sup>2</sup> + 54n</i> bytes sent by the server each round  

Now this equation looks a lot worse than the old networking route but this equation calculates how much bandwidth is used in an entire roughly 1 minute round of the game rather than per tick which there will be roughly 1800 of per match.

Lets redo the monthly cost calculations in terms of games with this new route instead of ticks:


<!-- f(n)=(604n^2 + 54n) BYTES PER GAME COLUMN-->
<!-- f(n)=((604n^2 + 54n)*60*24*30.4167)/1000/1000/1000 GB PER MONTH COLUMN -->
<!-- f(n)=((604n^2 + 54n)*60*24*30.4167)/1000/1000/1000*0.114 COST PER MONTH COLUMN -->
| Avg Player Count | Bytes Per Game | GB Per Month | Cost Per Month EC2 ($) |
|------------------|----------------|--------------|------------------------|
| 1                | 658            | 0.028809     | $0.003283              |
| 5                | 15370          | 0.672889     | $0.076725              |
| 10               | 60940          | 2.668588     | $0.304211              |
| 20               | 242680         | 10.626937    | $1.211469              |
| 50               | 1512700        | 66.283805    | $7.554159              |
| 100              | 604540         | 264.818227   | $30.174678             |

As we can see this route is substantially cheaper than the original networking solution using 20-30 times less bandwidth at a given player count. It is also worth noting that this is a worst case scenario where every player uses all 9 strokes on a hole where in most cases it will actually be substantially less than this.

### 6. Accounts + Database

This is where the accounts server comes into action, the accounts server is just a NodeJS Express API that handles all authentication/authorisation and purchases.

The accounts server also connects to a MySQL database that stores all of this data.

Once a player is authenticated a JWT token is passed to the client for future authorisation and also stores information such as ball colour presets which are handed to the websocket server on connection so that it can pass that information to other users for them to render players.

On the main menu there is a simple create account/log in menu to authenticate.

The websocket game server also uses the account API itself to increase the levels and gold of players as they play their matches.

The account server API also allows the frontend to call the API and render the leaderboard on the main menu.