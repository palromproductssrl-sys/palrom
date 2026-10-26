import os
import subprocess
import shutil
import math
import json
import sys
import argparse
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np

parser = argparse.ArgumentParser()
parser.add_argument('--lang', default='all', help='Target language: nl, en, de, ro, or all')
args, _ = parser.parse_known_args()

FFMPEG = os.path.abspath('node_modules/ffmpeg-static/ffmpeg')
FONT_BOLD = os.path.abspath('public/fonts/Roboto-Bold.ttf')
FONT_REG = os.path.abspath('public/fonts/Roboto-Regular.ttf')

# LOGO ASSETS:
LOGO_ORIGINAL = os.path.abspath('public/images/logo.png')
LOGO_WHITE = os.path.abspath('public/images/logo_white.png')
FSC_LOGO = os.path.abspath('public/images/fsc_logo.png')

# BRAND COLOR PALETTE: Palrom Brand Charcoal (#292929 / RGB 41, 41, 41) + Palrom Gold (#e7b124)
COLOR_ANTHRACITE_BOX = '0x292929@0.95'      # Palrom Brand Charcoal (#292929) for lower thirds
COLOR_ANTHRACITE_OUTRO = '0x292929'         # Solid Palrom Brand Charcoal (#292929) for FSC & Outro
COLOR_ANTHRACITE_TEXT = (41, 41, 41)        # Palrom Brand Charcoal (#292929) for product titles
COLOR_GOLD = '0xe7b124'                     # Brand golden yellow accent line & title

SCRATCH = os.path.abspath('scratch')
os.makedirs(SCRATCH, exist_ok=True)

def run_cmd(cmd):
    res = subprocess.run(cmd, capture_output=True, text=True)
    if res.returncode != 0:
        print("STDERR:", res.stderr[-600:])
        raise RuntimeError(f"Command failed with code {res.returncode}")

def escape_txt(t):
    return t.replace('\\', '\\\\').replace(':', r'\:').replace("'", r"\'").replace('%', r'\%')

# 1. OPTUNE & SHARPEN WATERMARK LOGO (Pure Crisp Black & Yellow on 100% Transparent Background - ZERO halo/stroke)
print("--- Generating Razor-Sharp Watermark Logo ---")
logo_raw = Image.open(LOGO_ORIGINAL).convert('RGBA')
bbox = logo_raw.getbbox()
logo_cropped = logo_raw.crop(bbox)

# Convert 'PRODUCTS S.R.L.' from gold to solid black [23, 27, 28] matching 'PALROM' black for razor-sharp readability
# The emblem circle is strictly x <= 210, text PRODUCTS S.R.L. is strictly x >= 235
arr = np.array(logo_cropped)
mask_bottom_gold = (np.arange(arr.shape[0])[:, None] > 130) & (np.arange(arr.shape[1])[None, :] >= 235) & (arr[:, :, 3] > 30) & (arr[:, :, 0] > 100) & (arr[:, :, 1] > 70)
arr_black_products = arr.copy()
arr_black_products[mask_bottom_gold, 0] = 23
arr_black_products[mask_bottom_gold, 1] = 27
arr_black_products[mask_bottom_gold, 2] = 28
logo_ready = Image.fromarray(arr_black_products)

# Target width: 320px - Pure Lanczos resampling, zero stroke, zero dilation, razor-sharp on transparent background
target_w = 320
target_h = int(target_w * logo_ready.height / logo_ready.width)
watermark_sharp = logo_ready.resize((target_w, target_h), Image.Resampling.LANCZOS)

WATERMARK_SHARP_PATH = os.path.join(SCRATCH, 'watermark_tuned_sharp.png')
watermark_sharp.save(WATERMARK_SHARP_PATH)
print(f"Saved razor-sharp watermark: {WATERMARK_SHARP_PATH} ({watermark_sharp.size})")

# 2. OPTUNE & SHARPEN OUTRO INVERSE LOGO
print("--- Generating Optuned Razor-Sharp Outro Logo ---")
logo_w_raw = Image.open(LOGO_WHITE).convert('RGBA')
bbox_w = logo_w_raw.getbbox()
logo_w_cropped = logo_w_raw.crop(bbox_w)
ow_target = 500
oh_target = int(ow_target * logo_w_cropped.height / logo_w_cropped.width)
logo_w_hq = logo_w_cropped.resize((ow_target, oh_target), Image.Resampling.LANCZOS)

