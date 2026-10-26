import os
import subprocess
from PIL import Image, ImageDraw, ImageFont

FFMPEG = os.path.abspath('node_modules/ffmpeg-static/ffmpeg')
FONT_BOLD = os.path.abspath('public/fonts/Roboto-Bold.ttf')
FONT_REG = os.path.abspath('public/fonts/Roboto-Regular.ttf')
LOGO_WHITE = os.path.abspath('public/images/logo_white.png')

SCRATCH = os.path.abspath('scratch')
os.makedirs(SCRATCH, exist_ok=True)

FINAL_OUTPUT = os.path.abspath('public/images/palrom-corporate-video.mp4')

print(f"Using FFmpeg: {FFMPEG}")

def run_cmd(cmd):
    print("Running:", " ".join(cmd[:6]) + "...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("STDERR:", res.stderr[-600:])
        raise RuntimeError(f"Command failed with code {res.returncode}")

# 1. Generate the 4-Product Visual Showcase
print("--- Generating 4-Product Visual Showcase ---")
W, H = 1920, 1080
canvas = Image.new('RGB', (W, H), (248, 250, 252))

prods = [
    ('beechwood_blanks.png', 'Beechwood Blanks', 'Thickness 20–67mm • Width 45–95mm'),
    ('planed_wood.png', 'Planed Slats', 'Four-sides planed • Millimeter precision'),
    ('dowels.png', 'Smooth & Rilled Dowels', 'Diameter 3–60mm • Custom lengths'),
    ('profiles.png', 'Custom Profiles', 'Mouldings, plinths & tailored strips')
]

font_title = ImageFont.truetype(FONT_BOLD, 26)
font_sub = ImageFont.truetype(FONT_REG, 17)
font_badge = ImageFont.truetype(FONT_BOLD, 15)

card_w, card_h = 420, 680
gap = 36
total_w = 4 * card_w + 3 * gap
start_x = (W - total_w) // 2
card_y = 150

draw = ImageDraw.Draw(canvas)

for i, (img_name, title, sub) in enumerate(prods):
    cx = start_x + i * (card_w + gap)
    draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=16, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
    draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + 8], radius=4, fill=(231, 177, 36))
    
    im = Image.open(f'public/images/{img_name}').convert('RGBA')
    im.thumbnail((360, 360), Image.Resampling.LANCZOS)
    ix = cx + (card_w - im.width) // 2
    iy = card_y + 40 + (360 - im.height) // 2
    canvas.paste(im, (ix, iy), im)
    
    draw.text((cx + 25, card_y + 430), title, font=font_title, fill=(30, 58, 43))
    draw.text((cx + 25, card_y + 472), sub, font=font_sub, fill=(100, 116, 139))
    
    draw.rounded_rectangle([cx + 25, card_y + 530, cx + 180, card_y + 565], radius=6, fill=(253, 247, 242), outline=(231, 177, 36), width=1)
    draw.text((cx + 38, card_y + 538), 'FSC® 100% Beech', font=font_badge, fill=(180, 83, 9))

prod_showcase_img = os.path.join(SCRATCH, 'products_showcase_card.png')
canvas.save(prod_showcase_img)

