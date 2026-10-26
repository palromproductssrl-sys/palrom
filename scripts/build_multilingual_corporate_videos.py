import os
import subprocess
import shutil
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

FFMPEG = os.path.abspath('node_modules/ffmpeg-static/ffmpeg')
FONT_BOLD = os.path.abspath('public/fonts/Roboto-Bold.ttf')
FONT_REG = os.path.abspath('public/fonts/Roboto-Regular.ttf')
LOGO_WHITE = os.path.abspath('public/images/logo_white.png')
FSC_LOGO = os.path.abspath('public/images/fsc_logo.png')

# BRAND COLOR PALETTE: Dark Anthracite Black + Palrom Gold
COLOR_ANTHRACITE_BOX = '0x16181b@0.95'      # Modern dark anthracite black for lower thirds
COLOR_ANTHRACITE_OUTRO = '0x141517'         # Solid dark anthracite black background for outro
COLOR_ANTHRACITE_TEXT = (24, 26, 28)        # Dark anthracite for product titles
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

# 1. Product Cards in 4 languages
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
    print(f"Generated product showcase card for {lang}: {card_path}")

# Load and prepare FSC logo for animation
fsc_img = Image.open(FSC_LOGO).convert('RGBA')
fsc_cropped = fsc_img.crop(fsc_img.getbbox())
base_bw, base_bh = 460, 530

fsc_badge_texts = {
    'en': ('100% CERTIFIED BEECHWOOD', 'Responsible Forest Management'),
    'nl': ('100% GECERTIFICEERD BEUKENHOUT', 'Verantwoord Bosbeheer'),
    'de': ('100% ZERTIFIZIERTES BUCHENHOLZ', 'Verantwortungsvolle Waldwirtschaft'),
    'ro': ('100% FAG CERTIFICAT FSC®', 'Păduri Gestionate Responsabil')
}

