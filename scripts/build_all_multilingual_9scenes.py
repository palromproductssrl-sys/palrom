import os
import subprocess
import time
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

COLOR_ANTHRACITE_BOX = '0x292929@0.95'
COLOR_GOLD = '0xe7b124'

DRAFT_DIR = os.path.abspath('scratch/draft_scenes')
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

# Base assets
# 1. Forest crane-up
forest_art_path = os.path.abspath('/Users/matthiasradder/.gemini/antigravity/brain/4f9024b4-d609-421a-b057-b180f987ffb5/forest_trees_ground_to_canopy_1793088740138.jpg')
forest_clip_path = os.path.join(DRAFT_DIR, 'clip_forest_ascend.mp4')

# 2. Base truck 4K
truck_im = Image.open(TRUCK_PHOTO_PATH)
tw, th = truck_im.size
base_truck = Image.new('RGB', (3840, 2160))
scale_bg = max(3840 / tw, 2160 / th)
bg_w = int(tw * scale_bg)
bg_h = int(th * scale_bg)
bg_resized = truck_im.resize((bg_w, bg_h), Image.Resampling.LANCZOS)
bg_crop = bg_resized.crop(((bg_w - 3840)//2, (bg_h - 2160)//2, (bg_w - 3840)//2 + 3840, (bg_h - 2160)//2 + 2160))
bg_blurred = bg_crop.filter(ImageFilter.GaussianBlur(40))
base_truck.paste(bg_blurred, (0, 0))
scale_fg = 2160 / th
fg_w = int(tw * scale_fg)
fg_resized = truck_im.resize((fg_w, 2160), Image.Resampling.LANCZOS)
base_truck.paste(fg_resized, ((3840 - fg_w)//2, 0))

# 3. Base team 4K
team_im = Image.open(TEAM_PHOTO_PATH)
tm_w, tm_h = team_im.size
scale_team = max(3840 / tm_w, 2160 / tm_h)
tm_w_scaled = int(tm_w * scale_team)
tm_h_scaled = int(tm_h * scale_team)
team_resized = team_im.resize((tm_w_scaled, tm_h_scaled), Image.Resampling.LANCZOS)
team_base_4k = team_resized.crop(((tm_w_scaled - 3840)//2, (tm_h_scaled - 2160)//2, (tm_w_scaled - 3840)//2 + 3840, (tm_h_scaled - 2160)//2 + 2160))

# Product data per language
product_data = {
    'en': {
        'badge': 'FSC® 100% Beech',
        'items': [
            ('beechwood_blanks.png', 'Beechwood Blanks', 'Thickness 20–67mm • Width 45–95mm'),
            ('planed_wood.png', 'Planed Lumber & Slats', '4-side planed • Millimeter precision'),
            ('dowels.png', 'Round & Grooved Rods', 'Diameter 3–60mm • Custom lengths'),
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

    p_data = product_data[lang]
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

def make_fsc_card_4k(header_text=None):
    fsc_base_4k = Image.new('RGB', (3840, 2160), (41, 41, 41))
    fsc_logo_im = Image.open(FSC_LOGO_PATH).convert('RGBA')
    fw_4k = 960
    fh_4k = int(fw_4k * fsc_logo_im.height / fsc_logo_im.width)
    fsc_logo_scaled = fsc_logo_im.resize((fw_4k, fh_4k), Image.Resampling.LANCZOS)
    fsc_base_4k.paste(fsc_logo_scaled, ((3840 - fw_4k) // 2, (2160 - fh_4k) // 2 - 40), fsc_logo_scaled)
    return fsc_base_4k

def make_outro_card_4k(title_text):
    outro_base_4k = Image.new('RGB', (3840, 2160), (41, 41, 41))
    logo_w_im = Image.open(LOGO_OUTRO_PATH).convert('RGBA')
    logo_w_4k = logo_w_im.resize((logo_w_im.width * 2, logo_w_im.height * 2), Image.Resampling.LANCZOS)
    outro_base_4k.paste(logo_w_4k, ((3840 - logo_w_4k.width) // 2, 560), logo_w_4k)

    draw_o = ImageDraw.Draw(outro_base_4k)
    draw_o.rectangle([(3840 - 1300) // 2, 1080, (3840 + 1300) // 2, 1088], fill=(231, 177, 36))

    f_ot_4k = ImageFont.truetype(FONT_BOLD, 72)
    f_os_4k = ImageFont.truetype(FONT_REG, 56)
    outro_sub = 'www.palromproducts.com  •  info@palromproducts.ro'

    bt = draw_o.textbbox((0, 0), title_text, font=f_ot_4k)
    tw = bt[2] - bt[0]
    draw_o.text(((3840 - tw) // 2, 1160), title_text, font=f_ot_4k, fill=(255, 255, 255))

    bs = draw_o.textbbox((0, 0), outro_sub, font=f_os_4k)
    sw = bs[2] - bs[0]
    draw_o.text(((3840 - sw) // 2, 1300), outro_sub, font=f_os_4k, fill=(212, 212, 212))
    return outro_base_4k

languages = {
    'en': {
        'total_dur': 49.0,
        'durs': [4.5, 3.8, 5.8, 6.4, 5.8, 9.5, 2.8, 4.2, 6.2],
        's1': ('Palrom Products', 'FSC® Certified Beechwood Manufacturer • Brad, Romania', 1200),
        's2': ('Sustainable Harvest & Log Storage', 'Locally harvested beech logs arriving at our extensive yard', 1250),
        's3': ('Precision Milling in Action', 'Advanced European sawing technology & Romanian craftsmanship', 1250),
        's4': ('Modern Processing Hall & Storage', 'Advanced production lines and finished sawn timber storage', 1260),
        's5': ('Advanced Drying Kilns', 'Computer-controlled Nardi drying chambers for stabilized moisture control', 1280),
        's6': ('Custom B2B Products', 'Blanks, planed slats, round and grooved rods, and tailored profiles', 1280),
        's7_head': 'SUSTAINABILITY & QUALITY',
        's7': ('FSC® 100% Certified', 'Guaranteed sustainable and responsibly harvested beechwood', 1220),
        's8': ('Our Dedicated Team', 'Decades of woodworking expertise & dependable European delivery', 1250),
        's9_title': 'Your Trusted B2B Partner in Sustainable Beechwood',
        'vo_file': 'scratch/voiceover_en_full.mp3'
    },
    'de': {
        'total_dur': 62.0,
        'durs': [5.0, 4.5, 7.5, 8.0, 7.0, 12.0, 3.2, 5.8, 9.0],
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
        'vo_file': 'scratch/voiceover_de_full.mp3'
    },
    'ro': {
        'total_dur': 56.0,
        'durs': [4.8, 4.0, 6.7, 7.3, 6.6, 10.9, 3.0, 4.9, 7.8],
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
        'vo_file': 'scratch/voiceover_ro_full.mp3'
    }
}

for lang, cfg in languages.items():
    print(f"\n==========================================")
    print(f"--- BUILDING CORPORATE VIDEO: {lang.upper()} ({cfg['total_dur']}s) ---")
    print(f"==========================================")
    
    durs = cfg['durs']
    lang_dir = os.path.join(DRAFT_DIR, lang)
    os.makedirs(lang_dir, exist_ok=True)
    
    # S1
    s1_dur = durs[0]
    s1_path = os.path.join(lang_dir, 's1.mp4')
    s1_filter = (
        f"[0:v]setpts=PTS-STARTPTS,fps=30,scale=1920:1080,setsar=1[v0];"
        f"[1:v]setpts=PTS-STARTPTS,fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[v1];"
        f"[v0][v1]xfade=transition=smoothup:duration=0.6:offset=1.4[merged];"
        f"[merged][2:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s1'][0], cfg['s1'][1], cfg['s1'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y',
        '-i', forest_clip_path,
        '-ss', '146.0', '-t', str(round(s1_dur - 1.4 + 0.6, 2)), '-i', DRONE_SOURCE,
        '-i', WATERMARK_PATH,
        '-filter_complex', s1_filter, '-map', '[out]', '-t', str(s1_dur),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s1_path
    ])
    
    # S2
    s2_path = os.path.join(lang_dir, 's2.mp4')
    s2_banner = make_static_banner_overlay(cfg['s2'][0], cfg['s2'][1], cfg['s2'][2])
    render_subpixel_ken_burns(base_truck, durs[1], s2_path, watermark=watermark_im, banner_overlay=s2_banner)
    
    # S3
    s3_path = os.path.join(lang_dir, 's3.mp4')
    raw_cut_dur = 8.5
    speed_factor = round(durs[2] / raw_cut_dur, 4)
    s3_filter = (
        f"[0:v]setpts={speed_factor}*PTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase:flags=lanczos+accurate_rnd,"
        f"crop=1920:1080:(in_w-out_w)/2:(in_h-out_h)*0.45,"
        f"cas=strength=0.88,unsharp=5:5:0.8:3:3:0.4,eq=contrast=1.08:brightness=0.01:saturation=1.08,setsar=1[saw_fs];"
        f"[saw_fs][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s3'][0], cfg['s3'][1], cfg['s3'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '2.0', '-t', str(raw_cut_dur), '-i', PROD_VIDEO, '-i', WATERMARK_PATH,
        '-filter_complex', s3_filter, '-map', '[out]', '-t', str(durs[2]),
        '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s3_path
    ])
    
    # S4
    s4_path = os.path.join(lang_dir, 's4.mp4')
    s4_filter = (
        f"[0:v]setpts=PTS-STARTPTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s4'][0], cfg['s4'][1], cfg['s4'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '42.0', '-t', str(durs[3]), '-i', DRONE_SOURCE, '-i', WATERMARK_PATH,
        '-filter_complex', s4_filter, '-map', '[out]', '-t', str(durs[3]),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s4_path
    ])
    
    # S5
    s5_path = os.path.join(lang_dir, 's5.mp4')
    raw_dur_kiln = 6.0
    slowmo_factor_kiln = durs[4] / raw_dur_kiln
    s5_filter = (
        f"[0:v]setpts={slowmo_factor_kiln}*PTS,fps=30,"
        f"scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,setsar=1[base];"
        f"[base][1:v]overlay=52:37[with_logo];"
        f"[with_logo]{render_banner_filter(cfg['s5'][0], cfg['s5'][1], cfg['s5'][2])}[out]"
    )
    run_cmd([
        FFMPEG, '-y', '-ss', '101.8', '-t', str(raw_dur_kiln), '-i', DRONE_SOURCE, '-i', WATERMARK_PATH,
        '-filter_complex', s5_filter, '-map', '[out]', '-t', str(durs[4]),
        '-c:v', 'libx264', '-crf', '18', '-preset', 'fast', '-pix_fmt', 'yuv420p',
        '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-r', '30',
        s5_path
    ])
    
    # S6
    s6_path = os.path.join(lang_dir, 's6.mp4')
    prod_4k = make_product_card_4k(lang)
    s6_banner = make_static_banner_overlay(cfg['s6'][0], cfg['s6'][1], cfg['s6'][2])
    logo_wm_prod = watermark_im.resize((int(watermark_im.width * 0.9), int(watermark_im.height * 0.9)), Image.Resampling.LANCZOS)
    render_subpixel_ken_burns(prod_4k, durs[5], s6_path, zoom_start=1.0, zoom_end=1.03, watermark=logo_wm_prod, wm_pos=(60, 45), banner_overlay=s6_banner)
    
    # S7
    s7_path = os.path.join(lang_dir, 's7.mp4')
    fsc_4k = make_fsc_card_4k(cfg['s7_head'])
    s7_banner = make_static_banner_overlay(cfg['s7'][0], cfg['s7'][1], cfg['s7'][2])
    render_subpixel_ken_burns(fsc_4k, durs[6], s7_path, zoom_start=1.0, zoom_end=1.04, watermark=watermark_im, banner_overlay=s7_banner)
    
    # S8
    s8_path = os.path.join(lang_dir, 's8.mp4')
    s8_banner = make_static_banner_overlay(cfg['s8'][0], cfg['s8'][1], cfg['s8'][2])
    render_subpixel_ken_burns(team_base_4k, durs[7], s8_path, zoom_start=1.0, zoom_end=1.05, pan_x_pct=0.5, pan_y_pct=0.4, watermark=watermark_im, banner_overlay=s8_banner)
    
    # S9
    s9_path = os.path.join(lang_dir, 's9.mp4')
    outro_4k = make_outro_card_4k(cfg['s9_title'])
    render_subpixel_ken_burns(outro_4k, durs[8], s9_path, zoom_start=1.0, zoom_end=1.025)
    
    # Concat
    total_dur = cfg['total_dur']
    fade_start = total_dur - 3.5
    concat_inputs = "".join(f"[{i}:v]" for i in range(9))
    filter_complex = (
        f"{concat_inputs}concat=n=9:v=1:a=0[vcat];"
        f"[9:a]adelay=800|800,volume=1.25,apad=whole_dur={total_dur}[vo];"
        f"[10:a]volume=0.13,atrim=0:{total_dur},afade=t=out:st={fade_start}:d=3.5[bgm];"
        f"[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]"
    )
    
    out_final = os.path.abspath(f'public/images/palrom-corporate-video-{lang}.mp4')
    bgm_path = os.path.abspath('scratch/inspired.mp3')
    vo_path = os.path.abspath(cfg['vo_file'])
    
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
        '-i', vo_path,
        '-i', bgm_path,
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
        out_final
    ]
    run_cmd(cmd_final)
    print(f"Successfully generated {out_final} ({os.path.getsize(out_final)/(1024*1024):.2f} MB)")

print("\nAll multilingual videos rendered successfully!")
