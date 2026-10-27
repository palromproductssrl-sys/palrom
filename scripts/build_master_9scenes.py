import os
import subprocess
import time
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance

FFMPEG = os.path.abspath('node_modules/ffmpeg-static/ffmpeg')
FONT_BOLD = os.path.abspath('public/fonts/Roboto-Bold.ttf')
FONT_REG = os.path.abspath('public/fonts/Roboto-Regular.ttf')

DRONE_SOURCE = os.path.abspath('public/videos/palrom_drone_source.mp4')
PROD_VIDEO = os.path.abspath('public/images/production-video.mp4')
WATERMARK_PATH = os.path.abspath('scratch/watermark_tuned_sharp.png')
FSC_LOGO_PATH = os.path.abspath('public/images/fsc_white_logo.png')
TEAM_PHOTO_PATH = os.path.abspath('public/images/team_group_photo.png')
LOGO_OUTRO_PATH = os.path.abspath('scratch/logo_white_sharp.png')
TRUCK_PHOTO_PATH = os.path.abspath('public/images/palrom_log_truck_yard.jpg')
BGM_AUDIO = os.path.abspath('scratch/inspired.mp3')

COLOR_ANTHRACITE_BOX = '0x292929@0.95'
COLOR_GOLD = '0xe7b124'

DRAFT_DIR = os.path.abspath('scratch/master_9scenes')
os.makedirs(DRAFT_DIR, exist_ok=True)

def run_cmd(cmd):
    print("Running:", " ".join(cmd[:6]) + "...")
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("STDERR:", res.stderr[-800:])
        raise RuntimeError(f"Command failed with code {res.returncode}")

def escape_txt(t):
    return t.replace(":", "\\:").replace("'", "\\'").replace("%", "\\%")

def render_banner_filter(title, subtitle, w_box=1250):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    return (
        f"drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955"
    )

