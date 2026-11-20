#!/usr/bin/env python3
"""Builds magaam/index.html from nakhlio/index.html.
Magaam is served at /magaam/ (its own address, icon and home-screen app) but uses the same files as Nakhlio.
Run after every change to nakhlio/index.html:  python3 tools/build_magaam.py"""
import pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
h = (root / 'nakhlio/index.html').read_text()
og = '''<base href="/nakhlio/">
<meta property="og:type" content="website">
<meta property="og:title" content="Magaam">
<meta property="og:description" content="Photos, reels and chats with your people. Open the link to join.">
<meta property="og:image" content="https://verghethorn.com/magaam/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="description" content="Photos, reels and chats with your people.">'''
h = h.replace('<head>', '<head>\n' + og, 1)
h = re.sub(r'<link rel="manifest" href="[^"]*">', '<link rel="manifest" href="/magaam/manifest.webmanifest">', h, count=1)
h = re.sub(r'<title>[^<]*</title>', '<title>Magaam</title>', h, count=1)
h = h.replace('<meta name="apple-mobile-web-app-title" content="Nakhlio">', '<meta name="apple-mobile-web-app-title" content="Magaam">', 1)
(root / 'magaam/index.html').write_text(h)
print('magaam/index.html built')