LOGO_INVERSE_SHARP_PATH = os.path.join(SCRATCH, 'logo_white_sharp.png')
logo_w_hq.save(LOGO_INVERSE_SHARP_PATH)
print(f"Saved razor-sharp outro logo: {LOGO_INVERSE_SHARP_PATH} ({logo_w_hq.size})")

# 3. Product Cards in 4 languages
product_data = {
    'en': {
        'badge': 'FSC® 100% Beech',
        'items': [
            ('beechwood_blanks.png', 'Beechwood Blanks', 'Thickness 20–67mm • Width 45–95mm'),
            ('planed_wood.png', 'Planed Slats', 'Four-sides planed • Millimeter precision'),
            ('dowels.png', 'Smooth & Rilled Dowels', 'Diameter 3–60mm • Custom lengths'),
            ('profiles.png', 'Custom Profiles', 'Mouldings, plinths & tailored strips')
        ]
    },
    'nl': {
        'badge': 'FSC® 100% Beuken',
        'items': [
            ('beechwood_blanks.png', 'Beukenhouten Blanks', 'Dikte 20–67mm • Breedte 45–95mm'),
            ('planed_wood.png', 'Geschaafde Latten', '4-zijdig geschaafd • Millimeterprecisie'),
            ('dowels.png', 'Gladde & Gerilde Stokken', 'Diameter 3–60mm • Lengtes op maat'),
            ('profiles.png', 'Maatwerk Profielen', 'Lijsten, plinten & speciale profielen')
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

font_title = ImageFont.truetype(FONT_BOLD, 26)
font_sub = ImageFont.truetype(FONT_REG, 17)
font_badge = ImageFont.truetype(FONT_BOLD, 15)

card_w, card_h = 420, 680
gap = 36
total_w = 4 * card_w + 3 * gap
start_x = (1920 - total_w) // 2
card_y = 150

for lang, data in product_data.items():
    card_path = os.path.join(SCRATCH, f'products_showcase_{lang}.png')
    canvas = Image.new('RGB', (1920, 1080), (248, 250, 252))
    draw = ImageDraw.Draw(canvas)
    
    for i, (img_name, title, sub) in enumerate(data['items']):
        cx = start_x + i * (card_w + gap)
        draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + card_h], radius=16, fill=(255, 255, 255), outline=(226, 232, 240), width=2)
        draw.rounded_rectangle([cx, card_y, cx + card_w, card_y + 8], radius=4, fill=(231, 177, 36))
        
        im = Image.open(f'public/images/{img_name}').convert('RGBA')
        im.thumbnail((360, 360), Image.Resampling.LANCZOS)
        ix = cx + (card_w - im.width) // 2
        iy = card_y + 40 + (360 - im.height) // 2
        canvas.paste(im, (ix, iy), im)
        
        # Anthracite black title
        draw.text((cx + 25, card_y + 430), title, font=font_title, fill=COLOR_ANTHRACITE_TEXT)
        draw.text((cx + 25, card_y + 472), sub, font=font_sub, fill=(100, 116, 139))
        
        draw.rounded_rectangle([cx + 25, card_y + 530, cx + 185, card_y + 565], radius=6, fill=(253, 247, 242), outline=(231, 177, 36), width=1)
        draw.text((cx + 36, card_y + 538), data['badge'], font=font_badge, fill=(180, 83, 9))
    
    canvas.save(card_path)

# Pure White FSC Logo (without borders, white on dark background)
FSC_WHITE_PATH = os.path.abspath('public/images/fsc_white_logo.png')

# Scene text definitions per language - Timing perfectly synchronized with voiceover pauses
scenes_config = {
    'en': {
        'total_dur': 49.0,
        'durs': [8.8, 4.6, 5.9, 7.3, 8.4, 6.6, 7.4],
        'fsc_dur': 2.8,
        'team_dur': 4.6,
        'fsc_title': 'FSC® 100% Certified',
        'fsc_sub': 'Guaranteed sustainable and responsibly harvested beechwood',
        'team_title': 'Our Dedicated Team',
        'team_sub': 'Decades of woodworking expertise & dependable European delivery',
        'outro_title': 'Your Trusted B2B Partner in Sustainable Beechwood',
        'outro_sub': 'www.palromproducts.com  •  office@palromproducts.ro',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Certified Beechwood Manufacturer • Brad, Romania', 'w': 1180},
            {'title': 'Sustainable Harvesting & Raw Timber', 'sub': 'Locally sourced beech logs arriving at our extensive storage yards', 'w': 1250},
            {'title': 'Precision Milling in Action', 'sub': 'Advanced European technology & dedicated Romanian craftsmanship', 'w': 1250},
            {'title': 'Conditioned Storage & Air Drying', 'sub': 'Natural air drying (Air Dried - AD) and conditioned timber stabilization', 'w': 1280},
            {'title': 'Custom B2B Products', 'sub': 'Blanks, planed slats, smooth dowels, and tailored profiles', 'w': 1250}
        ]
    },
    'nl': {
        'total_dur': 56.0,
        'durs': [8.6, 6.9, 7.3, 6.6, 10.9, 7.1, 8.6],
        'fsc_dur': 3.0,
        'team_dur': 4.9,
        'fsc_title': 'FSC® 100% Gecertificeerd',
        'fsc_sub': 'Gegarandeerd duurzaam en verantwoord beukenhout',
        'team_title': 'Ons Toegewijde Team',
        'team_sub': 'Vakmanschap en betrouwbare B2B-leveringen in heel Europa',
        'outro_title': 'Uw Betrouwbare B2B Partner in Duurzaam Beukenhout',
        'outro_sub': 'www.palromproducts.com  •  office@palromproducts.ro',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Gecertificeerde Beukenhoutproducent • Brad, Roemenië', 'w': 1200},
            {'title': 'Duurzame Oogst & Houtopslag', 'sub': 'Lokaal geoogste beukenstammen arriveren op onze ruime voorraadwerf', 'w': 1250},
            {'title': 'Precisiebewerking in Actie', 'sub': 'Geavanceerde Europese machines & Roemeens vakmanschap', 'w': 1220},
            {'title': 'Geconditioneerde Opslag & Luchtdroging', 'sub': 'Natuurlijke luchtdroging (Air Dried - AD) en geconditioneerde houtopslag', 'w': 1280},
            {'title': 'B2B Maatwerk Producten', 'sub': 'Blanks, geschaafde latten, gladde stokken en maatwerk profielen', 'w': 1260}
        ]
    },
    'de': {
        'total_dur': 62.0,
        'durs': [9.5, 7.8, 7.0, 7.2, 11.6, 8.5, 10.4],
        'fsc_dur': 3.2,
        'team_dur': 6.1,
        'fsc_title': 'FSC® 100% Zertifiziert',
        'fsc_sub': 'Nachhaltiges und verantwortungsvoll beschafftes Buchenholz',
        'team_title': 'Unser Engagiertes Team',
        'team_sub': 'Höchste Handwerkskunst und verlässliche europaweite Lieferung',
        'outro_title': 'Ihr Verlässlicher B2B-Partner für Buchenholz',
        'outro_sub': 'www.palromproducts.com  •  office@palromproducts.ro',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Zertifizierter Buchenholzhersteller • Brad, Rumänien', 'w': 1200},
            {'title': 'Nachhaltiger Holzeinschlag & Rundholzlager', 'sub': 'Ausgewählte Buchenstämme auf unserem weitläufigen Werksgelände', 'w': 1280},
            {'title': 'Präzisionsverarbeitung in Aktion', 'sub': 'Fortschrittliche europäische Technologie & rumänische Handwerkskunst', 'w': 1280},
            {'title': 'Konditionierte Lagerung & Freilufttrocknung', 'sub': 'Natürliche Freilufttrocknung (Air Dried - AD) und optimale Holzlagerung', 'w': 1280},
            {'title': 'Individuelle B2B-Holzprodukte', 'sub': 'Kanteln, gehobelte Leisten, Rundstäbe und Sonderprofile', 'w': 1250}
        ]
    },
    'ro': {
        'total_dur': 56.0,
        'durs': [9.3, 6.2, 7.0, 6.6, 10.7, 8.1, 8.1],
        'fsc_dur': 3.1,
        'team_dur': 5.8,
        'fsc_title': 'Certificare FSC® 100%',
        'fsc_sub': 'Lemn de fag sustenabil din păduri gestionate responsabil',
        'team_title': 'Echipa Noastră Dedicată',
        'team_sub': 'Măiestrie dedicată calității și livrărilor prompte în toată Europa',
        'outro_title': 'Partenerul Dumneavoastră B2B de Încredere în Lemn de Fag',
        'outro_sub': 'www.palromproducts.com  •  office@palromproducts.ro',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'Producător de Lemn de Fag Certificat FSC® • Brad, România', 'w': 1220},
            {'title': 'Recoltare Sustenabilă & Depozitul de Bușteni', 'sub': 'Bușteni de fag din surse locale sosiți în depozitele noastre moderne', 'w': 1250},
            {'title': 'Prelucrare de Precizie în Acțiune', 'sub': 'Tehnologie europeană de top și măiestrie românească dedicată', 'w': 1250},
            {'title': 'Depozitare Condiționată & Uscare Naturală', 'sub': 'Uscare naturală la aer (Air Dried - AD) și depozitare condiționată', 'w': 1280},
            {'title': 'Produse B2B la Comandă', 'sub': 'Elemente, șipci rindeluite, tije netede și profile personalizate', 'w': 1250}
        ]
    }
}

