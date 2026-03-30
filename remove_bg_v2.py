from PIL import Image
import sys

def remove_background_flood(input_path, output_path, tolerance=30):
    img = Image.open(input_path).convert("RGBA")
    width, height = img.size
    data = img.load()
    
    # Get background color from top-left corner
    bg_color = data[0, 0]
    
    # Visited set for BFS
    visited = set()
    queue = [(0, 0), (width-1, 0), (0, height-1), (width-1, height-1)]
    
    for x, y in queue:
        visited.add((x, y))
        
    def color_distance(c1, c2):
        return sum(abs(v1 - v2) for v1, v2 in zip(c1[:3], c2[:3]))

    while queue:
        x, y = queue.pop(0)
        
        current_color = data[x, y]
        
        # If the pixel is similar to the background color, make it transparent
        if color_distance(current_color, bg_color) < tolerance:
            data[x, y] = (0, 0, 0, 0) # Make transparent
            
            # Check neighbors
            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = x + dx, y + dy
                if 0 <= nx < width and 0 <= ny < height and (nx, ny) not in visited:
                    neighbor_color = data[nx, ny]
                    # Only add to queue if neighbor is also background-like
                    if color_distance(neighbor_color, bg_color) < tolerance:
                        visited.add((nx, ny))
                        queue.append((nx, ny))
                    # If neighbor is NOT background-like (edge of the ghost), we stop there.
        else:
             # Even if we popped it, if it's not similar enough to BG, we don't clear it.
             # But since we only add similar neighbors, this else might not be reached often 
             # unless the corner itself wasn't background (unlikely).
             pass

    # Pass 2: Clean up artifacts (optional, simple despeckle if needed)
    
    img.save(output_path)
    print(f"Processed {input_path} -> {output_path}")

if __name__ == "__main__":
    remove_background_flood("public/phantom-logo-3d.png", "public/phantom-logo-3d.png", tolerance=50)