def make_static_banner_overlay(title, subtitle, w_box=1250):
    overlay = Image.new('RGBA', (1920, 1080), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    draw.rectangle([60, 880, 60 + w_box, 880 + 130], fill=(41, 41, 41, int(255 * 0.95)))
    draw.rectangle([60, 880, 66, 880 + 130], fill=(231, 177, 36, 255))
    f_bold = ImageFont.truetype(FONT_BOLD, 36)
    f_reg = ImageFont.truetype(FONT_REG, 24)
    draw.text((85, 905), title, font=f_bold, fill=(231, 177, 36, 255))
    draw.text((85, 955), subtitle, font=f_reg, fill=(255, 255, 255, 255))
    return overlay

def render_subpixel_ken_burns(base_img_4k, duration, out_path, zoom_start=1.0, zoom_end=1.05,
                              pan_x_pct=0.5, pan_y_pct=0.5, watermark=None, wm_pos=(52, 37),
                              banner_overlay=None):
    fps = 30
    num_frames = int(duration * fps)
    bw, bh = base_img_4k.size

    proc = subprocess.Popen([
        FFMPEG, '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', '30',
        '-i', '-',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-r', '30',
        out_path
    ], stdin=subprocess.PIPE)

    for i in range(num_frames):
        t = i / max(1, num_frames - 1)
        zoom = zoom_start + (zoom_end - zoom_start) * t
        w_crop = bw / zoom
        h_crop = bh / zoom
        x0 = (bw - w_crop) * pan_x_pct
        y0 = (bh - h_crop) * pan_y_pct

        frame = base_img_4k.transform(
            (1920, 1080),
            Image.Transform.EXTENT,
            (x0, y0, x0 + w_crop, y0 + h_crop),
            resample=Image.Resampling.BICUBIC
        )

        if watermark:
            frame.paste(watermark, wm_pos, watermark)
        if banner_overlay:
            frame.paste(banner_overlay, (0, 0), banner_overlay)

        proc.stdin.write(frame.tobytes())

    proc.stdin.close()
    proc.wait()

watermark_im = Image.open(WATERMARK_PATH).convert('RGBA')

# 1. Fullscreen Truck Base Image (3840x2160, No blurred bars!)
truck_raw = Image.open(TRUCK_PHOTO_PATH)
tw, th = truck_raw.size
scale_truck = max(3840 / tw, 2160 / th)
nw_truck = int(tw * scale_truck)
nh_truck = int(th * scale_truck)
truck_scaled = truck_raw.resize((nw_truck, nh_truck), Image.Resampling.LANCZOS)
# Frame crane arm, logs, and truck cabin (excess height is nh_truck - 2160)
y_offset_truck = int((nh_truck - 2160) * 0.45)
truck_base_4k = truck_scaled.crop((0, y_offset_truck, 3840, y_offset_truck + 2160))

def get_team_base_4k(lang):
    team_p = f'public/images/team_group_photo_{lang}.png'
    if not os.path.exists(team_p):
        team_p = 'public/images/team_group_photo.png'
    team_raw = Image.open(team_p)
    tm_w, tm_h = team_raw.size
    scale_team = max(3840 / tm_w, 2160 / tm_h)
    tm_w_scaled = int(tm_w * scale_team)
    tm_h_scaled = int(tm_h * scale_team)
    team_resized = team_raw.resize((tm_w_scaled, tm_h_scaled), Image.Resampling.LANCZOS)
    return team_resized.crop(((tm_w_scaled - 3840)//2, (tm_h_scaled - 2160)//2, (tm_w_scaled - 3840)//2 + 3840, (tm_h_scaled - 2160)//2 + 2160))

# 3. Product Cards Data
product_items_dict = {
    'nl': {
        'badge': 'FSC® 100% Beuken',
        'items': [
            ('beechwood_blanks.png', 'Beukenhouten Blanks', 'Dikte 20–67mm • Breedte 45–95mm'),
            ('planed_wood.png', 'Geschaafde Latten', '4-zijdig geschaafd • Millimeterprecisie'),
            ('dowels.png', 'Gladde & Gerilde Stokken', 'Diameter 3–60mm • Lengtes op maat'),
            ('profiles.png', 'Maatwerk Profielen', 'Lijsten, plinten & speciale profielen')
        ]
    },
    'en': {
        'badge': 'FSC® 100% Beech',
        'items': [
            ('beechwood_blanks.png', 'Beechwood Blanks', 'Thickness 20–67mm • Width 45–95mm'),
            ('planed_wood.png', 'Planed Lumber & Slats', '4-side planed • Millimeter precision'),
            ('dowels.png', 'Smooth & Fluted Dowels', 'Diameter 3–60mm • Custom lengths'),
            ('profiles.png', 'Tailored Profiles', 'Baseboards, moldings & custom profiles')
        ]
    },
    'de': {
        'badge': 'FSC® 100% Buche',
        'items': [
            ('beechwood_blanks.png', 'Buchenholz-Kanteln', 'Stärke 20–67mm • Breite 45–95mm'),
            ('planed_wood.png', 'Gehobelte Leisten', 'Vierseitig gehobelt • Millimetergenau'),
            ('dowels.png', 'Glatte & Geriffelte Stäbe', 'Durchmesser 3–60mm • Wunschlänge'),
            ('profiles.png', 'Individuelle Profile', 'Sockelleisten, Frästeile & Sonderprofile')
        ]
    },
    'ro': {
        'badge': 'Fag Certificat FSC®',
        'items': [
            ('beechwood_blanks.png', 'Elemente din Fag', 'Grosime 20–67mm • Lățime 45–95mm'),
            ('planed_wood.png', 'Șipci Rindeluite', 'Rindeluite pe 4 fețe • Precizie milimetrică'),
            ('dowels.png', 'Tije Netede & Canelate', 'Diametru 3–60mm • Lungimi la comandă'),
            ('profiles.png', 'Profile Personalizate', 'Plinte, profile frezate & la comandă')
        ]
    }
}

def make_single_product_card_4k(lang, idx):
    card_w = 800
    card_h = 1000
    card_img = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(card_img)
    draw.rounded_rectangle([0, 0, card_w, card_h], radius=32, fill=(255, 255, 255, 255), outline=(226, 232, 240, 255), width=3)
    draw.rounded_rectangle([0, 0, card_w, 14], radius=8, fill=(231, 177, 36, 255))
    font_p_title = ImageFont.truetype(FONT_BOLD, 44)
    font_p_sub = ImageFont.truetype(FONT_REG, 28)
    font_p_badge = ImageFont.truetype(FONT_BOLD, 24)
    p_data = product_items_dict[lang]
    img_name, title, sub = p_data['items'][idx]
    im_path = f'public/images/{img_name}'
    if os.path.exists(im_path):
        im = Image.open(im_path).convert('RGBA')
        im.thumbnail((580, 580), Image.Resampling.LANCZOS)
        ix = (card_w - im.width) // 2
        iy = 50 + (580 - im.height) // 2
        card_img.paste(im, (ix, iy), im)
    draw.text((40, 680), title, font=font_p_title, fill=(30, 41, 59, 255))
    draw.text((40, 760), sub, font=font_p_sub, fill=(100, 116, 139, 255))
    draw.rounded_rectangle([40, 876, 370, 940], radius=12, fill=(253, 247, 242, 255), outline=(231, 177, 36, 255), width=2)
    draw.text((60, 890), p_data['badge'], font=font_p_badge, fill=(180, 83, 9, 255))
    return card_img

# Pre-compute 400x1050 diagonal Gaussian sheen brush for Scene 6 glanslijn
w_brush, h_brush = 400, 1050
yy_b, xx_b = np.mgrid[0:h_brush, 0:w_brush]
shear_b = 0.22
diag_b = (xx_b - shear_b * yy_b) - (w_brush / 2.0 - shear_b * h_brush / 2.0)
intensity_b = np.exp(- (diag_b**2) / (2 * (55.0**2)))
sheen_arr = np.zeros((h_brush, w_brush, 4), dtype=np.uint8)
sheen_arr[..., 0] = 255
sheen_arr[..., 1] = 255
sheen_arr[..., 2] = 255
sheen_arr[..., 3] = np.clip(intensity_b * 125, 0, 255).astype(np.uint8)
sheen_brush_im = Image.fromarray(sheen_arr, mode='RGBA')

def render_animated_product_cards(lang, duration, out_path, banner_overlay=None, watermark=None, wm_pos=(60, 45)):
    fps = 30
    num_frames = int(duration * fps)
    card_w, card_h = 800, 1000
    gap = 60
    total_w = 4 * card_w + 3 * gap
    start_x = (3840 - total_w) // 2
    target_y = 410

    cards = [make_single_product_card_4k(lang, idx) for idx in range(4)]
    bg_base = Image.new('RGBA', (3840, 2160), (248, 250, 252, 255))

    proc = subprocess.Popen([
        FFMPEG, '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', '30',
        '-i', '-',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709',
        '-r', '30',
        out_path
    ], stdin=subprocess.PIPE)

    for i in range(num_frames):
        t = i / fps
        canvas = bg_base.copy()

        # 1. Staggered card entrances
        for k in range(4):
            t_start = 0.08 + k * 0.18
            anim_dur = 0.42
            if t < t_start:
                continue
            cx = start_x + k * (card_w + gap)
            if t < t_start + anim_dur:
                u = (t - t_start) / anim_dur
                e = 1.0 - (1.0 - u)**3
                cy = int(target_y + (1.0 - e) * 110)
                c_im = cards[k].copy()
                alpha = c_im.split()[3].point(lambda p: int(p * e))
                c_im.putalpha(alpha)
                canvas.paste(c_im, (cx, cy), c_im)
            else:
                cy = target_y
                canvas.paste(cards[k], (cx, cy), cards[k])

        # 2. Golden glanslijn beam sweep across cards from 1.15s to 2.45s
        if 1.15 <= t <= 2.45:
            s_prog = (t - 1.15) / 1.30
            x_beam = int(start_x - 180 + s_prog * (total_w + 360))
            canvas.paste(sheen_brush_im, (x_beam, target_y - 20), sheen_brush_im)

        # 3. Continuous gentle Ken Burns zoom
        zoom = 1.0 + 0.025 * (i / max(1, num_frames - 1))
        w_crop = 3840 / zoom
        h_crop = 2160 / zoom
        x0 = (3840 - w_crop) * 0.5
        y0 = (2160 - h_crop) * 0.5

        frame = canvas.transform(
            (1920, 1080),
            Image.Transform.EXTENT,
            (x0, y0, x0 + w_crop, y0 + h_crop),
            resample=Image.Resampling.BICUBIC
        )

        if watermark:
            frame.paste(watermark, wm_pos, watermark)
        if banner_overlay:
            frame.paste(banner_overlay, (0, 0), banner_overlay)

        proc.stdin.write(frame.convert('RGB').tobytes())

    proc.stdin.close()
    proc.wait()

def make_product_card_4k(lang):
    card_w_4k = 800
    card_h_4k = 1000
    gap_4k = 60
    total_w_4k = 4 * card_w_4k + 3 * gap_4k
    start_x_4k = (3840 - total_w_4k) // 2
    card_y_4k = 410

    base_4k = Image.new('RGB', (3840, 2160), (248, 250, 252))
    draw_p = ImageDraw.Draw(base_4k)

    font_p_title = ImageFont.truetype(FONT_BOLD, 44)
    font_p_sub = ImageFont.truetype(FONT_REG, 28)
    font_p_badge = ImageFont.truetype(FONT_BOLD, 24)

    p_data = product_items_dict[lang]
    for i, (img_name, title, sub) in enumerate(p_data['items']):
        cx = start_x_4k + i * (card_w_4k + gap_4k)
        draw_p.rounded_rectangle([cx, card_y_4k, cx + card_w_4k, card_y_4k + card_h_4k], radius=32, fill=(255, 255, 255), outline=(226, 232, 240), width=3)
        draw_p.rounded_rectangle([cx, card_y_4k, cx + card_w_4k, card_y_4k + 12], radius=8, fill=(231, 177, 36))
        
        im_path = f'public/images/{img_name}'
        if os.path.exists(im_path):
            im = Image.open(im_path).convert('RGBA')
            im.thumbnail((580, 580), Image.Resampling.LANCZOS)
            ix = cx + (card_w_4k - im.width) // 2
            iy = card_y_4k + 50 + (580 - im.height) // 2
            base_4k.paste(im, (ix, iy), im)
        
        draw_p.text((cx + 40, card_y_4k + 680), title, font=font_p_title, fill=(30, 41, 59))
        draw_p.text((cx + 40, card_y_4k + 760), sub, font=font_p_sub, fill=(100, 116, 139))
        draw_p.rounded_rectangle([cx + 40, card_y_4k + 876, cx + 370, card_y_4k + 940], radius=12, fill=(253, 247, 242), outline=(231, 177, 36), width=2)
        draw_p.text((cx + 60, card_y_4k + 890), p_data['badge'], font=font_p_badge, fill=(180, 83, 9))

    return base_4k

def make_fsc_card_4k(header_text):
    fsc_base_4k = Image.new('RGB', (3840, 2160), (41, 41, 41))
    fsc_logo_im = Image.open(FSC_LOGO_PATH).convert('RGBA')
    fw_4k = 800
    fh_4k = int(fw_4k * fsc_logo_im.height / fsc_logo_im.width)
    fsc_logo_scaled = fsc_logo_im.resize((fw_4k, fh_4k), Image.Resampling.LANCZOS)
    fsc_base_4k.paste(fsc_logo_scaled, ((3840 - fw_4k) // 2, (2160 - fh_4k) // 2 - 120), fsc_logo_scaled)

    draw_fsc = ImageDraw.Draw(fsc_base_4k)
    f_head_4k = ImageFont.truetype(FONT_BOLD, 76)
    bbox_head = draw_fsc.textbbox((0, 0), header_text, font=f_head_4k)
    draw_fsc.text(((3840 - (bbox_head[2] - bbox_head[0])) // 2, 360), header_text, font=f_head_4k, fill=(231, 177, 36))
    return fsc_base_4k

def make_outro_card_4k(title_text, sub_text):
    outro_base_4k = Image.new('RGB', (3840, 2160), (41, 41, 41))
    logo_w_im = Image.open(LOGO_OUTRO_PATH).convert('RGBA')
    logo_w_4k = logo_w_im.resize((logo_w_im.width * 2, logo_w_im.height * 2), Image.Resampling.LANCZOS)
    outro_base_4k.paste(logo_w_4k, ((3840 - logo_w_4k.width) // 2, 560), logo_w_4k)

    draw_o = ImageDraw.Draw(outro_base_4k)
    draw_o.rectangle([(3840 - 1300) // 2, 1080, (3840 + 1300) // 2, 1088], fill=(231, 177, 36))

    f_ot_4k = ImageFont.truetype(FONT_BOLD, 72)
    f_os_4k = ImageFont.truetype(FONT_REG, 56)

    bt = draw_o.textbbox((0, 0), title_text, font=f_ot_4k)
    tw = bt[2] - bt[0]
    draw_o.text(((3840 - tw) // 2, 1160), title_text, font=f_ot_4k, fill=(255, 255, 255))

    bs = draw_o.textbbox((0, 0), sub_text, font=f_os_4k)
    sw = bs[2] - bs[0]
    draw_o.text(((3840 - sw) // 2, 1300), sub_text, font=f_os_4k, fill=(212, 212, 212))
    return outro_base_4k

# Pre-render the 4.8s Forest Ascend with Sunburst Bloom Clip
print("\n--- Pre-rendering 4.8s Forest Ascend with Sunburst Clip ---")
img_trunks_path = os.path.abspath('/Users/matthiasradder/.gemini/antigravity/brain/4f9024b4-d609-421a-b057-b180f987ffb5/forest_trees_ground_to_canopy_1793088740138.jpg')
img_canopy_sun_path = os.path.abspath('/Users/matthiasradder/.gemini/antigravity/brain/4f9024b4-d609-421a-b057-b180f987ffb5/carpathian_beech_forest_drone_sunburst_1793089865506.jpg')

im_trunks = Image.open(img_trunks_path).convert('RGB').resize((3840, 2160), Image.Resampling.LANCZOS)
im_canopy = Image.open(img_canopy_sun_path).convert('RGB').resize((3840, 2160), Image.Resampling.LANCZOS)

fps = 30
dur_forest = 4.8
num_frames_f = int(dur_forest * fps)
forest_ascend_clip = os.path.join(DRAFT_DIR, 'clip_forest_sunburst_ascend.mp4')

if not os.path.exists(forest_ascend_clip):
    proc_f = subprocess.Popen([
        FFMPEG, '-y',
        '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-s', '1920x1080', '-r', '30',
        '-i', '-',
        '-c:v', 'libx264', '-crf', '17', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        forest_ascend_clip
    ], stdin=subprocess.PIPE)

    sun_norm_x, sun_norm_y = 0.58, 0.28
    yy, xx = np.mgrid[0:1080, 0:1920]
    fx = int(1920 * sun_norm_x)
    fy = int(1080 * sun_norm_y)
    dist = np.sqrt(((xx - fx) / 1920.0)**2 + ((yy - fy) / 1080.0)**2)
    flare_mask = np.exp(-dist / 0.45)
    anamorphic = np.exp(-abs(yy - fy) / 80.0) * np.exp(-abs(xx - fx) / 900.0)
    flare_total = np.clip(flare_mask + anamorphic * 0.7, 0, 1.5)

    flare_color = np.zeros((1080, 1920, 3), dtype=float)
    flare_color[..., 0] = 255.0
    flare_color[..., 1] = 240.0
    flare_color[..., 2] = 200.0

    for i in range(num_frames_f):
        t = i / max(1, num_frames_f - 1)
        if t < 0.45:
            p = t / 0.45
            zoom = 1.05 + 0.10 * p
            w_crop = 3840 / zoom
            h_crop = 2160 / zoom
            y_pct = 0.85 - 0.70 * (p ** 1.3)
            x0 = (3840 - w_crop) * 0.5
            y0 = (2160 - h_crop) * y_pct
            frame = im_trunks.transform((1920, 1080), Image.Transform.EXTENT, (x0, y0, x0 + w_crop, y0 + h_crop), resample=Image.Resampling.BICUBIC)
            if p > 0.6:
                shimmer = (p - 0.6) / 0.4
                frame = ImageEnhance.Brightness(frame).enhance(1.0 + 0.15 * shimmer)
        elif t < 0.55:
            blend_w = (t - 0.40) / 0.15
            zoom_t = 1.15
            frame_t = im_trunks.transform((1920, 1080), Image.Transform.EXTENT, (0, 0, 3840/zoom_t, 2160/zoom_t), resample=Image.Resampling.BICUBIC)
            zoom_c = 1.04 + 0.04 * blend_w
            w_c = 3840 / zoom_c
            h_c = 2160 / zoom_c
            y_c = (2160 - h_c) * (0.6 - 0.3 * blend_w)
            frame_c = im_canopy.transform((1920, 1080), Image.Transform.EXTENT, ((3840-w_c)*0.5, y_c, (3840+w_c)*0.5, y_c + h_c), resample=Image.Resampling.BICUBIC)
            frame = Image.blend(frame_t, frame_c, blend_w)
            frame = ImageEnhance.Brightness(frame).enhance(1.0 + 0.3 * blend_w)
        else:
            p_sun = (t - 0.55) / 0.45
            zoom_s = 1.08 + 0.08 * p_sun
            w_s = 3840 / zoom_s
            h_s = 2160 / zoom_s
            y_s = (2160 - h_s) * (0.30 - 0.25 * (p_sun ** 0.8))
            frame_im = im_canopy.transform((1920, 1080), Image.Transform.EXTENT, ((3840-w_s)*0.5, y_s, (3840+w_s)*0.5, y_s + h_s), resample=Image.Resampling.BICUBIC)
            arr = np.array(frame_im, dtype=float)
            flare_strength = (p_sun ** 1.8) * 1.6
            applied_flare = flare_total * flare_strength
            for c in range(3):
                arr[..., c] = np.clip(arr[..., c] + applied_flare * flare_color[..., c] * 0.7, 0, 255)
                if p_sun > 0.6:
                    whiteout = (p_sun - 0.6) / 0.4
                    arr[..., c] = arr[..., c] * (1.0 - whiteout * 0.85) + 255.0 * (whiteout * 0.85)
            frame = Image.fromarray(arr.astype(np.uint8))

        proc_f.stdin.write(frame.tobytes())

    proc_f.stdin.close()
    proc_f.wait()
    print("Forest ascend clip generated!")

# Configuration for all 4 languages with mathematically exact voiceover pause alignment
lang_configs = {
    'nl': {
        'total_dur': 56.0,
        # S1: 8.2s (voice 0.25 - 8.17s) -> Forest ascend, sunburst, complex overview
        # S2: 3.0s (voice 8.79 - 10.97s: "Van zorgvuldig geselecteerde stammen...") -> truck fullscreen
        # S3: 4.6s (voice 11.32 - 15.58s: "...tot geautomatiseerde eerste zaaglijnen in onze moderne zagerij.") -> saw machine kort
        # S4: 5.8s (voice 16.34 - 21.57s: "Wij combineren Europese precisietechnologie met generaties aan Roemeens vakmanschap...") -> drone door de hal
        # S5: 8.6s (voice 21.93 - 30.12s: "Natuurlijke luchtdroging en geconditioneerde opslag zorgen voor een optimale stabilisatie van het hout, klaar voor verdere verwerking.") -> Nardi droogkamers ECHT SLOW-MOTION
        # S6: 11.8s (voice 30.80 - 41.95s: "Wij produceren hoogwaardige blanks...") -> 4 product cards
        # S7: 2.6s (voice 42.57 - 44.65s: "Volledig FSC-gecertificeerd...") -> FSC certification
        # S8: 5.2s (voice 45.15 - 49.76s: "...ondersteund door een ervaren team...") -> Team photo
        # S9: 6.2s (voice 50.51 - 54.30s: "Palrom Products...") -> Outro
        'durs': [8.2, 3.0, 4.6, 5.8, 8.6, 11.8, 2.6, 5.2, 6.2],
        'adelay_ms': 250,
        's1': ('Palrom Products', 'FSC® Gecertificeerde Beukenhoutproducent • Brad, Roemenië', 1200),
        's2': ('Duurzame Oogst & Houtopslag', 'Lokaal geoogste beukenstammen arriveren op onze voorraadwerf', 1250),
        's3': ('Precisiebewerking in Actie', 'Geavanceerde Europese zaagtechnologie & Roemeens vakmanschap', 1250),
        's4': ('Moderne Verwerkingshal & Houtopslag', 'Geavanceerde productielijnen en opslag van afgewerkt beukenhout', 1280),
        's5': ('Geavanceerde Droogkamers', 'Computergestuurde Nardi-kamers voor geconditioneerde droging', 1260),
        's6': ('B2B Maatwerk Producten', 'Blanks, geschaafde latten, gladde stokken en maatwerk profielen', 1260),
        's7_head': 'DUURZAAMHEID & KWALITEIT',
        's7': ('FSC® 100% Gecertificeerd', 'Gegarandeerd duurzaam en verantwoord geoogst beukenhout', 1220),
        's8': ('Ons Toegewijde Team', 'Vakmanschap en betrouwbare B2B-leveringen in heel Europa', 1250),
        's9_title': 'Uw Betrouwbare B2B Partner in Duurzaam Beukenhout',
        's9_sub': 'www.palromproducts.com  •  info@palromproducts.ro',
        'vo_file': 'scratch/voiceover_nl_full.mp3'
    },
    'en': {
        'total_dur': 56.0,
        # S1: 8.6s (voice 0.20 - 8.38s) -> Forest ascend, sunburst, factory reveal
        # S2: 2.8s (voice 8.80 - 10.84s: "From carefully selected logs...") -> truck fullscreen push-in
        # S3: 3.8s (voice 11.60 - 14.53s: "...to automated primary cutting lines in our modern sawmill.") -> saw machine
        # S4: 6.8s (voice 15.40 - 21.70s: "Combining European machinery with generations of Romanian craftsmanship...") -> drone through hall
        # S5: 8.6s (voice 22.20 - 30.04s: "Natural air drying and conditioned storage ensure optimal stabilization of the beechwood, ready for high-precision manufacturing.") -> Nardi droogkamers ECHT SLOW-MOTION
        # S6: 10.0s (voice 30.80 - 39.24s: "We produce premium blanks, planed slats, smooth dowels...") -> 4 product cards
        # S7: 3.0s (voice 40.80 - 43.44s: "One hundred percent FSC-certified...") -> FSC certification
        # S8: 5.0s (voice 43.80 - 48.06s: "...backed by an experienced team dedicated to quality and reliable delivery.") -> Team photo
        # S9: 7.4s (voice 49.00 - 52.66s: "Palrom Products. Your trusted partner in sustainable beechwood.") -> Outro
        'durs': [8.6, 2.8, 3.8, 6.8, 8.6, 10.0, 3.0, 5.0, 7.4],
        'adelay_ms': 0,
        's1': ('Palrom Products', 'FSC® Certified Beechwood Manufacturer • Brad, Romania', 1200),
        's2': ('Sustainable Harvest & Log Storage', 'Locally harvested beech logs arriving at our extensive yard', 1250),
        's3': ('Precision Milling in Action', 'Advanced European sawing technology & Romanian craftsmanship', 1250),
        's4': ('Modern Processing Hall & Storage', 'Advanced production lines and finished sawn timber storage', 1260),
        's5': ('Advanced Drying Kilns', 'Computer-controlled Nardi drying chambers for stabilized moisture control', 1280),
        's6': ('Custom B2B Products', 'Blanks, planed slats, smooth dowels, and tailored profiles', 1250),
        's7_head': 'SUSTAINABILITY & QUALITY',
        's7': ('FSC® 100% Certified', 'Guaranteed sustainable and responsibly harvested beechwood', 1220),
        's8': ('Our Dedicated Team', 'Decades of woodworking expertise & dependable European delivery', 1250),
        's9_title': 'Your Trusted B2B Partner in Sustainable Beechwood',
        's9_sub': 'www.palromproducts.com  •  info@palromproducts.ro',
        'vo_file': 'scratch/voiceover_en_full.mp3'
    },
    'de': {
        'total_dur': 61.0,
        # S1: 9.2s (voice 0.25 - 8.92s) -> Forest ascend, sunburst, factory reveal
        # S2: 3.0s (voice 9.45 - 11.85s: "Von sorgfältig ausgewählten Rundhölzern...") -> truck fullscreen push-in
        # S3: 5.4s (voice 12.45 - 17.31s: "...bis hin zu automatisierten Sägelinien in unserem modernen Sägewerk.") -> saw machine
        # S4: 7.4s (voice 17.85 - 24.62s: "Wir verbinden europäische Maschinentechnologie mit Generationen rumänischer Handwerkskunst...") -> drone through hall
        # S5: 10.0s (voice 25.25 - 34.52s: "Natürliche Freilufttrocknung und konditionierte Lagerung sorgen für eine optimale Stabilisierung des Buchenholzes, bereit für höchste Ansprüche.") -> Nardi droogkamers ECHT SLOW-MOTION
        # S6: 10.5s (voice 35.25 - 44.68s: "Wir fertigen erstklassige Kanteln, gehobelte Leisten, Rundstäbe...") -> 4 product cards
        # S7: 3.2s (voice 45.75 - 48.57s: "Einhundert Prozent FSC-zertifiziert...") -> FSC certification
        # S8: 5.6s (voice 48.95 - 54.04s: "...getragen von einem engagierten Team für garantierte Qualität und zuverlässige Lieferung.") -> Team photo
        # S9: 6.7s (voice 54.60 - 59.43s: "Palrom Products. Ihr verlässlicher B2B-Partner für nachhaltiges Buchenholz.") -> Outro
        'durs': [9.2, 3.0, 5.4, 7.4, 10.0, 10.5, 3.2, 5.6, 6.7],
        'adelay_ms': 0,
        's1': ('Palrom Products', 'FSC® Zertifizierter Buchenholzhersteller • Brad, Rumänien', 1200),
        's2': ('Nachhaltiger Holzeinschlag & Rundholzlager', 'Ausgewählte Buchenstämme auf unserem weitläufigen Werksgelände', 1280),
        's3': ('Präzisionsverarbeitung in Aktion', 'Fortschrittliche europäische Technologie & rumänische Handwerkskunst', 1280),
        's4': ('Moderne Verarbeitungshalle & Holzlager', 'Moderne Produktionslinien und geordnetes Schnittholzlager', 1280),
        's5': ('Moderne Trockenkammern', 'Computergesteuerte Nardi-Trockenkammern für optimale Holzfeuchte', 1280),
        's6': ('Individuelle B2B-Holzprodukte', 'Kanteln, gehobelte Leisten, Rundstäbe und Sonderprofile', 1250),
        's7_head': 'NACHHALTIGKEIT & QUALITÄT',
        's7': ('FSC® 100% Zertifiziert', 'Nachhaltiges und verantwortungsvoll beschafftes Buchenholz', 1220),
        's8': ('Unser Engagiertes Team', 'Höchste Handwerkskunst und verlässliche europaweite Lieferung', 1250),
        's9_title': 'Ihr Verlässlicher B2B-Partner für Buchenholz',
        's9_sub': 'www.palromproducts.com  •  info@palromproducts.ro',
        'vo_file': 'scratch/voiceover_de_full.mp3'
    },
    'ro': {
        'total_dur': 57.0,
        # S1: 8.6s (voice 0.25 - 8.45s) -> Forest ascend, sunburst, factory reveal
        # S2: 3.0s (voice 8.85 - 11.31s: "De la bușteni selectați cu grijă...") -> truck fullscreen push-in
        # S3: 4.6s (voice 11.85 - 15.93s: "...până la linii automate de debitare primară în fabrica noastră modernă.") -> saw machine
        # S4: 7.4s (voice 16.45 - 23.37s: "Îmbinăm utilajele europene de ultimă generație cu măiestria tradițională românească...") -> drone through hall
        # S5: 10.4s (voice 23.85 - 33.65s: "Uscarea naturală la aer și depozitarea condiționată asigură stabilizarea optimă a lemnului de fag, pregătit pentru prelucrări de înaltă precizie.") -> Nardi droogkamers ECHT SLOW-MOTION
        # S6: 8.6s (voice 34.25 - 41.67s: "Producem elemente din fag, șipci rindeluite, tije rotunde...") -> 4 product cards
        # S7: 2.8s (voice 42.85 - 45.12s: "Certificat sută la sută FSC...") -> FSC certification
        # S8: 4.8s (voice 45.65 - 49.86s: "...susținut de o echipă dedicată calității și livrărilor sigure.") -> Team photo
        # S9: 6.8s (voice 50.50 - 55.18s: "Palrom Products. Partenerul dumneavoastră de încredere în lemn de fag sustenabil.") -> Outro
        'durs': [8.6, 3.0, 4.6, 7.4, 10.4, 8.6, 2.8, 4.8, 6.8],
        'adelay_ms': 0,
        's1': ('Palrom Products', 'Producător de Lemn de Fag Certificat FSC® • Brad, România', 1220),
        's2': ('Recoltare Sustenabilă & Depozit Bușteni', 'Bușteni de fag din surse locale sosiți în depozitele noastre', 1250),
        's3': ('Prelucrare de Precizie în Acțiune', 'Tehnologie europeană de top și măiestrie românească dedicată', 1250),
        's4': ('Hală Modernă de Prelucrare & Depozit', 'Linii avansate de producție și depozit de cherestea finisată', 1260),
        's5': ('Uscătoare Industriale Avansate', 'Camere de uscare Nardi controlate pe computer pentru umiditate optimă', 1280),
        's6': ('Produse B2B la Comandă', 'Elemente, șipci rindeluite, tije netede și profile personalizate', 1250),
        's7_head': 'SUSTENABILITATE & CALITATE',
        's7': ('Certificare FSC® 100%', 'Lemn de fag sustenabil din păduri gestionate responsabil', 1220),
        's8': ('Echipa Noastră Dedicată', 'Măiestrie dedicată calității și livrărilor prompte în toată Europa', 1250),
        's9_title': 'Partenerul Dumneavoastră B2B de Încredere în Lemn de Fag',
        's9_sub': 'www.palromproducts.com  •  info@palromproducts.ro',
        'vo_file': 'scratch/voiceover_ro_full.mp3'
    }
}

def build_sfx_track(lang, durs, total_dur):
    sfx_out = os.path.join(DRAFT_DIR, f'sfx_track_{lang}.wav')
    t_s1 = 0.0
    t_flare = 3.8
    t_s3 = round(durs[0] + durs[1], 2)
    t_s4 = round(t_s3 + durs[2], 2)
    t_s5 = round(t_s4 + durs[3], 2)
    t_s6 = round(t_s5 + durs[4] + 1.2, 2)
    t_s7 = round(t_s5 + durs[4] + durs[5], 2)

    ms_s1 = int(t_s1 * 1000)
    ms_flare = int(t_flare * 1000)
    ms_s3 = int(t_s3 * 1000)
    ms_s4 = int(t_s4 * 1000)
    ms_s5 = int(t_s5 * 1000)
    ms_s6 = int(t_s6 * 1000)
    ms_s7 = int(t_s7 * 1000)

    f_sfx = (
        f"[0:a]adelay={ms_s1}|{ms_s1},volume=0.32[a0];"
        f"[1:a]adelay={ms_flare}|{ms_flare},volume=0.18[a1];"
        f"[2:a]adelay={ms_s3}|{ms_s3},volume=0.55[a2];"
        f"[3:a]adelay={ms_s4}|{ms_s4},volume=0.25[a3];"
        f"[4:a]adelay={ms_s5}|{ms_s5},lowpass=f=280,volume=0.22[a4];"
        f"[5:a]adelay={ms_s6}|{ms_s6},volume=0.12[a5];"
        f"[6:a]adelay={ms_s7}|{ms_s7},volume=0.18[a6];"
        f"[a0][a1][a2][a3][a4][a5][a6]amix=inputs=7:normalize=0,apad=whole_dur={total_dur}[sfxout]"
    )
    cmd_sfx = [
        FFMPEG, '-y',
        '-i', 'scratch/sfx_s1_wind.wav',
        '-i', 'scratch/sfx_s1_flare.wav',
        '-i', 'scratch/sfx_s3_saw.wav',
        '-i', 'scratch/sfx_s4_hall.wav',
        '-i', 'scratch/sfx_s4_hall.wav',
        '-i', 'scratch/sfx_s1_flare.wav',
        '-i', 'scratch/sfx_s7_fsc.wav',
        '-filter_complex', f_sfx,
        '-map', '[sfxout]',
        '-t', str(total_dur),
        sfx_out
    ]
    run_cmd(cmd_sfx)
    return sfx_out

def build_corporate_video(lang):
    cfg = lang_configs[lang]
    total_dur = cfg['total_dur']
    durs = cfg['durs']
    lang_dir = os.path.join(DRAFT_DIR, lang)
    os.makedirs(lang_dir, exist_ok=True)

    print(f"\n=======================================================")
    print(f"--- BUILDING CORPORATE VIDEO: {lang.upper()} ({total_dur}s) ---")
    print(f"=======================================================")

    # --- Scene 1: Bosopstijging ➔ Zonneverblinding ➔ Drone Fabriek Overview (durs[0]) ---
    s1_dur = durs[0]
    s1_path = os.path.join(lang_dir, 's1.mp4')
    # Drone footage fills the rest of Scene 1 after solar bloom at 4.0s
    drone_s1_dur = round(s1_dur - 4.0 + 0.8, 2)
    s1_filter = (
        f"[0:v]setpts=PTS-STARTPTS,fps=30,scale=1920:1080,setsar=1[v0];"
        f"[1:v]setpts=PTS-STARTPTS,fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[v1];"
        f"[v0][v1]xfade=transition=fadefast:duration=0.8:offset=4.0[merged];"
        f"[merged][2:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s1'][0], cfg['s1'][1], cfg['s1'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-i', forest_ascend_clip,
        '-ss', '146.0', '-t', str(drone_s1_dur), '-i', DRONE_SOURCE,
        '-i', WATERMARK_PATH,
        '-filter_complex', s1_filter, '-map', '[out]', '-t', str(s1_dur),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s1_path
    ])

    # --- Scene 2: Hout uitladen van vrachtwagen - FULL SCREEN BEELDVULLEND (durs[1]) ---
    s2_dur = durs[1]
    s2_path = os.path.join(lang_dir, 's2.mp4')
    s2_banner = make_static_banner_overlay(cfg['s2'][0], cfg['s2'][1], cfg['s2'][2])
    render_subpixel_ken_burns(
        base_img_4k=truck_base_4k,
        duration=s2_dur,
        out_path=s2_path,
        zoom_start=1.0,
        zoom_end=1.04,
        pan_x_pct=0.5,
        pan_y_pct=0.5,
        watermark=watermark_im,
        wm_pos=(52, 37),
        banner_overlay=s2_banner
    )

    # --- Scene 3: Zaagsnede zaagmachine (durs[2]) ---
    s3_dur = durs[2]
    s3_path = os.path.join(lang_dir, 's3.mp4')
    raw_cut_dur = s3_dur
    s3_filter = (
        f"[0:v]setpts=PTS-STARTPTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos+accurate_rnd,"
        f"crop=1920:1080:(in_w-out_w)/2:(in_h-out_h)*0.45,"
        f"cas=strength=0.88,unsharp=5:5:0.8:3:3:0.4,eq=contrast=1.08:brightness=0.01:saturation=1.08,setsar=1[saw_fs];"
        f"[saw_fs][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s3'][0], cfg['s3'][1], cfg['s3'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '2.0', '-t', str(raw_cut_dur), '-i', PROD_VIDEO, '-i', WATERMARK_PATH,
        '-filter_complex', s3_filter, '-map', '[out]', '-t', str(s3_dur),
        '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s3_path
    ])

    # --- Scene 4: Hal in & afgewerkt hout zien (durs[3]) ---
    s4_dur = durs[3]
    s4_path = os.path.join(lang_dir, 's4.mp4')
    s4_filter = (
        f"[0:v]setpts=PTS-STARTPTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s4'][0], cfg['s4'][1], cfg['s4'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '42.0', '-t', str(s4_dur), '-i', DRONE_SOURCE, '-i', WATERMARK_PATH,
        '-filter_complex', s4_filter, '-map', '[out]', '-t', str(s4_dur),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s4_path
    ])

    # --- Scene 5: Geavanceerde Droogkamers Nardi ECHT Slow-Motion (durs[4]) ---
    s5_dur = durs[4]
    s5_path = os.path.join(lang_dir, 's5.mp4')
    # True 50% slow-motion: 60fps drone footage slowed down 2.0x to 30fps
    slowmo_factor_kiln = 2.0
    raw_dur_kiln = round(s5_dur / slowmo_factor_kiln, 3)
    s5_filter = (
        f"[0:v]setpts={slowmo_factor_kiln}*PTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s5'][0], cfg['s5'][1], cfg['s5'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '101.8', '-t', str(raw_dur_kiln), '-i', DRONE_SOURCE, '-i', WATERMARK_PATH,
        '-filter_complex', s5_filter, '-map', '[out]', '-t', str(s5_dur),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s5_path
    ])

    # --- Scene 6: B2B Maatwerk Producten (durs[5]) ---
    s6_dur = durs[5]
    s6_path = os.path.join(lang_dir, 's6.mp4')
    logo_wm_prod = watermark_im.resize((int(watermark_im.width * 0.9), int(watermark_im.height * 0.9)), Image.Resampling.LANCZOS)
    s6_banner = make_static_banner_overlay(cfg['s6'][0], cfg['s6'][1], cfg['s6'][2])
    render_animated_product_cards(
        lang=lang,
        duration=s6_dur,
        out_path=s6_path,
        banner_overlay=s6_banner,
        watermark=logo_wm_prod,
        wm_pos=(60, 45)
    )

    # --- Scene 7: FSC Certificering & Kwaliteit (durs[6]) ---
    s7_dur = durs[6]
    s7_path = os.path.join(lang_dir, 's7.mp4')
    fsc_base = make_fsc_card_4k(cfg['s7_head'])
    s7_banner = make_static_banner_overlay(cfg['s7'][0], cfg['s7'][1], cfg['s7'][2])
    render_subpixel_ken_burns(
        base_img_4k=fsc_base,
        duration=s7_dur,
        out_path=s7_path,
        zoom_start=1.0,
        zoom_end=1.04,
        watermark=watermark_im,
        wm_pos=(52, 37),
        banner_overlay=s7_banner
    )

    # --- Scene 8: Ons Toegewijde Team (durs[7]) ---
    s8_dur = durs[7]
    s8_path = os.path.join(lang_dir, 's8.mp4')
    s8_banner = make_static_banner_overlay(cfg['s8'][0], cfg['s8'][1], cfg['s8'][2])
    team_base_4k = get_team_base_4k(lang)
    render_subpixel_ken_burns(
        base_img_4k=team_base_4k,
        duration=s8_dur,
        out_path=s8_path,
        zoom_start=1.0,
        zoom_end=1.04,
        pan_x_pct=0.5,
        pan_y_pct=0.45,
        watermark=watermark_im,
        wm_pos=(52, 37),
        banner_overlay=s8_banner
    )

    # --- Scene 9: Outro Brand Card (durs[8]) ---
    s9_dur = durs[8]
    s9_path = os.path.join(lang_dir, 's9.mp4')
    outro_base = make_outro_card_4k(cfg['s9_title'], cfg['s9_sub'])
    render_subpixel_ken_burns(
        base_img_4k=outro_base,
        duration=s9_dur,
        out_path=s9_path,
        zoom_start=1.0,
        zoom_end=1.025,
        watermark=None,
        banner_overlay=None
    )

    # --- Seamless Concatenation & Audio Mix ---
    print(f"\n--- Concatenating 9 scenes & Mixing Audio for {lang.upper()} ---")
    sfx_file = build_sfx_track(lang, durs, total_dur)
    fade_start = round(total_dur - 3.5, 2)
    concat_inputs = "".join(f"[{i}:v]" for i in range(9))
    adelay_val = cfg.get('adelay_ms', 800)
    filter_complex = (
        f"{concat_inputs}concat=n=9:v=1:a=0[vcat];"
        f"[9:a]adelay={adelay_val}|{adelay_val},volume=1.25,apad=whole_dur={total_dur}[vo];"
        f"[10:a]volume=0.12,atrim=0:{total_dur},afade=t=out:st={fade_start}:d=3.5[bgm];"
        f"[11:a]volume=0.75,atrim=0:{total_dur}[sfx];"
        f"[vo][bgm][sfx]amix=inputs=3:duration=first:dropout_transition=2[aout]"
    )

    out_file = os.path.abspath(f'public/images/palrom-corporate-video-{lang}.mp4')
    cmd_final = [
        FFMPEG, '-y',
        '-i', s1_path,
        '-i', s2_path,
        '-i', s3_path,
        '-i', s4_path,
        '-i', s5_path,
        '-i', s6_path,
        '-i', s7_path,
        '-i', s8_path,
        '-i', s9_path,
        '-i', os.path.abspath(cfg['vo_file']),
        '-i', BGM_AUDIO,
        '-i', sfx_file,
        '-filter_complex', filter_complex,
        '-map', '[vcat]',
        '-map', '[aout]',
        '-c:v', 'libx264',
        '-crf', '18',
        '-preset', 'fast',
        '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709',
        '-color_trc', 'bt709',
        '-colorspace', 'bt709',
        '-r', '30',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-t', str(total_dur),
        out_file
    ]
    run_cmd(cmd_final)

    # If Dutch, also copy to default fallback video
    if lang == 'nl':
        default_file = os.path.abspath('public/images/palrom-corporate-video.mp4')
        import shutil
        shutil.copyfile(out_file, default_file)
        print(f"Copied Dutch video to default: {default_file}")

    sz_mb = os.path.getsize(out_file) / (1024 * 1024)
    print(f"SUCCESS: Rendered {out_file} ({sz_mb:.2f} MB | {total_dur}s)")

if __name__ == '__main__':
    import sys
    target = sys.argv[1] if len(sys.argv) > 1 else 'nl'
    if target == 'all':
        for l in ['nl', 'en', 'de', 'ro']:
            build_corporate_video(l)
    else:
        build_corporate_video(target)
