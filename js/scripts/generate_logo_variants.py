import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps

src_path = r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-luxury-logo.png'
img = Image.open(src_path).convert('RGBA')
arr = np.array(img, dtype=np.float32)

# Compute luminance
r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
lum = 0.299 * r + 0.587 * g + 0.114 * b

# Alpha calculation: key out deep blacks, keep gold highlights and glow
alpha = np.clip((lum - 12.0) / (40.0 - 12.0), 0.0, 1.0) * 255.0
arr[:,:,3] = alpha

out_transparent = Image.fromarray(arr.astype(np.uint8), 'RGBA')

# Crop to non-transparent bounding box
bbox = out_transparent.getbbox()
if bbox:
    # Add a slight 8px margin
    w, h = out_transparent.size
    pad = 12
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(w, bbox[2] + pad),
        min(h, bbox[3] + pad)
    )
    cropped = out_transparent.crop(crop_box)
else:
    cropped = out_transparent

# Save high-res transparent emblem
transparent_path = r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-luxury-logo-transparent.png'
cropped.save(transparent_path, 'PNG')

# Also create a 128x128 icon / favicon
icon_128 = cropped.resize((128, 128), Image.Resampling.LANCZOS)
icon_128.save(r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-icon-128.png', 'PNG')

# Also create a circular gold-rimmed seal medallion on transparent canvas
size = 512
medallion = Image.new('RGBA', (size, size), (0, 0, 0, 0))
resized_cropped = cropped.resize((int(size * 0.92), int(size * 0.92)), Image.Resampling.LANCZOS)
offset = (int((size - resized_cropped.width) / 2), int((size - resized_cropped.height) / 2))
medallion.paste(resized_cropped, offset, resized_cropped)
medallion.save(r'C:\Users\Kasthuri\OneDrive\Desktop\Tasmac e commerce\img\tasmac-luxury-crest.png', 'PNG')

print('Variants generated successfully!')