def generate_fsc_frames(lang, duration, fps=30):
    n_frames = int(duration * fps)
    frames_dir = os.path.join(SCRATCH, f'fsc_frames_{lang}')
    os.makedirs(frames_dir, exist_ok=True)
    badge_t, badge_s = fsc_badge_texts.get(lang, fsc_badge_texts['en'])
    
    W, H = 1920, 1080
    for i in range(n_frames):
        progress = i / max(1, n_frames - 1)
        # Ease in-out for natural camera zoom
        ease = 0.5 - 0.5 * math.cos(progress * math.pi)
        scale = 0.88 + 0.36 * ease
        glow_alpha = int(40 + 200 * (progress ** 1.15))
        glow_radius = int(50 + 95 * progress)
        
        canvas = Image.new('RGBA', (W, H), (22, 24, 27, 255))
        bw = int(base_bw * scale)
        bh = int(base_bh * scale)
        bx = (W - bw) // 2
        by = (H - bh) // 2 - 50
        
        # Radiant golden bloom aura
        glow_layer = Image.new('RGBA', (W, H), (0, 0, 0, 0))
        gdraw = ImageDraw.Draw(glow_layer)
        gdraw.ellipse([bx - glow_radius, by - glow_radius, bx + bw + glow_radius, by + bh + glow_radius], 
                      fill=(231, 177, 36, min(255, glow_alpha)))
        inner_r = int(glow_radius * 0.55)
        gdraw.ellipse([bx - inner_r, by - inner_r, bx + bw + inner_r, by + bh + inner_r], 
                      fill=(255, 248, 220, min(255, int(glow_alpha * 0.75))))
        glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(int(35 + 28 * progress)))
        canvas.alpha_composite(glow_layer)
        
        # Badge card
        draw = ImageDraw.Draw(canvas)
        draw.rounded_rectangle([bx, by, bx + bw, by + bh], radius=int(22 * scale), fill=(255, 255, 255, 252), outline=(231, 177, 36), width=int(4 * scale))
        
        # FSC Logo inside badge
        fsc_w = int(320 * scale)
        fsc_h = int(fsc_cropped.height * (fsc_w / fsc_cropped.width))
        fsc_resized = fsc_cropped.resize((fsc_w, fsc_h), Image.Resampling.LANCZOS)
        fx = bx + (bw - fsc_w) // 2
        fy = by + int(32 * scale)
        canvas.paste(fsc_resized, (fx, fy), fsc_resized)
        
        # Text on badge
        f_t = ImageFont.truetype(FONT_BOLD, max(14, int(20 * scale)))
        f_s = ImageFont.truetype(FONT_REG, max(11, int(15 * scale)))
        draw.text((bx + bw // 2, by + fsc_h + int(55 * scale)), badge_t, font=f_t, fill=(30, 41, 59), anchor='mm')
        draw.text((bx + bw // 2, by + fsc_h + int(82 * scale)), badge_s, font=f_s, fill=(100, 116, 139), anchor='mm')
        
        out_fn = os.path.join(frames_dir, f'frame_{i:04d}.png')
        canvas.convert('RGB').save(out_fn)
        
    return frames_dir, n_frames

# Scene text definitions per language
scenes_config = {
    'en': {
        'total_dur': 52.0,
        'durs': [9.5, 5.5, 6.5, 8.0, 9.0, 7.0, 6.5],
        'fsc_dur': 2.8,
        'team_dur': 5.0,   # xfade duration 0.8s -> total 7.0s
        'fsc_title': 'FSC® 100% Certified',
        'fsc_sub': 'Guaranteed sustainable and responsibly harvested beechwood',
        'team_title': 'Our Dedicated Team',
        'team_sub': 'Decades of woodworking expertise & dependable European delivery',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Certified Beechwood Manufacturer • Brad, Romania', 'w': 1180},
            {'title': 'Sustainable Harvesting & Raw Timber', 'sub': 'Locally sourced beech logs arriving at our extensive storage yards', 'w': 1250},
            {'title': 'Precision Milling in Action', 'sub': 'Advanced European technology & dedicated Romanian craftsmanship', 'w': 1250},
            {'title': 'Controlled Steaming & Kiln Drying', 'sub': 'Computerized chamber drying precisely to 8–12% moisture', 'w': 1180},
            {'title': 'Custom B2B Products', 'sub': 'Blanks, planed slats, smooth dowels, and tailored profiles', 'w': 1250},
            # Scene 6 is handled specially (FSC -> Team crossfade)
            {},
            {'title': 'Your Trusted B2B Partner in Sustainable Beechwood', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 700}
        ]
    },
    'nl': {
        'total_dur': 55.5,
        'durs': [9.0, 6.5, 7.5, 9.0, 9.5, 7.5, 6.5],
        'fsc_dur': 3.2,
        'team_dur': 5.1,   # xfade duration 0.8s -> total 7.5s
        'fsc_title': 'FSC® 100% Gecertificeerd',
        'fsc_sub': 'Gegarandeerd duurzaam en verantwoord beukenhout',
        'team_title': 'Ons Toegewijde Team',
        'team_sub': 'Vakmanschap en betrouwbare B2B-leveringen in heel Europa',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Gecertificeerde Beukenhoutproducent • Brad, Roemenië', 'w': 1200},
            {'title': 'Duurzame Oogst & Houtopslag', 'sub': 'Lokaal geoogste beukenstammen arriveren op onze ruime voorraadwerf', 'w': 1250},
            {'title': 'Precisiebewerking in Actie', 'sub': 'Geavanceerde Europese machines & Roemeens vakmanschap', 'w': 1220},
            {'title': 'Geconditioneerd Stomen & Drogen', 'sub': 'Geautomatiseerde droogkamers met droging tot 8–12% vochtigheid', 'w': 1260},
            {'title': 'B2B Maatwerk Producten', 'sub': 'Blanks, geschaafde latten, gladde stokken en maatwerk profielen', 'w': 1260},
            {},
            {'title': 'Uw Betrouwbare B2B Partner in Duurzaam Beukenhout', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 720}
        ]
    },
    'de': {
        'total_dur': 60.0,
        'durs': [9.8, 7.0, 7.0, 10.5, 9.5, 9.0, 7.2],
        'fsc_dur': 3.5,
        'team_dur': 6.3,   # xfade duration 0.8s -> total 9.0s
        'fsc_title': 'FSC® 100% Zertifiziert',
        'fsc_sub': 'Nachhaltiges und verantwortungsvoll beschafftes Buchenholz',
        'team_title': 'Unser Engagiertes Team',
        'team_sub': 'Höchste Handwerkskunst und verlässliche europaweite Lieferung',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Zertifizierter Buchenholzhersteller • Brad, Rumänien', 'w': 1200},
            {'title': 'Nachhaltiger Holzeinschlag & Rundholzlager', 'sub': 'Ausgewählte Buchenstämme auf unserem weitläufigen Werksgelände', 'w': 1280},
            {'title': 'Präzisionsverarbeitung in Aktion', 'sub': 'Fortschrittliche europäische Technologie & rumänische Handwerkskunst', 'w': 1280},
            {'title': 'Gesteuerte Dämpfung & Kammertrocknung', 'sub': 'Computergesteuerte Trocknung präzise auf 8–12% Restfeuchte', 'w': 1220},
            {'title': 'Individuelle B2B-Holzprodukte', 'sub': 'Kanteln, gehobelte Leisten, Rundstäbe und Sonderprofile', 'w': 1250},
            {},
            {'title': 'Ihr Verlässlicher B2B-Partner für Buchenholz', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 720}
        ]
    },
    'ro': {
        'total_dur': 54.5,
        'durs': [9.0, 6.0, 7.5, 9.5, 9.0, 7.0, 6.5],
        'fsc_dur': 3.0,
        'team_dur': 4.8,   # xfade duration 0.8s -> total 7.0s
        'fsc_title': 'Certificare FSC® 100%',
        'fsc_sub': 'Lemn de fag sustenabil din păduri gestionate responsabil',
        'team_title': 'Echipa Noastră Dedicată',
        'team_sub': 'Măiestrie dedicată calității și livrărilor prompte în toată Europa',
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'Producător de Lemn de Fag Certificat FSC® • Brad, România', 'w': 1220},
            {'title': 'Recoltare Sustenabilă & Depozitul de Bușteni', 'sub': 'Bușteni de fag din surse locale sosiți în depozitele noastre moderne', 'w': 1250},
            {'title': 'Prelucrare de Precizie în Acțiune', 'sub': 'Tehnologie europeană de top și măiestrie românească dedicată', 'w': 1250},
            {'title': 'Aburire Controlată & Uscare în Camere', 'sub': 'Uscare computerizată precisă la o umiditate de 8–12%', 'w': 1200},
            {'title': 'Produse B2B la Comandă', 'sub': 'Elemente, șipci rindeluite, tije netede și profile personalizate', 'w': 1250},
            {},
            {'title': 'Partenerul Dumneavoastră B2B de Încredere în Lemn de Fag', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 750}
        ]
    }
}

