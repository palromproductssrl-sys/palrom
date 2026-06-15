import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont

def draw_curved_text(draw, img, text, center, radius, font, spacing_factor=1.1, text_color=(0, 0, 0, 255)):
    # Measure character widths
    chars = list(text)
    char_widths = []
    for char in chars:
        try:
            w = font.getlength(char)
        except AttributeError:
            bbox = font.getbbox(char)
            w = bbox[2] - bbox[0]
        char_widths.append(w)
    
    total_w = sum(char_widths)
    # Convert total width to an angular span in radians
    angle_span_rad = (total_w * spacing_factor) / radius
    
    # We want the text centered around the top of the circle (-90 degrees / -pi/2 radians)
    center_angle_rad = -math.pi / 2
    start_angle_rad = center_angle_rad - (angle_span_rad / 2)
    
    current_w = 0
    for i, char in enumerate(chars):
        char_w = char_widths[i]
        # Angle for the center of the current character
        char_angle_rad = start_angle_rad + (current_w + char_w / 2) * spacing_factor / radius
        current_w += char_w
        
        # Position of the character center on the circle
        x = center[0] + radius * math.cos(char_angle_rad)
        y = center[1] + radius * math.sin(char_angle_rad)
        
        # Calculate rotation angle in degrees
        theta_deg = math.degrees(char_angle_rad)
        rot_deg = -theta_deg - 90
        
        # Create a small image for the character to rotate it
        char_sz = 160
        char_img = Image.new("RGBA", (char_sz, char_sz), (0, 0, 0, 0))
        char_draw = ImageDraw.Draw(char_img)
        
        # Draw character centered
        bbox = font.getbbox(char)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        
        # Center of character drawn in the center of char_img
        draw_x = (char_sz - w) / 2 - bbox[0]
        draw_y = (char_sz - h) / 2 - bbox[1]
        char_draw.text((draw_x, draw_y), char, font=font, fill=text_color)
        
        # Rotate character image
        rotated_char_img = char_img.rotate(rot_deg, resample=Image.Resampling.BICUBIC)
        
        # Paste onto the main canvas
        paste_x = int(round(x - char_sz / 2))
        paste_y = int(round(y - char_sz / 2))
        img.paste(rotated_char_img, (paste_x, paste_y), rotated_char_img)

def generate_stamp(lang, outer_text, center_text, font_path, output_path):
    # Create image in RGBA mode
    img = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # 1. Draw solid yellow circle
    draw.ellipse([512 - 490, 512 - 490, 512 + 490, 512 + 490], fill=(241, 196, 55, 255))
    
    # 2. Draw black outer double border
    # Outermost border (r=490)
    draw.ellipse([512 - 490, 512 - 490, 512 + 490, 512 + 490], outline=(0, 0, 0, 255), width=7)
    # Inner outer border (r=476)
    draw.ellipse([512 - 476, 512 - 476, 512 + 476, 512 + 476], outline=(0, 0, 0, 255), width=7)
    
    # 3. Draw black inner border (r=320) separating curved text and center text
    draw.ellipse([512 - 320, 512 - 320, 512 + 320, 512 + 320], outline=(0, 0, 0, 255), width=7)
    
    # Load fonts
    font_outer = ImageFont.truetype(font_path, 48)
    font_center = ImageFont.truetype(font_path, 88)
    
    # 4. Draw curved text along radius R=398
    # We use R=398 so that it is centered in the band between r=320 and r=476 (band width is 156px, center is at 398)
    draw_curved_text(draw, img, outer_text, (512, 512), 398, font_outer, spacing_factor=1.1, text_color=(0, 0, 0, 255))
    
    # 5. Draw center text
    # Determine vertical offset and line spacing.
    # Adjust spacing for multiline center text.
    draw.text((512, 512), center_text, font=font_center, fill=(0, 0, 0, 255), anchor="mm", align="center", spacing=16)
    
    # Save the output image
    img.save(output_path, "PNG")
    print(f"Generated stamp for {lang} at {output_path}")

def main():
    font_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    if not os.path.exists(font_path):
        print(f"Font not found at {font_path}! Falling back to default.")
        font_path = "Arial Bold.ttf"  # Hopefully system font lookup works or error is handled
        
    stamps = {
        "en": {
            "outer": "JOIN TEAM PALROM",
            "center": "WE ARE\nHIRING"
        },
        "nl": {
            "outer": "KOM BIJ TEAM PALROM",
            "center": "WIJ ZOEKEN\nPERSONEEL"
        },
        "de": {
            "outer": "KOMM INS TEAM PALROM",
            "center": "WIR STELLEN\nEIN"
        },
        "ro": {
            "outer": "ALĂTURĂ-TE ECHIPEI PALROM",
            "center": "ANGAJĂM"
        }
    }
    
    output_dir = "public/images"
    os.makedirs(output_dir, exist_ok=True)
    
    # Artifact directory to copy images for visual review/record keeping
    artifact_dir = "/Users/mradder/.gemini/antigravity/brain/569e7aad-075f-4f34-9aae-d26d580f72de"
    os.makedirs(artifact_dir, exist_ok=True)
    
    for lang, texts in stamps.items():
        out_path = os.path.join(output_dir, f"hiring_stamp_{lang}.png")
        generate_stamp(lang, texts["outer"], texts["center"], font_path, out_path)
        
        # Also copy to artifact directory
        artifact_path = os.path.join(artifact_dir, f"hiring_stamp_{lang}.png")
        shutil.copy(out_path, artifact_path)
        print(f"Copied {lang} stamp to artifact: {artifact_path}")
        
    # Copy Dutch stamp to hiring_stamp.png as fallback
    fallback_path = os.path.join(output_dir, "hiring_stamp.png")
    shutil.copy(os.path.join(output_dir, "hiring_stamp_nl.png"), fallback_path)
    print("Copied hiring_stamp_nl.png to hiring_stamp.png")
    
    # Also copy fallback to artifact directory
    artifact_fallback = os.path.join(artifact_dir, "hiring_stamp.png")
    shutil.copy(fallback_path, artifact_fallback)
    print("Copied fallback stamp to artifact directory")

if __name__ == "__main__":
    main()
