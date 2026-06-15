import sys

def make_pdf(filename):
    # Minimal PDF builder
    objects = []
    
    # Define objects
    catalog = "<< /Type /Catalog /Pages 2 0 R >>"
    pages = "<< /Type /Pages /Kids [3 0 R] /Count 1 >>"
    
    # Content of page 1:
    text = (
        "BT\n"
        "/F1 24 Tf\n"
        "70 750 Td\n"
        "(PALROM PRODUCTS SRL) Tj\n"
        "0 -40 Td\n"
        "/F1 16 Tf\n"
        "(Official B2B Product Brochure & Specifications) Tj\n"
        "0 -40 Td\n"
        "/F1 12 Tf\n"
        "(Address: 8 Poienita St, Brad City, Hunedoara, ROMANIA) Tj\n"
        "0 -20 Td\n"
        "(Email: office@palromproducts.ro | Tel: +40 254.60.60.53) Tj\n"
        "0 -40 Td\n"
        "/F1 14 Tf\n"
        "(PRODUCT SUMMARY & TECHNICAL SPECIFICATIONS:) Tj\n"
        "0 -25 Td\n"
        "/F1 10 Tf\n"
        "(- Beechwood Dowels & Pins: Diameters 3mm to 60mm (Spiral rilled or smooth)) Tj\n"
        "0 -18 Td\n"
        "(- Four-Sides Planed Lumber: Precision calibrated to size, kiln-dried to 8-12%) Tj\n"
        "0 -18 Td\n"
        "(- Wood Profiles & Mouldings: Half-round, quarter-round, and custom profiles) Tj\n"
        "0 -18 Td\n"
        "(- Special Components: Wooden thresholds, keeplats, and mixed colors distancers) Tj\n"
        "0 -40 Td\n"
        "/F1 12 Tf\n"
        "(All products are 100% FSC-Certified, sourced sustainably from Romanian forests.) Tj\n"
        "0 -20 Td\n"
        "(For inquiries, use the B2B partner portal at /configurator or contact us directly.) Tj\n"
        "ET"
    )
    
    content_stream = f"<< /Length {len(text)} >>\nstream\n{text}\nendstream"
    
    # Obj 3: Page 1
    page1 = (
        "<< /Type /Page\n"
        "   /Parent 2 0 R\n"
        "   /Resources << /Font << /F1 5 0 R >> >>\n"
        "   /MediaBox [0 0 595.28 841.89]\n"
        "   /Contents 4 0 R >>"
    )
    
    # Obj 5: Font
    font = (
        "<< /Type /Font\n"
        "   /Subtype /Type1\n"
        "   /BaseFont /Helvetica-Bold >>"
    )
    
    # Write objects sequentially to file and track offsets
    with open(filename, 'wb') as f:
        f.write(b'%PDF-1.4\n')
        offsets = {}
        
        # Object list (fixed order matching IDs)
        objs = [
            (1, catalog.encode('ascii')),
            (2, pages.encode('ascii')),
            (3, page1.encode('ascii')),
            (4, content_stream.encode('ascii')),
            (5, font.encode('ascii'))
        ]
        
        for num, data in objs:
            offsets[num] = f.tell()
            f.write(f"{num} 0 obj\n".encode('ascii'))
            f.write(data)
            f.write(b"\nendobj\n")
            
        xref_offset = f.tell()
        f.write(b"xref\n")
        f.write(f"0 {len(objs) + 1}\n".encode('ascii'))
        f.write(b"0000000000 65535 f \n")
        for num in sorted(offsets.keys()):
            f.write(f"{offsets[num]:010d} 00000 n \n".encode('ascii'))
            
        f.write(b"trailer\n")
        f.write(f"<< /Size {len(objs) + 1} /Root 1 0 R >>\n".encode('ascii'))
        f.write(b"startxref\n")
        f.write(f"{xref_offset}\n".encode('ascii'))
        f.write(b"%%EOF\n")

if __name__ == '__main__':
    dest = sys.argv[1] if len(sys.argv) > 1 else 'public/palrom_brochure.pdf'
    make_pdf(dest)
    print(f"PDF created successfully at: {dest}")
