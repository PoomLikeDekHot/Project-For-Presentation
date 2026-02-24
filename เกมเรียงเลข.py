from collections import deque
import random

def bfs(start_state):
    target = [1, 2, 3, 4, 5, 6, 7, 8, 0]
    dq = deque([start_state])
    visited = {tuple(start_state): None}
    while dq:
        state = dq.popleft()
        if state == target:
            path = []
            while state:
                path.append(state)
                state = visited[tuple(state)]
            return path[::-1]
        zero = state.index(0)
        row, col = divmod(zero, 3)
        for move in (-3, 3, -1, 1):
            new_row, new_col = divmod(zero + move, 3)
            if 0 <= new_row < 3 and 0 <= new_col < 3 and abs(row - new_row) + abs(col - new_col) == 1:
                neighbor = state[:]
                neighbor[zero], neighbor[zero + move] = neighbor[zero + move], neighbor[zero]
                if tuple(neighbor) not in visited:
                    visited[tuple(neighbor)] = state
                    dq.append(neighbor)
def printSolution(path):
    for state in path:
        print(
            "\n".join(
                " ".join(map(str, state[i:i+3]))
                for i in range(0, 9, 3)
            ),
            end="\n---\n"
        )

inp = input("Enter 1-8 and 0 (or press Enter to random): ").split()
start_state = [int(x) for x in inp] if inp else random.sample(range(9), 9)
solution = bfs(start_state)

if solution:
    printSolution(solution)
    print(f"Solved in {len(solution) - 1} moves.")
else:
    print("No solution found.")