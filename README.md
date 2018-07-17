
# Island of the Ancients!
- Main idea: strategy 1v1 game in which players compete for resources on an island map. Objective: to reach X resources first (so there is some tension between spending to grow and riding your economy to victory). Tentatively: each player has a power source (nexus), and they channel energy from it through rods (guarded by sentries/pawns/tokens) in order to harvest resources from surrounding fields. Players can disrupt each other's supply lines, capture unguarded sentries, overharvest regions, and who knows what other wacky things...

## Needed Architecture:
- Matchmaking system: MVP is you see list of other users online, can invite one to play a game, which if accepted starts a game for those two players.
- Game state: What are the elements here? List of vertices occupied, list of edges occupied, list of harvested resources, each player's list of available resources, their armory (or whatever --?).
- UI for players being able to do stuff: MVP seems like side bar of actions you can select among, which change the power of your cursor, and then you can place tokens or rods or whatever (would be cool to make an image follow the cursor).
- Mechanics mechanics mechanics -- the idea is so nebulous right now, it could go in a lot of different directions. The goal is to find a simple set of rules that gives rise to a rich ecosystem of strategy and gameplay. The main thing is that we all have a say in and should feel invested in the game's mechanics.
- Core decisions: How can players interact with the board? What units can they build? What prerequisites are there for building those units? Is there a cooldown time between building and placing on board? How many resources does each cost? Is there a limit on how many actions (of a specific kind, or at all) can be taken per turn? I never realized how many decisions go into making a game.

- Can cells be depleted?
- Each cell has a resource-richness index.
- Limit on how many actions to take per turn?

- Most of the vertex/edge functionality comes in pairs, but could probably be comfortably collapsed into single functions.

- Plenty of UI issues: it lets me place the same rod twice, lets me place over stuff that exists, etc edgeDistances

- NOTE: we shouldn't need any of the "tally up" logic on the client. Just send array of cells....with that data? Hmm, maybe not. It's weird because it  needs to be on the server, to calculate the economy stuff.

- Don't add any economy logic on the client side, even just for updating DOM. just ping server and wait for computed result.

- NOTE: server-side re-implementation of `_.difference` won't be relevant anymore. We're just going to submit the current move, which is stagedVertices + stagedEdges, to the server. That makes more sense.

## More Concrete Goals:
- Write the algorithm to determine whether a rod is connected to a power source (i.e. if there exists a continuous path of rods back to a source.)
- Find a player's resource income for a turn given a board state.
- Figure out a good way to let player place pieces on the board.
- I'm having trouble with testing: It will work if we get rid of `export` syntax from our modules and use `module.exports`, but then the client-side won't work...

## Rules:
- Game start: each play has randomly chosen power source.
- To start, power supply generates resources from adjacent fields/cells.
- Two resource types: iron and stone.
- Player gets one free token each turn; additional tokens cost 1 iron.
- Rods cost 1 iron, 1 stone.
- Resources are added to player's bank account at start of their turn.
- Player can place as many tokens as they can afford.
- Play can only place a piece on an unoccupied vertex or edge.
- A field/cell produces resources in proportion to the number of adjacent rods.
- The harvest from a field/cell goes to the player with majority of tokens in adjacent vertices.

- For UI clicking: do a two-part check to determine whether user is trying to place a token or a rod. Display a transparent token or rod on that spot.