def render_scene_base(img_path, title, subtitle, duration, out_path, w_box=1200):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', img_path,
        '-i', WATERMARK_SHARP_PATH,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_truck(img_path, title, subtitle, duration, out_path, w_box=1250):
    # Authentic Palrom Log Truck shot - FULL SCREEN BEELDVULLEND without blurred sidebars
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080:(in_w-out_w)/2:(in_h-out_h)*0.55[base];"
        "[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', img_path,
        '-i', WATERMARK_SHARP_PATH,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

# DRONE VIDEO CLIPS FROM AUTHENTIC FACTORY FLY-THROUGH
DRONE_SOURCE = os.path.abspath('public/videos/palrom_drone_source.mp4') if os.path.exists('public/videos/palrom_drone_source.mp4') else os.path.join(SCRATCH, 'palrom_youtube_full.mp4.webm')
CLIP_AERIAL = os.path.join(SCRATCH, 'clip_drone_aerial_factory.mp4')
CLIP_HALL = os.path.join(SCRATCH, 'clip_drone_hall_flythrough.mp4')
CLIP_DROOGKAMERS = os.path.join(SCRATCH, 'clip_drone_droogkamers.mp4')

CONFIG_JSON_PATH = os.path.abspath('src/data/video_scenes_config.json')
custom_config = {}
if os.path.exists(CONFIG_JSON_PATH):
    try:
        with open(CONFIG_JSON_PATH, 'r', encoding='utf-8') as f:
            custom_config = json.load(f)
            print("Loaded custom video configuration from:", CONFIG_JSON_PATH)
    except Exception as e:
        print("Warning loading video config:", e)

