from PIL import Image
import numpy as np

src_path = r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-luxury-logo.png'
img = Image.open(src_path).convert('RGBA')
w, h = img.size
arr = np.array(img)

# Flood fill from corner (0,0) with tolerance
from collections import deque

visited = np.zeros((h, w), dtype=bool)
mask = np.ones((h, w), dtype=np.uint8) * 255

# Corner seeds
queue = deque([(0, 0), (0, w-1), (h-1, 0), (h-1, w-1)])
for y, x in list(queue):
    visited[y, x] = True

while queue:
    cy, cx = queue.popleft()
    mask[cy, cx] = 0
    for dy, dx in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
        ny, nx = cy + dy, cx + dx
        if 0 <= ny < h and 0 <= nx < w and not visited[ny, nx]:
            # If the pixel is dark (part of the background)
            r, g, b = arr[ny, nx][:3]
            # Dark threshold for the background vignette
            if int(r) + int(g) + int(b) < 110:
                visited[ny, nx] = True
                queue.append((ny, nx))

# Apply mask with slight 1px blur for smooth edge
from PIL import ImageFilter
mask_img = Image.fromarray(mask, mode='L')
mask_img = mask_img.filter(ImageFilter.GaussianBlur(radius=1.2))

arr[:, :, 3] = np.array(mask_img)
out = Image.fromarray(arr, 'RGBA')
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)

out.save(r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-luxury-clean-cutout.png', 'PNG')
print('Clean cutout generated!')
