import os
import subprocess
import shutil
from PIL import Image, ImageDraw, ImageFont

FFMPEG = os.path.abspath('node_modules/ffmpeg-static/ffmpeg')
FONT_BOLD = os.path.abspath('public/fonts/Roboto-Bold.ttf')
FONT_REG = os.path.abspath('public/fonts/Roboto-Regular.ttf')
LOGO_WHITE = os.path.abspath('public/images/logo_white.png')

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

# Scene text definitions per language
scenes_config = {
    'en': {
        'total_dur': 52.0,
        'durs': [9.5, 5.5, 6.5, 8.0, 9.0, 7.0, 6.5],
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Certified Beechwood Manufacturer • Brad, Romania', 'w': 1180},
            {'title': 'Sustainable Harvesting & Primary Sawmill', 'sub': 'Locally sourced beechwood logs and automated breakdown lines', 'w': 1250},
            {'title': 'Precision Milling in Action', 'sub': 'Advanced European technology & dedicated Romanian craftsmanship', 'w': 1250},
            {'title': 'Controlled Steaming & Kiln Drying', 'sub': 'Computerized chamber drying precisely to 8–12% moisture', 'w': 1180},
            {'title': 'Custom B2B Products', 'sub': 'Blanks, planed slats, smooth dowels, and tailored profiles', 'w': 1250},
            {'title': 'Our Dedicated Team', 'sub': 'FSC® certified timber & reliable European B2B supply', 'w': 1120},
            {'title': 'Your Trusted B2B Partner in Sustainable Beechwood', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 700}
        ]
    },
    'nl': {
        'total_dur': 55.5,
        'durs': [9.0, 6.5, 7.5, 9.0, 9.5, 7.5, 6.5],
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Gecertificeerde Beukenhoutproducent • Brad, Roemenië', 'w': 1200},
            {'title': 'Duurzame Oogst & Eerste Zagerij', 'sub': 'Lokaal geoogste beukenstammen en geautomatiseerde zaaglijnen', 'w': 1220},
            {'title': 'Precisiebewerking in Actie', 'sub': 'Geavanceerde Europese machines & Roemeens vakmanschap', 'w': 1220},
            {'title': 'Geconditioneerd Stomen & Drogen', 'sub': 'Geautomatiseerde droogkamers met droging tot 8–12% vochtigheid', 'w': 1260},
            {'title': 'B2B Maatwerk Producten', 'sub': 'Blanks, geschaafde latten, gladde stokken en maatwerk profielen', 'w': 1260},
            {'title': 'Ons Toegewijde Team', 'sub': 'FSC® gecertificeerd hout & betrouwbare Europese leveringen', 'w': 1150},
            {'title': 'Uw Betrouwbare B2B Partner in Duurzaam Beukenhout', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 720}
        ]
    },
    'de': {
        'total_dur': 60.0,
        'durs': [9.8, 7.0, 7.0, 10.5, 9.5, 9.0, 7.2],
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'FSC® Zertifizierter Buchenholzhersteller • Brad, Rumänien', 'w': 1200},
            {'title': 'Nachhaltiger Holzeinschlag & Primärsägewerk', 'sub': 'Buchenrundholz aus nachhaltiger Beschaffung & moderne Sägelinien', 'w': 1280},
            {'title': 'Präzisionsverarbeitung in Aktion', 'sub': 'Fortschrittliche europäische Technologie & rumänische Handwerkskunst', 'w': 1280},
            {'title': 'Gesteuerte Dämpfung & Kammertrocknung', 'sub': 'Computergesteuerte Trocknung präzise auf 8–12% Restfeuchte', 'w': 1220},
            {'title': 'Individuelle B2B-Holzprodukte', 'sub': 'Kanteln, gehobelte Leisten, Rundstäbe und Sonderprofile', 'w': 1250},
            {'title': 'Unser Engagiertes Team', 'sub': 'FSC®-zertifiziertes Holz & verlässliche europaweite B2B-Lieferung', 'w': 1250},
            {'title': 'Ihr Verlässlicher B2B-Partner für Buchenholz', 'sub': 'www.palromproducts.com  •  office@palromproducts.ro', 'w': 720}
        ]
    },
    'ro': {
        'total_dur': 54.5,
        'durs': [9.0, 6.0, 7.5, 9.5, 9.0, 7.0, 6.5],
        'scenes': [
            {'title': 'Palrom Products', 'sub': 'Producător de Lemn de Fag Certificat FSC® • Brad, România', 'w': 1220},
            {'title': 'Recoltare Sustenabilă & Debitarea Primară', 'sub': 'Bușteni de fag din surse locale și linii automate de debitare', 'w': 1250},
            {'title': 'Prelucrare de Precizie în Acțiune', 'sub': 'Tehnologie europeană de top și măiestrie românească dedicată', 'w': 1250},
            {'title': 'Aburire Controlată & Uscare în Camere', 'sub': 'Uscare computerizată precisă la o umiditate de 8–12%', 'w': 1200},
            {'title': 'Produse B2B la Comandă', 'sub': 'Elemente, șipci rindeluite, tije netede și profile personalizate', 'w': 1250},
            {'title': 'Echipa Noastră Dedicată', 'sub': 'Lemn certificat FSC® și aprovizionare sigură în toată Europa', 'w': 1200},
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
    print(f"--- RENDERING CORPORATE VIDEO IN ANTHRACITE: {lang.upper()} ({cfg['total_dur']}s) ---")
    print(f"==========================================")
    
    durs = cfg['durs']
    scenes = cfg['scenes']
    
    # 1. Scene 1 (hero_bg.jpg)
    s1_out = os.path.join(SCRATCH, f's1_{lang}.mp4')
    render_scene_base('public/images/hero_bg.jpg', scenes[0]['title'], scenes[0]['sub'], durs[0], s1_out, scenes[0]['w'])
    
    # 2. Scene 2 (7.png)
    s2_out = os.path.join(SCRATCH, f's2_{lang}.mp4')
    render_scene_base('public/images/7.png', scenes[1]['title'], scenes[1]['sub'], durs[1], s2_out, scenes[1]['w'])
    
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
    
    # 6. Scene 6 (Team)
    s6_out = os.path.join(SCRATCH, f's6_{lang}.mp4')
    render_scene_base('public/images/team_group_photo.png', scenes[5]['title'], scenes[5]['sub'], durs[5], s6_out, scenes[5]['w'])
    
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
print("Finished rendering all 4 anthracite corporate videos successfully!")
