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
        'total_dur': 49.0,
        # Speech groups: G1 (0.8-8.5s), G2 (9.0-13.0s), G3 (13.8-18.8s), G4 (19.6-26.2s), G5 (27.0-34.6s), G6 (35.4-41.2s), G7 (42.0-45.2s)
        'durs': [8.2, 4.8, 5.8, 3.4, 3.8, 8.6, 2.5, 4.1, 7.8],
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
        'total_dur': 62.0,
        # Speech groups: G1 (0.8-9.2s), G2 (9.8-16.8s), G3 (17.7-23.9s), G4 (24.7-31.8s), G5 (32.8-42.7s), G6 (43.5-51.2s), G7 (52.0-57.5s)
        'durs': [9.0, 7.6, 7.1, 3.6, 4.5, 10.9, 2.8, 5.5, 11.0],
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
        'total_dur': 56.0,
        # Speech groups: G1 (0.8-9.0s), G2 (9.5-15.2s), G3 (15.8-22.1s), G4 (22.8-28.8s), G5 (29.4-39.6s), G6 (40.1-47.6s), G7 (48.3-51.7s)
        'durs': [8.8, 6.2, 6.9, 3.4, 3.5, 10.8, 2.7, 4.9, 8.8],
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
    prod_card_base = make_product_card_4k(lang)
    logo_wm_prod = watermark_im.resize((int(watermark_im.width * 0.9), int(watermark_im.height * 0.9)), Image.Resampling.LANCZOS)
    s6_banner = make_static_banner_overlay(cfg['s6'][0], cfg['s6'][1], cfg['s6'][2])
    render_subpixel_ken_burns(
        base_img_4k=prod_card_base,
        duration=s6_dur,
        out_path=s6_path,
        zoom_start=1.0,
        zoom_end=1.03,
        watermark=logo_wm_prod,
        wm_pos=(60, 45),
        banner_overlay=s6_banner
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
    fade_start = round(total_dur - 3.5, 2)
    concat_inputs = "".join(f"[{i}:v]" for i in range(9))
    adelay_val = cfg.get('adelay_ms', 800)
    filter_complex = (
        f"{concat_inputs}concat=n=9:v=1:a=0[vcat];"
        f"[9:a]adelay={adelay_val}|{adelay_val},volume=1.25,apad=whole_dur={total_dur}[vo];"
        f"[10:a]volume=0.13,atrim=0:{total_dur},afade=t=out:st={fade_start}:d=3.5[bgm];"
        f"[vo][bgm]amix=inputs=2:duration=first:dropout_transition=2[aout]"
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