def create_brand_scene_filter(title, subtitle, w_box=1200):
    return (
        f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        f"[1:v]scale=-1:55[logo];"
        f"[base][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color=0x1e3a2b@0.92:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color=0xe7b124:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{title}':fontcolor=0xe7b124:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{subtitle}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )

# TIMELINE EXACTLY MATCHED TO THE VOICEOVER (Total 52.0 seconds):
# 0.0s - 9.5s: Scene 1 (Voice: "For over 25 years...")
print("--- Scene 1: Introduction & Aerial View (9.5s) ---")
s1_filter = create_brand_scene_filter(
    "Palrom Products",
    "FSC® 100% Certified Beechwood Manufacturer • Brad, Romania",
    1200
)
run_cmd([
    FFMPEG, '-y',
    '-loop', '1', '-i', 'public/images/hero_bg.jpg',
    '-i', LOGO_WHITE,
    '-t', '9.5',
    '-filter_complex', s1_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene1.mp4')
])

# 9.5s - 15.0s: Scene 2 (Voice: "From carefully selected logs to automated primary cutting lines in our modern sawmill...")
print("--- Scene 2: Raw Logs & Primary Sawmill (5.5s) ---")
s2_filter = create_brand_scene_filter(
    "Sustainable Harvesting & Primary Sawmill",
    "Locally sourced beechwood logs and automated breakdown lines",
    1250
)
run_cmd([
    FFMPEG, '-y',
    '-loop', '1', '-i', 'public/images/7.png',
    '-i', LOGO_WHITE,
    '-t', '5.5',
    '-filter_complex', s2_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene2.mp4')
])

# 15.0s - 21.5s: Scene 3 (Voice: "Combining European machinery with generations of Romanian craftsmanship...")
print("--- Scene 3: Live Machine Video (6.5s) ---")
s3_filter = (
    "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5[bg];"
    "[0:v]scale=-1:1080[fg];"
    "[bg][fg]overlay=(W-w)/2:(H-h)/2[combined];"
    "[1:v]scale=-1:55[logo];"
    "[combined][logo]overlay=60:45[with_logo];"
    "[with_logo]drawbox=x=60:y=880:w=1250:h=130:color=0x1e3a2b@0.92:t=fill,"
    "drawbox=x=60:y=880:w=6:h=130:color=0xe7b124:t=fill,"
    f"drawtext=fontfile='{FONT_BOLD}':text='Precision Milling in Action':fontcolor=0xe7b124:fontsize=36:x=85:y=905,"
    f"drawtext=fontfile='{FONT_REG}':text='Advanced European technology & dedicated Romanian craftsmanship':fontcolor=white:fontsize=24:x=85:y=955[out]"
)
run_cmd([
    FFMPEG, '-y',
    '-stream_loop', '1', '-i', 'public/images/production-video.mp4',
    '-i', LOGO_WHITE,
    '-t', '6.5',
    '-filter_complex', s3_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene3.mp4')
])

# 21.5s - 29.5s: Scene 4 (Voice: "Controlled steaming ensures warm, uniform color, while advanced kilns dry...")
print("--- Scene 4: Kilns & Controlled Steaming (8.0s) ---")
s4_filter = create_brand_scene_filter(
    "Controlled Steaming & Kiln Drying",
    "Computerized chamber drying precisely to 8–12% moisture",
    1150
)
run_cmd([
    FFMPEG, '-y',
    '-loop', '1', '-i', 'public/images/kilns.jpg',
    '-i', LOGO_WHITE,
    '-t', '8.0',
    '-filter_complex', s4_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene4.mp4')
])

# 29.5s - 38.5s: Scene 5 (Voice: "We produce premium blanks, planed slats, smooth dowels, and custom profiles...")
print("--- Scene 5: THE PRODUCTS (9.0s) ---")
s5_filter = (
    f"[0:v]scale=1920:1080[base];"
    f"[1:v]scale=-1:55[logo];"
    f"[base][logo]overlay=60:45[with_logo];"
    f"[with_logo]drawbox=x=60:y=880:w=1250:h=130:color=0x1e3a2b@0.92:t=fill,"
    f"drawbox=x=60:y=880:w=6:h=130:color=0xe7b124:t=fill,"
    f"drawtext=fontfile='{FONT_BOLD}':text='Custom B2B Products':fontcolor=0xe7b124:fontsize=36:x=85:y=905,"
    f"drawtext=fontfile='{FONT_REG}':text='Blanks, planed slats, smooth dowels, and tailored profiles':fontcolor=white:fontsize=24:x=85:y=955[out]"
)
run_cmd([
    FFMPEG, '-y',
    '-loop', '1', '-i', prod_showcase_img,
    '-i', LOGO_WHITE,
    '-t', '9.0',
    '-filter_complex', s5_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene5.mp4')
])

# 38.5s - 45.5s: Scene 6 (Voice: "One hundred percent FSC-certified, backed by an experienced team...")
print("--- Scene 6: Team & FSC Certification (7.0s) ---")
s6_filter = create_brand_scene_filter(
    "Our Dedicated Team",
    "100% FSC® certified timber & reliable European B2B supply",
    1120
)
run_cmd([
    FFMPEG, '-y',
    '-loop', '1', '-i', 'public/images/team_group_photo.png',
    '-i', LOGO_WHITE,
    '-t', '7.0',
    '-filter_complex', s6_filter,
    '-map', '[out]',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene6.mp4')
])

# 45.5s - 52.0s: Scene 7 (Voice: "Palrom Products. Your trusted partner in sustainable beechwood.")
print("--- Scene 7: Outro Brand Card (6.5s) ---")
s7_filter = (
    "color=c=0x1e3a2b:s=1920x1080:d=6.5[bg];"
    "[1:v]scale=560:-1[logo];"
    "[bg][logo]overlay=(W-w)/2:280[with_logo];"
    "[with_logo]drawbox=x=(1920-650)/2:y=540:w=650:h=4:color=0xe7b124:t=fill,"
    f"drawtext=fontfile='{FONT_BOLD}':text='Your Trusted B2B Partner in Sustainable Beechwood':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=580,"
    f"drawtext=fontfile='{FONT_REG}':text='www.palromproducts.com  •  office@palromproducts.ro':fontcolor=0xd4d4d4:fontsize=28:x=(w-text_w)/2:y=650[out]"
)
run_cmd([
    FFMPEG, '-y',
    '-f', 'lavfi', '-i', 'color=c=0x1e3a2b:s=1920x1080:d=6.5',
    '-i', LOGO_WHITE,
    '-filter_complex', s7_filter,
    '-map', '[out]',
    '-t', '6.5',
    '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
    os.path.join(SCRATCH, 'scene7.mp4')
])

print("--- Concatenating 7 Scenes ---")
concat_txt = os.path.join(SCRATCH, 'concat_list.txt')
with open(concat_txt, 'w') as f:
    for i in range(1, 8):
        f.write(f"file '{os.path.join(SCRATCH, f'scene{i}.mp4')}'\n")

raw_video = os.path.join(SCRATCH, 'video_no_audio.mp4')
run_cmd([
    FFMPEG, '-y', '-f', 'concat', '-safe', '0', '-i', concat_txt,
    '-c', 'copy', raw_video
])

print("--- Mixing Voiceover & Music in Exact Sync ---")
# Total length = 52.0 seconds
audio_filter = (
    "[1:a]adelay=1200|1200,volume=1.25,apad=whole_dur=52.0[vo];"
    "[2:a]volume=0.13,atrim=0:52.0,afade=t=out:st=48.5:d=3.5[bgm];"
    "[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]"
)

run_cmd([
    FFMPEG, '-y',
    '-i', raw_video,
    '-i', os.path.join(SCRATCH, 'voiceover_en_full.mp3'),
    '-i', os.path.join(SCRATCH, 'inspired.mp3'),
    '-filter_complex', audio_filter,
    '-map', '0:v',
    '-map', '[aout]',
    '-c:v', 'copy',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-t', '52.0',
    FINAL_OUTPUT
])

print(f"SUCCESS! Rendered perfectly synced corporate video: {FINAL_OUTPUT}")
print("Size:", os.path.getsize(FINAL_OUTPUT) / (1024*1024), "MB")
