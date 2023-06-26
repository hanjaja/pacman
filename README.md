# Pacman Game

This is a simple implementation of the classic Pacman game using JavaScript and WebGL. The game allows the player to control Pacman and navigate through a maze while avoiding ghosts and collecting special items.

# Balancing

## Ghost Movement and Gameplay Balancing

The `updateGhostPosition` function has been modified to improve the ghost movement and achieve a balanced gameplay experience. The following changes and additional features have been implemented:

1. **Ghost Movement**: The function ensures that the ghosts continue moving even when they don't need to change direction, preventing them from getting stuck in one place.

2. **Chasing Pac-Man**: The ghosts now have a chance to chase Pac-Man instead of randomly selecting a direction, adding dynamic and challenging gameplay. The chase chance is controlled by the `ghostChaseChance` variable (currently set to 2%).

3. **Proximity-based Direction Selection**: When a ghost is chasing Pac-Man, it evaluates valid directions that bring it closer to Pac-Man. The ghost selects the direction that minimizes the distance to Pac-Man, enhancing its ability to track Pac-Man effectively.

4. **Cooldown Period**: When a ghost chooses a random direction, it enters a cooldown period during which it cannot change direction again. This adds a strategic element to the ghost's movement and makes it less predictable for the player. The cooldown period is set to 120 frames (approximately 2 seconds).

5. **Opposite Direction Avoidance**: When a ghost chooses a random direction, it avoids moving in the opposite direction of its current direction. This ensures that the ghost doesn't immediately reverse its course and adds more natural movement patterns.

6. **Balancing and Playtesting**: The modifications aim to balance the gameplay by making the ghosts challenging but not overly difficult to evade. Parameters such as the ghost's chase chance, cooldown period, and ghost speed can be fine-tuned and adjusted through playtesting to achieve the desired balance.
