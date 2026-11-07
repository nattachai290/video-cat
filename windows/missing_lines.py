# missing_lines.py: prints the ids of lines in scripts/lines.json that have fewer than 4 takes in out/voice/takes
# (used by 2-make-chapter.bat, option 2). Run from a chapter folder.
import collections, json, os
lines = json.load(open('scripts/lines.json', encoding='utf-8'))
d = 'out/voice/takes'
have = collections.Counter(f.rsplit('_', 1)[0] for f in os.listdir(d)) if os.path.isdir(d) else collections.Counter()
print(' '.join(l['id'] for l in lines if have[f"{l['id']}_{l['who']}"] < 4))
