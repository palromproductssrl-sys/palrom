import os
import math
import shutil
from PIL import Image, ImageDraw, ImageFont

def draw_curved_text_top(draw, img, text, center, radius, font, spacing_factor, text_color=(0, 0, 0, 255)):
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
    angle_span_rad = (total_w * spacing_factor) / radius
    
    center_angle_rad = -math.pi / 2
    start_angle_rad = center_angle_rad - (angle_span_rad / 2)
    
    current_w = 0
    for i, char in enumerate(chars):
        char_w = char_widths[i]
        char_angle_rad = start_angle_rad + (current_w + char_w / 2) * spacing_factor / radius
        current_w += char_w
        
        x = center[0] + radius * math.cos(char_angle_rad)
        y = center[1] + radius * math.sin(char_angle_rad)
        
        theta_deg = math.degrees(char_angle_rad)
        rot_deg = -theta_deg - 90
        
        char_sz = 200
        char_img = Image.new("RGBA", (char_sz, char_sz), (0, 0, 0, 0))
        char_draw = ImageDraw.Draw(char_img)
        
        bbox = font.getbbox(char)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        
        draw_x = (char_sz - w) / 2 - bbox[0]
        draw_y = (char_sz - h) / 2 - bbox[1]
        char_draw.text((draw_x, draw_y), char, font=font, fill=text_color)
        
        rotated_char_img = char_img.rotate(rot_deg, resample=Image.Resampling.BICUBIC)
        
        paste_x = int(round(x - char_sz / 2))
        paste_y = int(round(y - char_sz / 2))
        img.paste(rotated_char_img, (paste_x, paste_y), rotated_char_img)

def draw_curved_text_bottom(draw, img, text, center, radius, font, spacing_factor, text_color=(0, 0, 0, 255)):
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
    angle_span_rad = (total_w * spacing_factor) / radius
    
    # Bottom text is centered at +90 degrees (pi/2 radians)
    center_angle_rad = math.pi / 2
    # Start on the left (larger angle, e.g. pi/2 + span/2) and write to the right (subtracting angles)
    start_angle_rad = center_angle_rad + (angle_span_rad / 2)
    
    current_w = 0
    for i, char in enumerate(chars):
        char_w = char_widths[i]
        # Subtract angle to move clockwise (from 8 o'clock to 4 o'clock)
        char_angle_rad = start_angle_rad - (current_w + char_w / 2) * spacing_factor / radius
        current_w += char_w
        
        x = center[0] + radius * math.cos(char_angle_rad)
        y = center[1] + radius * math.sin(char_angle_rad)
        
        theta_deg = math.degrees(char_angle_rad)
        rot_deg = 90 - theta_deg
        
        char_sz = 200
        char_img = Image.new("RGBA", (char_sz, char_sz), (0, 0, 0, 0))
        char_draw = ImageDraw.Draw(char_img)
        
        bbox = font.getbbox(char)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        
        draw_x = (char_sz - w) / 2 - bbox[0]
        draw_y = (char_sz - h) / 2 - bbox[1]
        char_draw.text((draw_x, draw_y), char, font=font, fill=text_color)
        
        rotated_char_img = char_img.rotate(rot_deg, resample=Image.Resampling.BICUBIC)
        
        paste_x = int(round(x - char_sz / 2))
        paste_y = int(round(y - char_sz / 2))
        img.paste(rotated_char_img, (paste_x, paste_y), rotated_char_img)

def generate_stamp(lang, outer_text, center_text, font_path, output_path):
    # Create image in RGBA mode
    img = Image.new("RGBA", (1024, 1024), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Radius and thickness specifications (borders are now significantly thicker)
    r_outer = 502
    r_outer_inner = 468
    r_inner = 320
    radius_text = 394
    border_w = 18
    
    # 1. Draw solid yellow circle
    draw.ellipse([512 - r_outer, 512 - r_outer, 512 + r_outer, 512 + r_outer], fill=(241, 196, 55, 255))
    
    # 2. Draw black outer double border (width 18px for "vet veel dikker zwart")
    # Outermost border (r=502)
    draw.ellipse([512 - r_outer, 512 - r_outer, 512 + r_outer, 512 + r_outer], outline=(0, 0, 0, 255), width=border_w)
    # Inner outer border (r=468)
    draw.ellipse([512 - r_outer_inner, 512 - r_outer_inner, 512 + r_outer_inner, 512 + r_outer_inner], outline=(0, 0, 0, 255), width=border_w)
    
    # 3. Draw black inner border (r=320, width 18px) separating curved text and center text
    draw.ellipse([512 - r_inner, 512 - r_inner, 512 + r_inner, 512 + r_inner], outline=(0, 0, 0, 255), width=border_w)
    
    # 4. Calculate outer text font size and spacing dynamically
    # Start at 72pt and auto-adjust if the text is too long (spans > 165 degrees)
    fs_outer = 72
    spacing_factor = 1.05
    chars = list(outer_text)
    
    while fs_outer > 36:
        font_outer = ImageFont.truetype(font_path, fs_outer)
        char_widths = []
        for char in chars:
            try:
                w = font_outer.getlength(char)
            except AttributeError:
                bbox = font_outer.getbbox(char)
                w = bbox[2] - bbox[0]
            char_widths.append(w)
        total_w = sum(char_widths)
        
        # Test spacing factor 1.05
        angle_span_rad = (total_w * 1.05) / radius_text
        if angle_span_rad <= math.radians(165):
            spacing_factor = 1.05
            break
        else:
            # Squeeze it a bit, down to spacing_factor = 0.95
            angle_span_rad_min = (total_w * 0.95) / radius_text
            if angle_span_rad_min <= math.radians(165):
                # Calculate exact spacing to fit 165 degrees
                spacing_factor = (math.radians(165) * radius_text) / total_w
                break
        
        # Decrease font size if it doesn't fit even when squeezed
        fs_outer -= 2
        
    print(f"[{lang}] Outer text: font size {fs_outer}, spacing factor {spacing_factor:.3f}")
    
    # Draw curved top text
    draw_curved_text_top(draw, img, outer_text, (512, 512), radius_text, font_outer, spacing_factor, text_color=(0, 0, 0, 255))
    # Draw curved bottom text
    draw_curved_text_bottom(draw, img, outer_text, (512, 512), radius_text, font_outer, spacing_factor, text_color=(0, 0, 0, 255))
    
    # 5. Calculate center text font size dynamically to prevent overflow
    # Bounding box limits inside the 320px radius circle
    max_width = 460
    max_height = 360
    
    fs_center = 80
    while fs_center > 30:
        font_center = ImageFont.truetype(font_path, fs_center)
        # Measure multiline text bbox
        bbox = draw.multiline_textbbox((0, 0), center_text, font=font_center, spacing=16)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        if w <= max_width and h <= max_height:
            break
        fs_center -= 2
        
    print(f"[{lang}] Center text: font size {fs_center} (width={w}, height={h})")
    
    # Draw center text
    draw.text((512, 512), center_text, font=font_center, fill=(0, 0, 0, 255), anchor="mm", align="center", spacing=16)
    
    # Save the output image
    img.save(output_path, "PNG")
    print(f"Generated stamp for {lang} at {output_path}")

def main():
    font_path = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
    if not os.path.exists(font_path):
        print(f"Font not found at {font_path}! Falling back to default.")
        font_path = "Arial Bold.ttf"
        
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
            "center": "WIR\nSTELLEN\nEIN"
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