# Drone clip start positions
s1_start = custom_config.get('clips', {}).get('scene1_drone_start', 146.0)
s2_start = custom_config.get('clips', {}).get('scene2_drone_start', 42.0)
s3_start = custom_config.get('clips', {}).get('scene3_drone_start', 20.8)
s4_start = custom_config.get('clips', {}).get('scene4_drone_start', 101.8)

# Also update text definitions per language if provided in custom_config
if 'scenes' in custom_config:
    for sc in custom_config['scenes']:
        sc_id = sc.get('id')
        if not sc_id: continue
        sc_idx = sc_id - 1
        for lang_code in ['en', 'nl', 'de', 'ro']:
            if lang_code in sc.get('texts', {}):
                t_obj = sc['texts'][lang_code]
                if sc_id <= 5 and sc_idx < len(scenes_config[lang_code]['scenes']):
                    if 'title' in t_obj:
                        scenes_config[lang_code]['scenes'][sc_idx]['title'] = t_obj['title']
                    if 'sub' in t_obj:
                        scenes_config[lang_code]['scenes'][sc_idx]['sub'] = t_obj['sub']
                elif sc_id == 6:
                    if 'title' in t_obj:
                        scenes_config[lang_code]['team_title'] = t_obj['title']
                    if 'sub' in t_obj:
                        scenes_config[lang_code]['team_sub'] = t_obj['sub']
                elif sc_id == 7:
                    if 'title' in t_obj:
                        scenes_config[lang_code]['outro_title'] = t_obj['title']
                    if 'sub' in t_obj:
                        scenes_config[lang_code]['outro_sub'] = t_obj['sub']

