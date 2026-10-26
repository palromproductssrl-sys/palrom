import os
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageFont

SRC_PATH = '/Users/matthiasradder/.gemini/antigravity/brain/f27d3c58-6c07-406a-b849-39b7a87492fa/.user_uploaded/media_1793037849266_4f5f5f8c.jpg'
FONT_BOLD = 'public/fonts/Roboto-Bold.ttf'
FONT_REG = 'public/fonts/Roboto-Regular.ttf'

orig = Image.open(SRC_PATH).convert('RGB')

# Scale and crop to exact 1920x1080 Full HD
w_target, h_target = 1920, 1080
scale = max(w_target / orig.width, h_target / orig.height)
new_w = int(orig.width * scale)
new_h = int(orig.height * scale)
scaled = orig.resize((new_w, new_h), Image.Resampling.LANCZOS)
left = (new_w - w_target) // 2
top = (new_h - h_target) // 2
base = scaled.crop((left, top, left + w_target, top + h_target)).convert('RGBA')

# Flink grotere typografie
FONT_NAME_SIZE = 32
FONT_ROLE_SIZE = 20
font_name = ImageFont.truetype(FONT_BOLD, FONT_NAME_SIZE)
font_role = ImageFont.truetype(FONT_BOLD, FONT_ROLE_SIZE)

roles = {
    'nl': {
        'gabriela': 'Algemeen Directeur',
        'ciprian': 'Inkoop & Bosbeheer',
        'adi': 'Productiemanager',
        'anca': 'Personeelszaken (HR)',
        'bogdan': 'Order Intake & Verkoop'
    },
    'en': {
        'gabriela': 'Managing Director',
        'ciprian': 'Procurement & Forestry',
        'adi': 'Production Manager',
        'anca': 'Human Resources (HR)',
        'bogdan': 'Order Intake & Sales'
    },
    'de': {
        'gabriela': 'Geschäftsführerin',
        'ciprian': 'Holzeinkauf & Logistik',
        'adi': 'Produktionsleiter',
        'anca': 'Personalwesen (HR)',
        'bogdan': 'Auftragsabwicklung'
    },
    'ro': {
        'gabriela': 'Director General',
        'ciprian': 'Achiziții Lemn',
        'adi': 'Manager Producție',
        'anca': 'Resurse Umane (HR)',
        'bogdan': 'Preluare Comenzi & Vânzări'
    }
}

team_layout = [
    {'id': 'gabriela', 'name': 'Gabriela', 'cx': 240,  'cy': 715},
    {'id': 'ciprian',  'name': 'Ciprian',  'cx': 565,  'cy': 665},
    {'id': 'adi',      'name': 'Adi',      'cx': 910,  'cy': 625},
    {'id': 'anca',     'name': 'Anca',     'cx': 1265, 'cy': 705},
    {'id': 'bogdan',   'name': 'Bogdan',   'cx': 1600, 'cy': 665}
]

def generate_team_with_tags(lang):
    out = base.copy()
    lang_roles = roles[lang]
    
    for m in team_layout:
        cx, cy = m['cx'], m['cy']
        name = m['name']
        role = lang_roles[m['id']]
        
        # Measure text
        nb = font_name.getbbox(name)
        nw = nb[2] - nb[0]
        rb = font_role.getbbox(role)
        rw = rb[2] - rb[0]
        
        # Badge afmetingen (flink groter en ruimtelijk)
        text_w = max(nw, rw)
        pad_x = 24
        dot_area_w = 28 # dot + spacing
        pw = text_w + pad_x * 2 + dot_area_w
        ph = 84
        px = cx - pw // 2
        py = cy - ph // 2
        
        # 1. Diepe soft drop shadow
        shadow = Image.new('RGBA', (pw + 20, ph + 20), (0, 0, 0, 0))
        d_s = ImageDraw.Draw(shadow)
        d_s.rounded_rectangle([(4, 4), (pw + 12, ph + 12)], radius=20, fill=(0, 0, 0, 160))
        shadow = shadow.filter(ImageFilter.GaussianBlur(6))
        out.paste(shadow, (px - 6, py - 4), shadow)
        
        # 2. Pill background: Palrom Charcoal (#292929) met 96% opaciteit & verfijnde Palrom Goud border
        pill = Image.new('RGBA', (pw, ph), (0, 0, 0, 0))
        d_p = ImageDraw.Draw(pill)
        d_p.rounded_rectangle([(0, 0), (pw - 1, ph - 1)], radius=18, fill=(41, 41, 41, 245), outline=(231, 177, 36, 230), width=2)
        
        # Gouden indicator dot
        dot_cx = pad_x + 6
        dot_cy = 28 # aligned with name line
        dot_r = 5
        d_p.ellipse([(dot_cx - dot_r, dot_cy - dot_r), (dot_cx + dot_r, dot_cy + dot_r)], fill=(231, 177, 36, 255))
        
        # Text positioning:
        # Naam in helder wit
        text_start_x = pad_x + dot_area_w
        d_p.text((text_start_x, 12), name, font=font_name, fill=(255, 255, 255))
        # Rol in warm Palrom goud
        d_p.text((text_start_x, 48), role, font=font_role, fill=(231, 177, 36))
        
        out.paste(pill, (px, py), pill)
        
    return out

os.makedirs('public/images', exist_ok=True)
for lang in ['nl', 'en', 'de', 'ro']:
    img = generate_team_with_tags(lang)
    out_file = f'public/images/team_group_photo_{lang}.png'
    img.convert('RGB').save(out_file, quality=98)
    print(f'Generated: {out_file} (flink grotere badges)')

# Default fallback
img_nl = generate_team_with_tags('nl')
img_nl.convert('RGB').save('public/images/team_group_photo.png', quality=98)
print('Saved default public/images/team_group_photo.png')
