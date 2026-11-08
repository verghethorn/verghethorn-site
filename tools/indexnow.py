# Notify Bing, Yandex and other IndexNow engines about new/changed URLs.
# Usage: python3 tools/indexnow.py https://verghethorn.com/articles/slug/ https://verghethorn.com/ru/articles/slug/ ...
import sys, json, urllib.request
KEY = 'd84fca0a76688b0a044ed3fbec22ada8'
urls = sys.argv[1:] or ['https://verghethorn.com/articles/', 'https://verghethorn.com/ru/articles/']
data = json.dumps({'host': 'verghethorn.com', 'key': KEY, 'keyLocation': f'https://verghethorn.com/{KEY}.txt', 'urlList': urls}).encode()
for ep in ['https://api.indexnow.org/indexnow', 'https://yandex.com/indexnow']:
    try:
        r = urllib.request.urlopen(urllib.request.Request(ep, data, {'Content-Type': 'application/json; charset=utf-8'}), timeout=30)
        print(ep, r.status)
    except Exception as e:
        print(ep, 'failed:', e)
