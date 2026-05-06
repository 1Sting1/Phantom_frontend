from PIL import Image
import numpy as np

def remove_background(input_path, output_path):
    img = Image.open(input_path)
    img = img.convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        # Assuming background is dark/purple based on screenshots
        # Let's try to make pixels transparent if they match the background color approximately
        # Or better strategy: Use a threshold?
        
        # Actually, looking at the image, it might be a black background or dark purple.
        # Let's try a simple approach first: if logic.
        
        # However, precise background removal without knowing the exact color is hard.
        # But wait, the user provided a transparent PNG in the prompt? Use that? 
        # "uploaded_image_1765687193841.png" - let's check if this is the transparent one?
        # The user said "remove its background".
        
        # Let's try to treat the dark background as transparent.
        # Safe bet: darker than threshold = transparent.
        if item[0] < 30 and item[1] < 30 and item[2] < 30:  # Very dark
            newData.append((255, 255, 255, 0))
        else:
             newData.append(item)

    img.putdata(newData)
    img.save(output_path, "PNG")

# Let's try a smarter approach: Flood fill from corners?
# The logo is centralized.
def remove_bg_flood(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    # Tolerance for "black/purple" background
    # Let's verify the corner pixel
    bg_color = img.getpixel((0, 0))
    
    # from PIL import Image, ImageChops # Removed to avoid shadowing causing UnboundLocalError

    def diff(a, b):
        return sum((a - b) ** 2 for a, b in zip(a, b))

    # This is a bit manual. Let's try a standard "black to transparent" since it came from a screenshot likely.
    
    datas = img.getdata()
    newData = []
    
    # Heuristic: convert mostly black pixels to transparent
    for item in datas:
        # Check for dark purple/black background
        # R, G, B
        if item[0] < 40 and item[1] < 30 and item[2] < 50:
            newData.append((0, 0, 0, 0))
        else:
            newData.append(item)
            
    img.putdata(newData)
    img.save(output_path)

if __name__ == "__main__":
    remove_bg_flood("public/phantom-logo-3d.png", "public/phantom-logo-3d.png")