def render_scene_base(img_path, title, subtitle, duration, out_path, w_box=1200):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        f"[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        f"[1:v]scale=-1:55[logo];"
        f"[base][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', img_path,
        '-i', LOGO_WHITE,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_truck(img_path, title, subtitle, duration, out_path, w_box=1250):
    # Authentic Palrom Log Truck shot with widescreen background blur
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=25:5[bg];"
        "[0:v]scale=-1:1080[fg];"
        "[bg][fg]overlay=(W-w)/2:0[combined];"
        "[1:v]scale=-1:55[logo];"
        "[combined][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', img_path,
        '-i', LOGO_WHITE,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_video(vid_path, title, subtitle, duration, out_path, w_box=1250):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,boxblur=20:5[bg];"
        "[0:v]scale=-1:1080[fg];"
        "[bg][fg]overlay=(W-w)/2:(H-h)/2[combined];"
        "[1:v]scale=-1:55[logo];"
        "[combined][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w={w_box}:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_t}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_s}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-stream_loop', '2', '-i', vid_path,
        '-i', LOGO_WHITE,
        '-t', str(duration),
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_fsc_and_team_scene(lang, cfg, out_path):
    print(f"Generating FSC animated sequence for {lang} ({cfg['fsc_dur']}s)...")
    frames_dir, _ = generate_fsc_frames(lang, cfg['fsc_dur'])
    
    # 1. Render FSC growing & glowing clip
    fsc_clip = os.path.join(SCRATCH, f'clip_fsc_{lang}.mp4')
    esc_ft = escape_txt(cfg['fsc_title'])
    esc_fs = escape_txt(cfg['fsc_sub'])
    s_fsc_filter = (
        "[0:v]scale=1920:1080[base];"
        "[1:v]scale=-1:55[logo];"
        "[base][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w=1200:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_ft}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_fs}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-framerate', '30',
        '-i', os.path.join(frames_dir, 'frame_%04d.png'),
        '-i', LOGO_WHITE,
        '-filter_complex', s_fsc_filter,
        '-map', '[out]',
        '-t', str(cfg['fsc_dur']),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        fsc_clip
    ])
    
    # 2. Render Team photo clip
    team_clip = os.path.join(SCRATCH, f'clip_team_{lang}.mp4')
    esc_tt = escape_txt(cfg['team_title'])
    esc_ts = escape_txt(cfg['team_sub'])
    s_team_filter = (
        "[0:v]scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080[base];"
        "[1:v]scale=-1:55[logo];"
        "[base][logo]overlay=60:45[with_logo];"
        f"[with_logo]drawbox=x=60:y=880:w=1250:h=130:color={COLOR_ANTHRACITE_BOX}:t=fill,"
        f"drawbox=x=60:y=880:w=6:h=130:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_tt}':fontcolor={COLOR_GOLD}:fontsize=36:x=85:y=905,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_ts}':fontcolor=white:fontsize=24:x=85:y=955[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-loop', '1', '-i', 'public/images/team_group_photo.png',
        '-i', LOGO_WHITE,
        '-t', str(cfg['team_dur']),
        '-filter_complex', s_team_filter,
        '-map', '[out]',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        team_clip
    ])
    
    # 3. Crossfade (xfade) FSC -> Team over 0.8s
    offset = round(cfg['fsc_dur'] - 0.8, 2)
    print(f"Crossfading FSC -> Team at offset {offset}s...")
    run_cmd([
        FFMPEG, '-y',
        '-i', fsc_clip,
        '-i', team_clip,
        '-filter_complex', f'xfade=transition=fade:duration=0.8:offset={offset}',
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

def render_scene_outro(title, subtitle, duration, out_path):
    esc_t = escape_txt(title)
    esc_s = escape_txt(subtitle)
    s_filter = (
        f"color=c={COLOR_ANTHRACITE_OUTRO}:s=1920x1080:d={duration}[bg];"
        "[1:v]scale=560:-1[logo];"
        "[bg][logo]overlay=(W-w)/2:280[with_logo];"
        f"[with_logo]drawbox=x=(1920-650)/2:y=540:w=650:h=4:color={COLOR_GOLD}:t=fill,"
        f"drawtext=fontfile='{FONT_BOLD}':text='{esc_t}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=580,"
        f"drawtext=fontfile='{FONT_REG}':text='{esc_s}':fontcolor=0xd4d4d4:fontsize=28:x=(w-text_w)/2:y=650[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-f', 'lavfi', '-i', f'color=c={COLOR_ANTHRACITE_OUTRO}:s=1920x1080:d={duration}',
        '-i', LOGO_WHITE,
        '-filter_complex', s_filter,
        '-map', '[out]',
        '-t', str(duration),
        '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-r', '30',
        out_path
    ])

# Build all 4 languages!
for lang, cfg in scenes_config.items():
    print(f"\n==========================================")
    print(f"--- RENDERING CORPORATE VIDEO: {lang.upper()} ({cfg['total_dur']}s) ---")
    print(f"==========================================")
    
    durs = cfg['durs']
    scenes = cfg['scenes']
    
    # 1. Scene 1 (hero_bg.jpg)
    s1_out = os.path.join(SCRATCH, f's1_{lang}.mp4')
    render_scene_base('public/images/hero_bg.jpg', scenes[0]['title'], scenes[0]['sub'], durs[0], s1_out, scenes[0]['w'])
    
    # 2. Scene 2 (palrom_log_truck_yard.jpg - Newly uploaded authentic photo!)
    s2_out = os.path.join(SCRATCH, f's2_{lang}.mp4')
    truck_img = 'public/images/palrom_log_truck_yard.jpg' if os.path.exists('public/images/palrom_log_truck_yard.jpg') else 'public/images/7.png'
    render_scene_truck(truck_img, scenes[1]['title'], scenes[1]['sub'], durs[1], s2_out, scenes[1]['w'])
    
    # 3. Scene 3 (production-video.mp4)
    s3_out = os.path.join(SCRATCH, f's3_{lang}.mp4')
    render_scene_video('public/images/production-video.mp4', scenes[2]['title'], scenes[2]['sub'], durs[2], s3_out, scenes[2]['w'])
    
    # 4. Scene 4 (kilns.jpg)
    s4_out = os.path.join(SCRATCH, f's4_{lang}.mp4')
    render_scene_base('public/images/kilns.jpg', scenes[3]['title'], scenes[3]['sub'], durs[3], s4_out, scenes[3]['w'])
    
    # 5. Scene 5 (Products Showcase Card)
    s5_out = os.path.join(SCRATCH, f's5_{lang}.mp4')
    card_img = os.path.join(SCRATCH, f'products_showcase_{lang}.png')
    render_scene_base(card_img, scenes[4]['title'], scenes[4]['sub'], durs[4], s5_out, scenes[4]['w'])
    
    # 6. Scene 6 (FSC Oplichten & Groot Worden -> Overgaan in Team!)
    s6_out = os.path.join(SCRATCH, f's6_{lang}.mp4')
    render_fsc_and_team_scene(lang, cfg, s6_out)
    
    # 7. Scene 7 (Outro)
    s7_out = os.path.join(SCRATCH, f's7_{lang}.mp4')
    render_scene_outro(scenes[6]['title'], scenes[6]['sub'], durs[6], s7_out)
    
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
    
    # Mix audio
    total_dur = cfg['total_dur']
    fade_start = total_dur - 3.5
    vo_path = os.path.join(SCRATCH, f'voiceover_{lang}_full.mp3')
    bgm_path = os.path.join(SCRATCH, 'inspired.mp3')
    
    audio_filter = (
        f"[1:a]adelay=1200|1200,volume=1.25,apad=whole_dur={total_dur}[vo];"
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
        '-t', str(total_dur),
        final_output
    ])
    
    size_mb = os.path.getsize(final_output) / (1024 * 1024)
    print(f"SUCCESS: Rendered {final_output} ({size_mb:.2f} MB)")

# Copy EN to default palrom-corporate-video.mp4 as fallback
shutil.copyfile(
    os.path.abspath('public/images/palrom-corporate-video-en.mp4'),
    os.path.abspath('public/images/palrom-corporate-video.mp4')
)
print("Finished rendering all 4 corporate videos with animated FSC -> Team transition!")
