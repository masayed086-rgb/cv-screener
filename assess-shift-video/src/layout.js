// Per-format layout. All numbers are CSS px on the native canvas.
// x/y are for left-to-right languages; text blocks and cards mirror automatically for RTL.
// Characters keep their positions in both languages so faces and hair parts are never flipped.
// Safe areas (brief): vertical 90px sides, 180px top, 300px bottom.

export const LAYOUT = {
  vertical: {
    W: 1080, H: 1920,
    caption: { bottom: 1610, maxW: 900, size: 44 },
    watermark: { y: 96 },
    s1: {
      head: { x: 90, y: 250, w: 900, size: 112 },
      nour: { x: 70, y: 720, w: 940 },
      path: 'M -40 640 C 180 600 300 700 520 660 S 840 560 905 612',
      ring: { x: 912, y: 616 }
    },
    s2: {
      head: { x: 90, y: 220, w: 900, size: 92 },
      cards: { y: 560, w: 280, h: 150, xs: [90, 400, 710] },
      nour: { x: 280, y: 780, w: 520 },
      path: 'M -40 790 C 200 770 320 745 540 750 S 880 770 1120 735'
    },
    s3: {
      align: 'center',
      logo: { y: 300, h: 150 },
      word: { y: 478, size: 150 },
      desc: { y: 668 },
      endo: { y: 724 },
      tag: { y: 800, w: 900 },
      nour: { x: 430, y: 880, w: 220 },
      path: 'M -40 1310 C 250 1270 360 1430 540 1425 S 860 1340 1120 1300'
    },
    s4: {
      head: { x: 90, y: 220, w: 900, size: 88 },
      cards: { y: 470, w: 430, h: 330, xs: [90, 560] },
      nour: { x: 10, y: 930, w: 540 },
      samir: { x: 540, y: 925, w: 540 },
      coachTag: { x: 780, y: 860 },
      path: 'M 305 800 C 305 900 540 880 540 960 C 540 880 775 900 775 800'
    },
    s5: {
      head: { x: 90, y: 220, w: 900, size: 88 },
      cards: { y: 470, w: 280, h: 140, xs: [90, 400, 710] },
      chips: { y: 700 },
      chosen: { y: 628 },
      nour: { x: 120, y: 830, w: 440 },
      samir: { x: 640, y: 800, w: 240 },
      path: 'M 230 700 C 230 660 240 640 230 610 M 540 700 C 540 660 540 640 540 610 M 850 700 C 850 660 840 640 850 610'
    },
    s6: {
      head: { x: 90, y: 220, w: 900, size: 88 },
      steps: { y: 600, xs: [150, 410, 670, 930] },
      nour: { x: 70, y: 760, w: 940 }
    },
    s7: {
      eyebrow: { x: 90, y: 250, w: 900 },
      cards: { x: 90, w: 900, h: 270, ys: [330, 640, 950] }
    },
    s8: {
      align: 'center',
      logo: { y: 330, h: 140 },
      tag: { x: 90, y: 560, w: 900, size: 84 },
      cta: { x: 90, y: 900, w: 900, size: 62 },
      button: { y: 1070 },
      url: { y: 1230 },
      path: 'M -40 1350 C 260 1300 380 1420 600 1380 S 900 1300 1120 1330'
    }
  },

  landscape: {
    W: 1920, H: 1080,
    caption: { bottom: 1012, maxW: 1400, size: 40 },
    watermark: { y: 40 },
    s1: {
      head: { x: 120, y: 330, w: 700, size: 120 },
      nour: { x: 860, y: 170, w: 940 },
      path: 'M -40 760 C 200 720 420 820 640 770 S 820 690 860 700',
      ring: { x: 868, y: 702 }
    },
    s2: {
      head: { x: 120, y: 150, w: 900, size: 92 },
      cards: { y: 520, w: 250, h: 160, xs: [120, 400, 680] },
      nour: { x: 1180, y: 130, w: 580 },
      path: 'M -40 760 C 300 740 600 720 960 740 S 1400 780 1960 740'
    },
    s3: {
      align: 'start',
      logo: { x: 120, y: 210, h: 150 },
      word: { x: 120, y: 388, size: 150 },
      desc: { x: 120, y: 578 },
      endo: { x: 120, y: 634 },
      tag: { x: 120, y: 720, w: 900 },
      nour: { x: 1350, y: 150, w: 280 },
      path: 'M -40 850 C 300 810 700 880 1000 830 S 1300 800 1400 830'
    },
    s4: {
      head: { x: 120, y: 110, w: 800, size: 80 },
      cards: { y: 340, w: 380, h: 300, xs: [120, 530] },
      nour: { x: 940, y: 390, w: 470 },
      samir: { x: 1380, y: 385, w: 470 },
      coachTag: { x: 1560, y: 320 },
      path: 'M 310 640 C 310 750 720 750 720 640 M 515 722 C 600 800 900 800 1100 700'
    },
    s5: {
      head: { x: 120, y: 100, w: 860, size: 80 },
      cards: { y: 340, w: 260, h: 150, xs: [120, 410, 700] },
      chips: { y: 580 },
      chosen: { y: 510 },
      nour: { x: 1050, y: 200, w: 510 },
      samir: { x: 1560, y: 220, w: 255 },
      path: 'M 250 580 C 250 540 255 520 250 490 M 540 580 C 540 540 540 520 540 490 M 830 580 C 830 540 825 520 830 490'
    },
    s6: {
      head: { x: 120, y: 140, w: 820, size: 84 },
      steps: { y: 560, xs: [150, 400, 650, 900] },
      nour: { x: 980, y: 230, w: 840 }
    },
    s7: {
      eyebrow: { x: 120, y: 170, w: 1200 },
      row: { y: 290, w: 540, h: 420, xs: [120, 690, 1260] }
    },
    s8: {
      align: 'start',
      logo: { x: 120, y: 170, h: 130 },
      tag: { x: 120, y: 330, w: 1050, size: 84 },
      cta: { x: 120, y: 540, w: 1050, size: 58 },
      button: { x: 120, y: 722 },
      url: { x: 120, y: 842 },
      path: 'M 1260 1120 C 1300 820 1560 820 1600 560 S 1760 240 1980 200'
    }
  }
};

// Native pixel size of each character layer (cut at 3x from the 1536x1024 model sheet).
export const CHAR_SIZE = {
  nour_front: [450, 1002], nour_3q: [396, 1002], nour_profile: [345, 1002],
  nour_listening: [576, 468], nour_curious: [576, 468], nour_encouraging: [579, 468],
  nour_seated: [942, 699], nour_options: [570, 720],
  samir_front: [435, 1002], samir_seated: [960, 696], samir_options: [594, 720],
  samir_listening: [648, 459], samir_curious: [612, 459], samir_encouraging: [660, 459]
};
