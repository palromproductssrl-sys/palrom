import os
import numpy as np
from PIL import Image, ImageFilter, ImageOps, ImageEnhance, ImageDraw, ImageFont

BRAIN_DIR = '/Users/matthiasradder/.gemini/antigravity/brain/4f9024b4-d609-421a-b057-b180f987ffb5'
FONT_BOLD = 'public/fonts/Roboto-Bold.ttf'
FONT_REG = 'public/fonts/Roboto-Regular.ttf'

def make_storyboard_art(src_path, out_path, arrow_type=None, custom_sub=None):
    img = Image.open(src_path).convert('RGB')
    w, h = img.size
    
    gray = ImageOps.grayscale(img)
    inv = ImageOps.invert(gray)
    blur = inv.filter(ImageFilter.GaussianBlur(4))
    g_arr = np.array(gray, dtype=float)
    b_arr = np.array(blur, dtype=float)
    dodge = np.clip((g_arr * 255.0) / (255.0 - b_arr + 1e-5), 0, 255)
    
    contour = img.filter(ImageFilter.CONTOUR).convert('L')
    c_arr = np.array(contour, dtype=float)
    
    ink = np.clip(dodge - (255 - c_arr) * 0.35, 0, 255).astype(np.uint8)
    ink_im = Image.fromarray(ink).convert('RGB')
    
    smooth = img.filter(ImageFilter.MedianFilter(9)).filter(ImageFilter.GaussianBlur(2))
    smooth = ImageEnhance.Color(smooth).enhance(1.25)
    smooth = ImageEnhance.Contrast(smooth).enhance(1.15)
    
    ink_f = np.array(ink_im, dtype=float) / 255.0
    color_f = np.array(smooth, dtype=float) / 255.0
    blend = (ink_f * color_f * 255.0).clip(0, 255).astype(np.uint8)
    art = Image.fromarray(blend)
    
    paper = Image.new('RGB', (w, h), (250, 248, 242))
    art = Image.blend(paper, art, 0.88)
    
    draw = ImageDraw.Draw(art)
    f_badge = ImageFont.truetype(FONT_BOLD, 26)
    
    if arrow_type == 'ascend':
        cx = w - 180
        draw.line([(cx, h - 80), (cx, 100)], fill=(231, 177, 36), width=10)
        draw.polygon([(cx, 60), (cx - 28, 115), (cx + 28, 115)], fill=(231, 177, 36))
        draw.rounded_rectangle([40, 40, 680, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '▲ CRANE UP / UITSTIJGEN OVER BOMEN', font=f_badge, fill=(231, 177, 36))
        
    elif arrow_type == 'push_in':
        draw.rounded_rectangle([40, 40, 520, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '➔ BEELDVULLEND • PUSH-IN', font=f_badge, fill=(231, 177, 36))
        
    elif arrow_type == 'cut_action':
        draw.rounded_rectangle([40, 40, 580, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '◉ ACTIE • ZAGERING IN DETAIL', font=f_badge, fill=(231, 177, 36))
        
    elif arrow_type == 'flythrough':
        draw.rounded_rectangle([40, 40, 600, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '➔ DRONE VLUCHT DOOR HAL', font=f_badge, fill=(231, 177, 36))
        
    elif arrow_type == 'slowmo_kilns':
        draw.rounded_rectangle([40, 40, 620, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '⏳ SLOW-MOTION DROOGKAMERS', font=f_badge, fill=(231, 177, 36))

    elif arrow_type == 'split':
        draw.rounded_rectangle([40, 40, 640, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '✦ 4 PRODUCTKAARTEN OVERZICHT', font=f_badge, fill=(231, 177, 36))

    elif arrow_type == 'fsc':
        draw.rounded_rectangle([40, 40, 580, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '★ FSC 100% CERTIFICERING', font=f_badge, fill=(231, 177, 36))

    elif arrow_type == 'team':
        draw.rounded_rectangle([40, 40, 560, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '👥 ONS TOEGEWIJDE TEAM', font=f_badge, fill=(231, 177, 36))

    elif arrow_type == 'outro':
        draw.rounded_rectangle([40, 40, 580, 110], radius=10, fill=(41, 41, 41, 230), outline=(231, 177, 36), width=3)
        draw.text((60, 50), '✦ EIND RESOLVE & CONTACT', font=f_badge, fill=(231, 177, 36))

    art.save(out_path, quality=92)
    print(f"Rendered sketch: {out_path}")

# Source frame inputs for storyboard illustrations
sketches = [
    ('scratch/master_9scenes/nl/s1.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_1.jpg', 'ascend', 2.0),
    ('scratch/master_9scenes/nl/s2.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_2.jpg', 'push_in', 2.0),
    ('scratch/master_9scenes/nl/s3.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_3.jpg', 'cut_action', 2.5),
    ('scratch/master_9scenes/nl/s4.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_4.jpg', 'flythrough', 1.8),
    ('scratch/master_9scenes/nl/s5.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_5.jpg', 'slowmo_kilns', 1.8),
    ('scratch/master_9scenes/nl/s6.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_6.jpg', 'split', 2.0),
    ('scratch/master_9scenes/nl/s7.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_7.jpg', 'fsc', 1.0),
    ('scratch/master_9scenes/nl/s8.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_8.jpg', 'team', 2.0),
    ('scratch/master_9scenes/nl/s9.mp4', f'{BRAIN_DIR}/storyboard_sketch_sc_9.jpg', 'outro', 2.0)
]

for vid_src, sk_out, arrow, seek_t in sketches:
    if os.path.exists(vid_src):
        tmp_jpg = f'{BRAIN_DIR}/tmp_sk_extract.jpg'
        os.system(f"node_modules/ffmpeg-static/ffmpeg -y -ss {seek_t} -i {vid_src} -vframes 1 {tmp_jpg} >/dev/null 2>&1")
        if os.path.exists(tmp_jpg):
            make_storyboard_art(tmp_jpg, sk_out, arrow)
            if os.path.exists(tmp_jpg): os.remove(tmp_jpg)

# Build 3-Page Storyboard Sheets (Scenes 1-3, 4-6, 7-9)
scenes_data = [
    {
        'num': 1,
        'title': 'Bosopstijging ➔ Zonneverblinding ➔ Fabriek',
        'tc': '00:00 – 00:08.3',
        'dur': '8.3 sec',
        'shot': 'Crane Ascend & Aerial Wide Shot (EWS)',
        'cam': '▲ ASCEND THROUGH CANOPY — Camera stijgt op tussen beukenstammen, breekt door boomkruinen in zonneflare, waarna complex verschijnt.',
        'desc': 'Start in het ongerepte Karpaten-beukenbos. Camera zweeft omhoog, wordt verblind door opkomende zon, en onthult het Palrom complex.',
        'vo': '\"Al meer dan 25 jaar is Palrom Products een toonaangevende producent van beukenhout in Brad, Roemenië.\"',
        'overlay': 'Balk links: Palrom Products | FSC® Gecertificeerde Beukenhoutproducent • Brad, Roemenië'
    },
    {
        'num': 2,
        'title': 'Hout uitladen van de vrachtwagen (Fullscreen)',
        'tc': '00:08.2 – 00:11.2',
        'dur': '3.0 sec',
        'shot': 'Medium Wide Shot (MWS) • 16:9 Beeldvullend Werffoto',
        'cam': '➔ SUBTIELE KEN BURNS PUSH-IN (1.0 ➔ 1.04) — Volledig beeldvullend zonder zwarte balken.',
        'desc': 'De rode Palrom houtvrachtwagen met hydraulische grijpkraan lost dikke beukenstammen op de ruime voorraadwerf.',
        'vo': '\"Van zorgvuldig geselecteerde stammen...\"',
        'overlay': 'Balk links: Duurzame Oogst & Houtopslag | Lokaal geoogste beukenstammen arriveren op onze voorraadwerf'
    },
    {
        'num': 3,
        'title': 'Zaagsnede op de zaagmachine (Kort)',
        'tc': '00:11.2 – 00:15.8',
        'dur': '4.6 sec',
        'shot': 'Dynamic Medium Close-up (MCU) • Live Productie',
        'cam': '◉ ACTION TRACKING — Snelle, krachtige zaagsnede op 1.0x natuurlijke snelheid.',
        'desc': 'Het zware zaagblad snijdt met hoge snelheid door het verse beukenhout. Korte, krachtige actieshot van de primaire zagerijlijn.',
        'vo': '\"...tot geautomatiseerde eerste zaaglijnen in onze moderne zagerij.\"',
        'overlay': 'Balk links: Precisiebewerking in Actie | Geavanceerde Europese zaagtechnologie & Roemeens vakmanschap'
    },
    {
        'num': 4,
        'title': 'Vlucht door de hal & afgewerkt hout',
        'tc': '00:15.8 – 00:21.6',
        'dur': '5.8 sec',
        'shot': 'Continuous Fly-Through Shot • Drone Warehouse Flight',
        'cam': '➔ FLY-THROUGH (POORT ➔ CONVEYOR ➔ GANGPAD AFGEWERKT HOUT)',
        'desc': 'De drone vliegt spectaculair door de fabriekspoort bij 0:42 en zweeft langs actieve verwerkingslijnen en sorteerders.',
        'vo': '\"Wij combineren Europese precisietechnologie met generaties aan Roemeens vakmanschap voor uitzonderlijke nauwkeurigheid.\"',
        'overlay': 'Balk links: Moderne Verwerkingshal & Houtopslag | Geavanceerde productielijnen en opslag van afgewerkt beukenhout'
    },
    {
        'num': 5,
        'title': 'Nardi Droogkamers (Echt Slow-Motion)',
        'tc': '00:21.6 – 00:30.2',
        'dur': '8.6 sec',
        'shot': 'Smooth Drone Glide • Cinematic 50% Slow Motion',
        'cam': '➔ ULTRA-VLOEIENDE 50% SLOW-MOTION LANGS DE KAMERS (101.8s - 106.1s)',
        'desc': 'Valt exact samen met de gesproken tekst over droging: de drone glijdt in fluweelzachte halve snelheid langs de zilveren Nardi-kamers.',
        'vo': '\"Natuurlijke luchtdroging en geconditioneerde opslag zorgen voor een optimale stabilisatie van het hout, klaar voor verdere verwerking.\"',
        'overlay': 'Balk links: Geavanceerde Droogkamers | Computergestuurde Nardi-kamers voor geconditioneerde droging'
    },
    {
        'num': 6,
        'title': 'B2B Maatwerk Producten Showcase',
        'tc': '00:29.8 – 00:40.5',
        'dur': '10.7 sec',
        'shot': '4K Split Product Showcase Card Graphic',
        'cam': '➔ SUBTLE PUSH-IN (1.0 ➔ 1.03) — Rustige presentatie van 4 productgroepen.',
        'desc': 'Vier overzichtelijke kaarten: Beukenhouten Blanks, Geschaafde Latten, Gladde Stokken en Maatwerk Profielen.',
        'vo': '\"Wij leveren een compleet assortiment B2B-maatwerk: blanks, geschaafde latten, gladde en gerilde stokken en op maat gemaakte profielen.\"',
        'overlay': 'Balk links: B2B Maatwerk Producten | Blanks, geschaafde latten, gladde stokken en maatwerk profielen'
    },
    {
        'num': 7,
        'title': 'FSC® 100% Gecertificeerd',
        'tc': '00:40.5 – 00:43.0',
        'dur': '2.5 sec',
        'shot': 'Brand Certification & Sustainability Slide',
        'cam': '✦ HERO REVEAL & SLOW ZOOM — Statige antraciet kaart met FSC-keurmerk.',
        'desc': 'Puur wit FSC-logo op antraciet achtergrond met gouden hoofdtitel \"DUURZAAMHEID & KWALITEIT\". Benadrukt verantwoorde bosbouw.',
        'vo': '\"100% FSC-gecertificeerd...\"',
        'overlay': 'Balk links: FSC® 100% Gecertificeerd | Gegarandeerd duurzaam en verantwoord geoogst beukenhout'
    },
    {
        'num': 8,
        'title': 'Ons Toegewijde Team',
        'tc': '00:43.0 – 00:47.6',
        'dur': '4.6 sec',
        'shot': 'Group Portrait • Teamfoto met Push-In',
        'cam': '➔ PUSH-IN TOWARDS SMILES (y=45%) — Focus op de trotse vakmensen met naambadges.',
        'desc': 'Het voltallige Palrom-team opgesteld voor de fabriek, trots op tientallen jaren Roemeens houtbewerkings-vakmanschap.',
        'vo': '\"...ondersteund door een toegewijd team van ervaren vakmensen.\"',
        'overlay': 'Balk links: Ons Toegewijde Team | Vakmanschap en betrouwbare B2B-leveringen in heel Europa'
    },
    {
        'num': 9,
        'title': 'Eindslide: Palrom Merkkaart & Contact',
        'tc': '00:47.6 – 00:56.0',
        'dur': '8.4 sec',
        'shot': 'Fullscreen Luxury Brand Resolve Slide',
        'cam': '✦ FINAL RESOLVE & AUDIO FADE — Statige merkkaart, muziekfade 52.5s-56.0s.',
        'desc': 'Scherp wit Palrom logo, gouden scheidingslijn, centrale titel en directe contactgegevens voor Europese B2B partners.',
        'vo': '\"Palrom Products. Uw betrouwbare B2B partner in duurzaam beukenhout.\"',
        'overlay': 'Centraal: Uw Betrouwbare B2B Partner in Duurzaam Beukenhout | www.palromproducts.com • info@palromproducts.ro'
    }
]

f_title = ImageFont.truetype(FONT_BOLD, 36)
f_sub = ImageFont.truetype(FONT_REG, 20)
f_sc_head = ImageFont.truetype(FONT_BOLD, 22)
f_sc_meta = ImageFont.truetype(FONT_BOLD, 18)
f_lbl = ImageFont.truetype(FONT_BOLD, 15)
f_body = ImageFont.truetype(FONT_REG, 15)
f_vo = ImageFont.truetype(FONT_REG, 14)

def render_storyboard_page(scenes_subset, page_num, total_pages):
    W, H = 2400, 1750
    page = Image.new('RGB', (W, H), (248, 246, 240))
    draw = ImageDraw.Draw(page)
    
    # Header Bar
    draw.rectangle([60, 40, W - 60, 130], fill=(41, 41, 41))
    draw.rectangle([60, 40, 72, 130], fill=(231, 177, 36))
    draw.text((95, 52), 'PALROM PRODUCTS S.R.L.  •  OFFICIEEL PRODUCTIE STORYBOARD (9 SCÈNES)', font=f_title, fill=(255, 255, 255))
    draw.text((95, 96), f'Bedrijfsvideo 56.0s  |  1080p 30fps  |  Pagina {page_num} van {total_pages}  |  Goedgekeurd Master Ontwerp (Offline)', font=f_sub, fill=(231, 177, 36))
    
    # 3 horizontal strips per page
    sh = 490
    for idx, sc in enumerate(scenes_subset):
        y0 = 160 + idx * (sh + 24)
        x0 = 80
        pw = W - 160
        
        # Panel container box
        draw.rounded_rectangle([x0, y0, x0 + pw, y0 + sh], radius=14, fill=(255, 255, 255), outline=(215, 210, 200), width=2)
        
        # Header banner inside panel
        draw.rounded_rectangle([x0, y0, x0 + pw, y0 + 44], radius=12, fill=(41, 41, 41))
        draw.rectangle([x0, y0 + 34, x0 + pw, y0 + 44], fill=(41, 41, 41))
        draw.rectangle([x0, y0, x0 + 10, y0 + 44], fill=(231, 177, 36))
        
        sc_num = sc['num']
        sc_title = sc['title'].upper()
        sc_tc = sc['tc']
        sc_dur = sc['dur']
        sc_overlay = sc['overlay'][:110]
        draw.text((x0 + 20, y0 + 10), f'SCÈNE {sc_num}: {sc_title}', font=f_sc_head, fill=(255, 255, 255))
        draw.text((x0 + pw - 270, y0 + 12), f'⏱ {sc_tc} ({sc_dur})', font=f_sc_meta, fill=(231, 177, 36))
        
        # Sketch Image (16:9 ratio, h~410, w~730)
        sketch_p = f'{BRAIN_DIR}/storyboard_sketch_sc_{sc_num}.jpg'
        sk_im = Image.open(sketch_p).resize((730, 410), Image.Resampling.LANCZOS)
        page.paste(sk_im, (x0 + 20, y0 + 58))
        draw.rectangle([x0 + 20, y0 + 58, x0 + 20 + 730, y0 + 58 + 410], outline=(41, 41, 41), width=2)
        
        # Info Column to the right of sketch
        ix0 = x0 + 775
        iy0 = y0 + 58
        
        # Shot Type
        draw.text((ix0, iy0), 'SHOT TYPE & CAMERABEWEGING:', font=f_lbl, fill=(180, 83, 9))
        draw.text((ix0, iy0 + 20), sc['shot'], font=f_body, fill=(41, 41, 41))
        
        # Camera Movement
        draw.text((ix0, iy0 + 55), 'CAMERAACTIE:', font=f_lbl, fill=(180, 83, 9))
        draw.text((ix0, iy0 + 75), sc['cam'][:90], font=f_body, fill=(30, 41, 59))
        if len(sc['cam']) > 90:
            draw.text((ix0, iy0 + 95), sc['cam'][90:180], font=f_body, fill=(30, 41, 59))
        
        # Visual Description
        draw.text((ix0, iy0 + 130), 'VISUELE ACTIE / BESCHRIJVING:', font=f_lbl, fill=(180, 83, 9))
        words = sc['desc'].split(' ')
        lines = []
        cur = ''
        for w in words:
            if len(cur + ' ' + w) < 85: cur += (' ' + w if cur else w)
            else: lines.append(cur); cur = w
        if cur: lines.append(cur)
        for li, l in enumerate(lines[:2]):
            draw.text((ix0, iy0 + 150 + li*20), l, font=f_body, fill=(71, 85, 105))
            
        # Audio / Voiceover Box below
        by0 = iy0 + 210
        draw.rounded_rectangle([ix0, by0, x0 + pw - 20, by0 + 130], radius=8, fill=(245, 247, 250), outline=(226, 232, 240), width=1)
        draw.rectangle([ix0, by0, ix0 + 6, by0 + 130], fill=(231, 177, 36))
        draw.text((ix0 + 16, by0 + 10), '🎙️ VOICE-OVER AUDIO (NL):', font=f_lbl, fill=(180, 83, 9))
        
        vo_words = sc['vo'].split(' ')
        vo_lines = []
        cur = ''
        for w in vo_words:
            if len(cur + ' ' + w) < 85: cur += (' ' + w if cur else w)
            else: vo_lines.append(cur); cur = w
        if cur: vo_lines.append(cur)
        for li, l in enumerate(vo_lines[:2]):
            draw.text((ix0 + 16, by0 + 32 + li*20), l, font=f_vo, fill=(30, 41, 59))
            
        # On-screen overlay text
        draw.text((ix0 + 16, by0 + 85), f'🏷️ ON-SCREEN TYPOGRAFIE:', font=ImageFont.truetype(FONT_BOLD, 12), fill=(180, 83, 9))
        draw.text((ix0 + 16, by0 + 102), f'{sc_overlay}', font=ImageFont.truetype(FONT_REG, 13), fill=(100, 116, 139))
    
    # Footer
    draw.text((80, H - 35), 'PALROM PRODUCTS S.R.L.  •  Brad, Hunedoara, Roemenië  •  www.palromproducts.com  •  info@palromproducts.ro', font=ImageFont.truetype(FONT_REG, 15), fill=(120, 120, 120))
    draw.text((W - 250, H - 35), f'Pagina {page_num} van {total_pages}', font=ImageFont.truetype(FONT_BOLD, 15), fill=(41, 41, 41))
    return page

p1 = render_storyboard_page(scenes_data[0:3], 1, 3)
p2 = render_storyboard_page(scenes_data[3:6], 2, 3)
p3 = render_storyboard_page(scenes_data[6:9], 3, 3)

p1_path = f'{BRAIN_DIR}/palrom_storyboard_page1.jpg'
p2_path = f'{BRAIN_DIR}/palrom_storyboard_page2.jpg'
p3_path = f'{BRAIN_DIR}/palrom_storyboard_page3.jpg'
pdf_path = f'{BRAIN_DIR}/palrom_storyboard_complete.pdf'

p1.save(p1_path, quality=95)
p2.save(p2_path, quality=95)
p3.save(p3_path, quality=95)

# High-Res 3-page PDF
p1.save(pdf_path, 'PDF', resolution=150.0, save_all=True, append_images=[p2, p3])

# Master vertical composite sheet
master_h = p1.height + p2.height + p3.height + 60
master = Image.new('RGB', (p1.width, master_h), (230, 228, 222))
master.paste(p1, (0, 0))
master.paste(p2, (0, p1.height + 30))
master.paste(p3, (0, p1.height + p2.height + 60))
master_path = f'{BRAIN_DIR}/palrom_storyboard_master.jpg'
master.save(master_path, quality=92)

print('SUCCESS: Storyboard pages 1-3, master sheet, and complete PDF updated!')
