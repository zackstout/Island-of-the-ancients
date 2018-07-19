
# Island of the Ancients!
Main idea: strategy 1v1 game in which players compete for resources on an island map. Objective: to reach X resources first (so there is some tension between spending to grow and riding your economy to victory). Tentatively: each player has a power source (nexus), and they channel energy from it through rods (guarded by sentries/pawns/tokens) in order to harvest resources from surrounding fields. Players can disrupt each other's supply lines, capture unguarded sentries, overharvest regions, and who knows what other wacky things...

## Built With:
- jQuery
- Express
- Socket.io
- Mocha

## Animation:
![](https://media.giphy.com/media/3JUkOKOYNuczp7DsKk/giphy.gif)

## Needed Architecture:
- Game state: What are the elements here? List of vertices occupied, list of edges occupied, list of harvested resources, each player's list of available resources, their armory (or whatever --?).
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

- Could have a Projected Harvest field in the DOM table.

- Add ammo functionality: a button to build it, once you've upgraded to a Citadel. When you click your own sentry, it turns yellow, and then clicking again makes it a citadel.
- Similarly for ammo: when you click an enemy sentry, it turns yellow (IF you have an adjacent sentry to shoot at it), and then clicking confirms the shot, decrementing your ammo supply and removing that enemy sentry.

- We could even run some machine learning to suss out the ideal strategy given a set of rules!

- NOTE: edges function should return 2 or 3 if in corner or edge, respectively !!!

- md syntax: does just adding new lines between line elements alter the styling of the whole list?

- user should be able to see enemy's bank and armory

- for now just exporting all functions, for testing, but architecture would have more clarity if we only exported functions that were used elsewhere. We really need to rethink architecture of functions modules, now that we have so many functions. Who needs what?



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
