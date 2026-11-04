# End Screen (full episode, 3:00-3:20)

The last 20 s of `out/full.mp4` is a drawn End Screen (Pumpkin in a party hat and Pip, bottom left; "More snacks? Pick one!" /
"And subscribe!"). It leaves room for YouTube's end-screen elements. In YouTube Studio > Content > the video > Editor > End screen:

1. Start time: **3:00** (end 3:20)
2. **Video: Most recent upload** → drag to the TOP RIGHT box
3. **Video: Best for viewer** → drag to the BOTTOM RIGHT box
4. **Subscribe** → the round slot in the middle-bottom (right of Pip)

Slot positions (1920x1080): `src/endscreen.js` → `ENDSLOTS` (videos [1180,190,620,350] and [1180,600,620,350]; subscribe circle at [900,760] r 150).
Shorts can't have End Screens: link the full episode from each Short with "Related video" instead.