def ensure_drone_clips():
    if not os.path.exists(DRONE_SOURCE):
        return
    print(f"Extracting clips: S1={s1_start}s, S3={s3_start}s, S4={s4_start}s")
    run_cmd([
        FFMPEG, '-y', '-ss', str(s1_start), '-t', '15', '-i', DRONE_SOURCE,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-an', CLIP_AERIAL
    ])
    run_cmd([
        FFMPEG, '-y', '-ss', str(s3_start), '-t', '11', '-i', DRONE_SOURCE,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-an', CLIP_HALL
    ])
    run_cmd([
        FFMPEG, '-y', '-ss', str(s4_start), '-t', '15', '-i', DRONE_SOURCE,
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-an', CLIP_DROOGKAMERS
    ])

ensure_drone_clips()

def render_scene_factory_flyin_42(title, subtitle, duration, out_path, w_box=1250):
    # Scene 2: Authentic Palrom factory fly-in entering hall from 0:42
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        f"[0:v]trim=start={s2_start}:duration={duration},setpts=PTS-STARTPTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-i', DRONE_SOURCE,
        '-i', WATERMARK_SHARP_PATH,
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-t', str(duration),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_saw_machine_cut(title, subtitle, duration, out_path, w_box=1250):
    # Scene 3: Authentic Palrom Saw Machine with Advanced CAS (Contrast Adaptive Sharpening) + Lanczos
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    raw_cut_dur = 8.5
    speed_factor = round(duration / raw_cut_dur, 4)
    s_filter = (
        f"[0:v]setpts={speed_factor}*PTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos+accurate_rnd,"
        f"crop=1920:1080:(in_w-out_w)/2:(in_h-out_h)*0.45,"
        f"cas=strength=0.88,unsharp=5:5:0.8:3:3:0.4,eq=contrast=1.08:brightness=0.01:saturation=1.08[saw_fs];"
        f"[saw_fs][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-ss', '2.0', '-t', str(raw_cut_dur),
        '-i', 'public/images/production-video.mp4',
        '-i', WATERMARK_SHARP_PATH,
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-t', str(duration),
        '-c:v', 'libx264', '-crf', '16', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_droogkamers_slowmo(title, subtitle, duration, out_path, w_box=1260):
    # Scene 4: Nardi drying kilns in cinematic SLOW MOTION, breaking off at the last door (no covered stacks)
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    start_time = 101.8
    end_time = 107.8 # Breaks off at the last door before the covered lumber stacks!
    raw_dur = round(end_time - start_time, 2) # 6.0 seconds
    slowmo_factor = duration / raw_dur
    s_filter = (
        f"[0:v]setpts={slowmo_factor}*PTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-ss', str(start_time), '-t', str(raw_dur),
        '-i', DRONE_SOURCE,
        '-i', WATERMARK_SHARP_PATH,
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-t', str(duration),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_video(vid_path, title, subtitle, duration, out_path, w_box=1250):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5[bg];"
        "[0:v]scale=-1:1080[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[combined];"
        "[combined][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-stream_loop', '2', '-i', vid_path,
        '-i', WATERMARK_SHARP_PATH,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_widescreen_video(vid_path, title, subtitle, duration, out_path, w_box=1250):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        "[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-stream_loop', '2', '-i', vid_path,
        '-i', WATERMARK_SHARP_PATH,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_fsc_and_team_scene(lang, cfg, out_path):
    # 1. Render Pure White FSC logo on dark anthracite background with prominent top heading
    fsc_clip = os.path.join(SCRATCH, f'clip_fsc_{lang}.mp4')
    esc_ft = escape_txt(cfg['fsc_title'])
    esc_fs = escape_txt(cfg['fsc_sub'])
    top_headings = {
        'nl': 'DUURZAAMHEID & KWALITEIT',
        'en': 'SUSTAINABILITY & QUALITY',
        'de': 'NACHHALTIGKEIT & QUALITÄT',
        'ro': 'SUSTENABILITATE & CALITATE'
    }
    esc_th = escape_txt(top_headings.get(lang, 'DUURZAAMHEID & KWALITEIT'))

    s_fsc_filter = (
        f"[0:v][1:v]overlay=(W-w)/2:(H-h)/2-40[with_fsc];"
        f"[with_fsc][2:v]overlay=52:37[with_logo];"
        f"[with_logo]drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_th}':fontcolor={COLOR_GOLD}:fontsize=38:x=(w-text_w)/2:y=180[with_head];"
        f"[with_head]drawbox=x=60:y=880:w=1200:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_ft}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_fs}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-f', 'lavfi', '-i', f'color=c={COLOR_ANTHRACITE_OUTRO}:s=1920x1080:d={cfg["fsc_dur"]}',
        '-loop', '1', '-i', FSC_WHITE_PATH,
        '-i', WATERMARK_SHARP_PATH,
        '-filter_complex', s_fsc_filter,
        '-map', '[out]',
        '-t', str(cfg['fsc_dur']),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        fsc_clip
    ])
    
    # 2. Render Team photo clip with playful name tags
    team_clip = os.path.join(SCRATCH, f'clip_team_{lang}.mp4')
    esc_tt = escape_txt(cfg['team_title'])
    esc_ts = escape_txt(cfg['team_sub'])
    team_photo_path = f'public/images/team_group_photo_{lang}.png'
    if not os.path.exists(team_photo_path):
        team_photo_path = 'public/images/team_group_photo.png'

    s_team_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        "[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w=1250:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_tt}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_ts}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', team_photo_path,
        '-i', WATERMARK_SHARP_PATH,
        '-t', str(cfg['team_dur']),
        '-filter_complex', s_team_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        team_clip
    ])
    
    # 3. Crossfade (xfade) FSC -> Team over 0.8s
    offset = round(cfg['fsc_dur'] - 0.8, 2)
    run_cmd([
        FFMPEG, '-y',
        '-i', fsc_clip,
        '-i', team_clip,
        '-filter_complex', f'xfade=transition=fade:duration=0.8:offset={offset}',
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_outro(lang, duration, out_path, cfg):
    # Outro uses the razor-sharp INVERSE logo directly on dark anthracite background!
    esc_t = escape_txt(cfg['outro_title'])
    esc_s = escape_txt(cfg['outro_sub'])
    s_filter = (
        f"color=c={COLOR_ANTHRACITE_OUTRO}:s=1920x1080:d={duration}[bg];"
        "[bg][1:v]overlay=(W-w)/2:280[with_logo];"
        f"[with_logo]drawbox=x=(1920-650)/2:y=540:w=650:h=4:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':expansion=none:text='{esc_t}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=580,"
        f"drawtext=fontfile='{FONT_REG}':expansion=none:text='{esc_s}':fontcolor=0xd4d4d4:fontsize=28:x=(w-text_w)/2:y=650[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-f', 'lavfi', '-i', f'color=c={COLOR_ANTHRACITE_OUTRO}:s=1920x1080:d={duration}',
        '-i', LOGO_INVERSE_SHARP_PATH,
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-t', str(duration),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'medium', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

# Build requested languages or all 4
target_langs = [args.lang] if args.lang in scenes_config else list(scenes_config.keys())
print(f"Target languages to render: {target_langs}")

for lang in target_langs:
    cfg = scenes_config[lang]
    print(f"\n==========================================")
    print(f"--- RENDERING CRISP HIGH-DEF CORPORATE VIDEO: {lang.upper()} ({cfg['total_dur']}s) ---")
    print(f"==========================================")
    
    durs = cfg['durs']
    scenes = cfg['scenes']
    
    # 1. Scene 1: Grand Aerial Drone Shot of the entire Palrom factory complex in Brad
    s1_out = os.path.join(SCRATCH, f's1_{lang}.mp4')
    if os.path.exists(CLIP_AERIAL):
        render_scene_widescreen_video(CLIP_AERIAL, scenes[0]['title'], scenes[0]['sub'], durs[0], s1_out, scenes[0]['w'])
    else:
        render_scene_base('public/images/hero_bg.jpg', scenes[0]['title'], scenes[0]['sub'], durs[0], s1_out, scenes[0]['w'])
    
    # 2. Scene 2: Authentic Palrom factory fly-in entering hall from 0:42
    s2_out = os.path.join(SCRATCH, f's2_{lang}.mp4')
    render_scene_factory_flyin_42(scenes[1]['title'], scenes[1]['sub'], durs[1], s2_out, scenes[1]['w'])
    
    # 3. Scene 3: Authentic Live Saw Machine cutting beechwood FULL SCREEN (starts at 2.0s, shows whole cut)
    s3_out = os.path.join(SCRATCH, f's3_{lang}.mp4')
    render_scene_saw_machine_cut(scenes[2]['title'], scenes[2]['sub'], durs[2], s3_out, scenes[2]['w'])
    
    # 4. Scene 4: Authentic Drone shot of Droogkamers in SLOW MOTION (breaking off at the last door)
    s4_out = os.path.join(SCRATCH, f's4_{lang}.mp4')
    render_scene_droogkamers_slowmo(scenes[3]['title'], scenes[3]['sub'], durs[3], s4_out, scenes[3]['w'])
    
    # 5. Scene 5 (Products Showcase Card)
    s5_out = os.path.join(SCRATCH, f's5_{lang}.mp4')
    card_img = os.path.join(SCRATCH, f'products_showcase_{lang}.png')
    render_scene_base(card_img, scenes[4]['title'], scenes[4]['sub'], durs[4], s5_out, scenes[4]['w'])
    
    # 6. Scene 6 (FSC Oplichten & Groot Worden -> Overgaan in Team!)
    s6_out = os.path.join(SCRATCH, f's6_{lang}.mp4')
    render_fsc_and_team_scene(lang, cfg, s6_out)
    
    # 7. Scene 7 (Outro with Razor-Sharp Inverse Logo)
    s7_out = os.path.join(SCRATCH, f's7_{lang}.mp4')
    render_scene_outro(lang, durs[6], s7_out, cfg)
    
    # Concatenate scenes
    concat_txt = os.path.join(SCRATCH, f'concat_{lang}.txt')
    with open(concat_txt, 'w') as f:
        for i in range(1, 8):
            f.write(f"file '{os.path.join(SCRATCH, f's{i}_{lang}.mp4')}'\n")
            
    raw_video = os.path.join(SCRATCH, f'raw_{lang}.mp4')
    run_cmd([
        FFMPEG, '-y', '-f', 'concat', '-safe', '0', '-i', concat_txt,
        '-c', 'copy', raw_video
    ])
    
    # Mix audio with 800ms lead-in, perfectly synchronizing every cut with sentence pauses
    total_dur = cfg['total_dur']
    fade_start = total_dur - 3.5
    vo_path = os.path.join(SCRATCH, f'voiceover_{lang}_full.mp3')
    bgm_path = os.path.join(SCRATCH, 'inspired.mp3')
    
    audio_filter = (
        f"[1:a]adelay=800|800,volume=1.25,apad=whole_dur={total_dur}[vo];"
        f"[2:a]volume=0.13,atrim=0:{total_dur},afade=t=out:st={fade_start}:d=3.5[bgm];"
        f"[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]"
    )
    
    final_output = os.path.abspath(f'public/images/palrom-corporate-video-{lang}.mp4')
    run_cmd([
        FFMPEG, '-y',
        '-i', raw_video,
        '-i', vo_path,
        '-i', bgm_path,
        '-filter_complex', audio_filter,
        '-map', '0:v',
        '-map', '[aout]',
        '-c:v', 'copy',
        '-c:a', 'aac',
        '-b:a', '192k',
        '-movflags', '+faststart',
        '-t', str(total_dur),
        final_output
    ])
    
    size_mb = os.path.getsize(final_output) / (1024 * 1024)
    print(f"SUCCESS: Rendered {final_output} ({size_mb:.2f} MB)")

# Copy NL to default palrom-corporate-video.mp4 as primary fallback if available
nl_path = os.path.abspath('public/images/palrom-corporate-video-nl.mp4')
if os.path.exists(nl_path):
    shutil.copyfile(nl_path, os.path.abspath('public/images/palrom-corporate-video.mp4'))
print("Finished rendering specified corporate videos with optuned razor-sharp logos!")
