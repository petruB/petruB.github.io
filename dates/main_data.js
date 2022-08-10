export default {
  name: "Tablet Innovation",
  mode: "production", //(production , development)
  screensaver: {
    cancel: false,
    timer: 2 * 60, //second
    backgroundColor: "#000",
    // q1_4_3_urls: [
    //   // 4_3 1024*768
    //   "videos/tab_ino_screensaver.mp4",
    // ],
    q2_16_9_urls: [
      // 16_9 1920*1080
      "videos/tab_ino_screensaver.mp4",
    ],
    // h_9_16_urls: [
    //   // 9_16 1080*1920
    //   "videos/tab_ino_screensaver.mp4",
    // ],
  },
  mainButtons: [
    {
      id: "01",
      name: "Mehr als Fernsehen",
      buttonHeadline1: "",
      buttonHeadline2: "Einzigartige Vielfalt bei",
      buttonHeadline3: "Magenta",
      buttonHeadline4: "TV",
      footerText: "Exklusive Highlights für Serien-Fans",
      footerText2: "",
      mainButtonBackground: "images/main_button_background.png",
      videoURL: "videos/button_video_0.mp4",
      playButton: "images/play_icon.png",
    },
    {
      id: "02",
      name: "Einzigartiger Live-Sport mit MagentaTV",
      buttonHeadline1: "Magenta",
      buttonHeadline2: "Sport, DAZN und Sky",
      footerText: "Mehr als 1.700 Live-Events pro Jahr!",
      footerText2: "",
      mainButtonBackground: "images/main_button_background.png",
      // videoURL: "videos/button_video_1.mp4",
      poster: "images/sport_poster.png",
      playButton: "images/play_icon.png",
    },
    {
      id: "03",
      name: "Die ganze Welt der Musik",
      buttonHeadline1: "Magenta",
      buttonHeadline2: "Musik",
      footerText: "Konzerte aus aller Welt – live und in HD",
      footerText2: "",
      mainButtonBackground: "images/main_button_background.png",
      videoURL: "videos/button_video_2.mp4",
      playButton: "images/play_icon.png",
    },
    {
      id: "04",
      name: "Großes für die Kleinen",
      buttonHeadline1: "",
      buttonHeadline2: "Kinder",
      footerText: "Los geht’s – hinein ins Vergnügen",
      footerText2: "",
      mainButtonBackground: "images/main_button_background.png",
      videoURL: "videos/button_video_3.mp4",
      playButton: "images/play_icon.png",
    },
    {
      id: "05",
      name: "Helden fürs Heimkino",
      buttonHeadline1: "",
      buttonHeadline2: "Disney+",
      footerText: "Disney, Pixar, Marvel, Star Wars & Nat Geo",
      footerText2: "© 2020 Disney und seine verbundenen Unternehmen",
      mainButtonBackground: "images/main_button_background.png",
      videoURL: "videos/button_video_4.mp4",
      playButton: "images/play_icon.png",
    },
    {
      id: "06",
      name: "Bietet jetzt noch mehr",
      buttonHeadline1: "",
      buttonHeadline2: "TVNow Premium bei MagentaTV",
      footerText: "Mehr Unterhaltung mit TVNOW Premium",
      footerText2: "",
      mainButtonBackground: "images/main_button_background.png",
      videoURL: "videos/button_video_5.mp4",
      playButton: "images/play_icon.png",
    },
  ],
};
