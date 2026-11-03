// Channel art for Snackatoon. ?banner renders the 2560 x 1440 banner; otherwise the 800 x 800 profile picture.
const PROJECT = /banner/.test(location.search) ? { duration: 2, bpm: 100, w: 2560, h: 1440 } : { duration: 2, bpm: 100, w: 800, h: 800 };
