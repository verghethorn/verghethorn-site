import json, os, io, shutil, glob, requests
from PIL import Image
req = json.load(open('tools/request.json'))
os.makedirs('out', exist_ok=True)
UA = {'User-Agent': 'VerghethornSiteBuilder/1.0 (verghethorn@gmail.com)'}
# 1. hero cutouts
if req.get('cutouts'):
    from rembg import remove, new_session
    s = new_session(req.get('model', 'birefnet-general'))
    os.makedirs('out/cast', exist_ok=True)
    for f in req['cutouts']:
        im = Image.open(f).convert('RGB')
        o = remove(im, session=s)
        bb = o.getchannel('A').point(lambda a: 255 if a > 8 else 0).getbbox()
        o = o.crop(bb)
        o.save('out/cast/' + os.path.basename(f).rsplit('.', 1)[0] + '.png', optimize=True)
# 2. commons candidates
API = 'https://commons.wikimedia.org/w/api.php'
for key, q in req.get('search', {}).items():
    d = f'out/cand/{key}'; os.makedirs(d, exist_ok=True)
    r = requests.get(API, params={'action': 'query', 'format': 'json', 'generator': 'search', 'gsrsearch': q + ' filetype:bitmap',
        'gsrnamespace': 6, 'gsrlimit': req.get('n', 10), 'prop': 'imageinfo', 'iiprop': 'url|extmetadata|size', 'iiurlwidth': 1600}, headers=UA).json()
    meta = []
    for p in sorted(r.get('query', {}).get('pages', {}).values(), key=lambda p: p.get('index', 0)):
        ii = p['imageinfo'][0]; em = ii.get('extmetadata', {})
        try:
            b = requests.get(ii['thumburl'], headers=UA, timeout=60).content
            im = Image.open(io.BytesIO(b)).convert('RGB')
        except Exception as e:
            continue
        i = len(meta)
        im.save(f'{d}/{i}.jpg', quality=88)
        meta.append({'i': i, 'title': p['title'], 'w': ii['width'], 'h': ii['height'], 'page': ii.get('descriptionurl'),
            'artist': em.get('Artist', {}).get('value', ''), 'license': em.get('LicenseShortName', {}).get('value', '')})
    json.dump(meta, open(f'{d}/meta.json', 'w'), indent=1)
# 3. icons
if req.get('icons'):
    os.makedirs('out/icons', exist_ok=True)
    for n in req['icons']:
        for g in glob.glob(f'node_modules/@fortawesome/fontawesome-free/svgs/brands/{n}.svg'):
            shutil.copy(g, 'out/icons/')
