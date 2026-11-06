#!/usr/bin/env python3
"""yt_stats.py: pull Snackatoon's YouTube Analytics into CSV files (read-only).

    python3 tools/yt_stats.py [--days 28] [--retention]      (from the repo root)

Reads YT_CLIENT_ID, YT_CLIENT_SECRET, YT_REFRESH_TOKEN from the environment (get the token with tools/yt_auth.py).
Writes analytics/<date>/videos.csv (one row per video: title, published, duration, views, watch time, average view
duration, average % viewed, likes, comments, shares, subscribers gained/lost), analytics/<date>/daily.csv, and with
--retention analytics/<date>/retention_<videoId>.csv (audience retention curve, 100 points). Prints a short summary.
No pip installs needed.
"""
import argparse, csv, datetime as dt, json, os, re, sys, urllib.parse, urllib.request

def token():
    need = ["YT_CLIENT_ID", "YT_CLIENT_SECRET", "YT_REFRESH_TOKEN"]
    miss = [k for k in need if not os.environ.get(k)]
    if miss: sys.exit("missing environment variables: " + ", ".join(miss) + " (see tools/yt_auth.py)")
    data = urllib.parse.urlencode({"client_id": os.environ["YT_CLIENT_ID"], "client_secret": os.environ["YT_CLIENT_SECRET"],
                                   "refresh_token": os.environ["YT_REFRESH_TOKEN"], "grant_type": "refresh_token"}).encode()
    return json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))["access_token"]

def get(url, params, tok):
    req = urllib.request.Request(url + "?" + urllib.parse.urlencode(params), headers={"Authorization": "Bearer " + tok})
    try: return json.load(urllib.request.urlopen(req))
    except urllib.error.HTTPError as e: sys.exit(f"API error {e.code}: {e.read().decode()[:400]}")

def iso_dur(s):   # PT1M5S -> 65
    m = re.match(r"PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?", s or ""); h, mi, se = (int(x or 0) for x in m.groups()) if m else (0, 0, 0)
    return h * 3600 + mi * 60 + se

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--days", type=int, default=28); ap.add_argument("--retention", action="store_true")
    a = ap.parse_args()
    tok = token()
    end = dt.date.today(); start = end - dt.timedelta(days=a.days)
    out = os.path.join("analytics", end.isoformat()); os.makedirs(out, exist_ok=True)
    # the channel's uploads (titles, dates, lengths)
    ch = get("https://www.googleapis.com/youtube/v3/channels", {"part": "contentDetails,snippet,statistics", "mine": "true"}, tok)["items"][0]
    uploads, vids, page = ch["contentDetails"]["relatedPlaylists"]["uploads"], {}, None
    while True:
        p = {"part": "contentDetails", "playlistId": uploads, "maxResults": 50, **({"pageToken": page} if page else {})}
        r = get("https://www.googleapis.com/youtube/v3/playlistItems", p, tok)
        ids = [i["contentDetails"]["videoId"] for i in r["items"]]
        if ids:
            for v in get("https://www.googleapis.com/youtube/v3/videos", {"part": "snippet,contentDetails", "id": ",".join(ids)}, tok)["items"]:
                vids[v["id"]] = {"title": v["snippet"]["title"], "published": v["snippet"]["publishedAt"][:10], "length_s": iso_dur(v["contentDetails"]["duration"])}
        page = r.get("nextPageToken")
        if not page: break
    # per-video metrics
    metrics = "views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained,subscribersLost"
    rep = get("https://youtubeanalytics.googleapis.com/v2/reports", {"ids": "channel==MINE", "startDate": start.isoformat(), "endDate": end.isoformat(),
              "metrics": metrics, "dimensions": "video", "sort": "-views", "maxResults": 200}, tok)
    cols = [h["name"] for h in rep.get("columnHeaders", [])]
    rows = []
    for r in rep.get("rows", []):
        d = dict(zip(cols, r)); v = vids.get(d["video"], {})
        rows.append({"video": d["video"], "title": v.get("title", ""), "published": v.get("published", ""), "length_s": v.get("length_s", ""), **{k: d[k] for k in cols if k != "video"}})
    with open(os.path.join(out, "videos.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=["video", "title", "published", "length_s"] + [c for c in cols if c != "video"]); w.writeheader(); w.writerows(rows)
    # daily totals
    day = get("https://youtubeanalytics.googleapis.com/v2/reports", {"ids": "channel==MINE", "startDate": start.isoformat(), "endDate": end.isoformat(),
              "metrics": "views,estimatedMinutesWatched,subscribersGained", "dimensions": "day", "sort": "day"}, tok)
    with open(os.path.join(out, "daily.csv"), "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f); w.writerow([h["name"] for h in day.get("columnHeaders", [])]); w.writerows(day.get("rows", []))
    # audience retention curves
    if a.retention:
        for r in rows:
            ret = get("https://youtubeanalytics.googleapis.com/v2/reports", {"ids": "channel==MINE", "startDate": start.isoformat(), "endDate": end.isoformat(),
                      "metrics": "audienceWatchRatio,relativeRetentionPerformance", "dimensions": "elapsedVideoTimeRatio", "filters": "video==" + r["video"]}, tok)
            with open(os.path.join(out, f"retention_{r['video']}.csv"), "w", newline="", encoding="utf-8") as f:
                w = csv.writer(f); w.writerow([h["name"] for h in ret.get("columnHeaders", [])]); w.writerows(ret.get("rows", []))
    # summary
    print(f"{ch['snippet']['title']}: {ch['statistics'].get('subscriberCount', '?')} subscribers · {len(vids)} uploads · {start} .. {end}")
    for r in rows:
        print(f"  {r['views']:>6} views  {r['averageViewPercentage']:>6.1f}% viewed  {r['averageViewDuration']:>4}s avg  +{r['subscribersGained']} subs  {r['title'][:60]}")
    print("wrote", out)

if __name__ == "__main__":
    main()
