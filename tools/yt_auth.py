#!/usr/bin/env python3
"""yt_auth.py: get a READ-ONLY refresh token for the Snackatoon channel. Run once ON YOUR OWN COMPUTER (it opens a browser).

    python3 yt_auth.py

Needs only Python 3 (no pip installs). It asks for the OAuth client ID and secret (Desktop app, from Google Cloud
Console > APIs & Services > Credentials), opens Google's sign-in page, and listens on http://127.0.0.1 for the answer.
Sign in with your Google account, then on the next page CHOOSE THE SNACKATOON CHANNEL (a Brand Account), not your personal
channel. The script prints which channel the token belongs to, so you can check.
At the end it prints the refresh token: put it in the cloud environment's settings as YT_REFRESH_TOKEN.
Never paste the token into a chat.
"""
import getpass, http.server, json, secrets, socketserver, urllib.parse, urllib.request, webbrowser

SCOPES = "https://www.googleapis.com/auth/yt-analytics.readonly https://www.googleapis.com/auth/youtube.readonly"

def main():
    cid = input("Client ID: ").strip()
    csec = getpass.getpass("Client secret (hidden): ").strip()
    state, got = secrets.token_urlsafe(16), {}

    class H(http.server.BaseHTTPRequestHandler):
        def do_GET(self):
            q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
            if q.get("state", [""])[0] == state:
                got["code"] = q.get("code", [""])[0]; got["error"] = q.get("error", [""])[0]
            self.send_response(200); self.send_header("Content-Type", "text/html; charset=utf-8"); self.end_headers()
            self.wfile.write("<h2>Done. You can close this tab and go back to the terminal.</h2>".encode())
        def log_message(self, *a): pass

    with socketserver.TCPServer(("127.0.0.1", 0), H) as srv:
        redirect = f"http://127.0.0.1:{srv.server_address[1]}"
        url = "https://accounts.google.com/o/oauth2/v2/auth?" + urllib.parse.urlencode({
            "client_id": cid, "redirect_uri": redirect, "response_type": "code", "scope": SCOPES,
            "access_type": "offline", "prompt": "select_account consent", "state": state})
        print("\nOpening the browser. If it does not open, copy this link into it:\n" + url + "\n")
        webbrowser.open(url)
        while "code" not in got and "error" not in got:
            srv.handle_request()
    if not got.get("code"):
        raise SystemExit("Sign-in was cancelled or refused: " + (got.get("error") or "no code"))
    data = urllib.parse.urlencode({"code": got["code"], "client_id": cid, "client_secret": csec,
                                   "redirect_uri": redirect, "grant_type": "authorization_code"}).encode()
    tok = json.load(urllib.request.urlopen("https://oauth2.googleapis.com/token", data))
    if "refresh_token" not in tok:
        raise SystemExit("No refresh token came back. Remove the app's access at myaccount.google.com/permissions and run again.")
    # which channel did this token get? (a Brand Account channel like Snackatoon must be picked on the sign-in page)
    req = urllib.request.Request("https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true",
                                 headers={"Authorization": "Bearer " + tok["access_token"]})
    items = json.load(urllib.request.urlopen(req)).get("items", [])
    ch = items[0]["snippet"]["title"] + " (" + items[0]["id"] + ")" if items else "no channel"
    print("\nThis token is for the channel:", ch)
    if not items or "snackatoon" not in ch.lower():
        print("Not Snackatoon? Run again and, on the Google page, pick the Snackatoon channel (Brand Account), not your personal name.")
    print("\nYT_REFRESH_TOKEN =", tok["refresh_token"])
    print("\nPut it in the cloud environment settings (Network secrets / environment variable) as YT_REFRESH_TOKEN.")
    print("Keep it private: do not paste it into a chat or commit it.")

if __name__ == "__main__":
    main()
