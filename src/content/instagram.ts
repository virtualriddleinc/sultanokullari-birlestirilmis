export type InstagramPost = {
  id: string;
  url: string;
  kind: "post" | "reel";
  title: string;
  description?: string;
  videoSrc?: string;
};

export const instagramProfileUrl = "https://www.instagram.com/sultanokullari/";
export const instagramHandle = "@sultanokullari";

export const instagramPosts: InstagramPost[] = [
  {
    id: "VID-20260429-WA0161",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 01",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0161.mp4",
  },
  {
    id: "VID-20260429-WA0163",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 02",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0163.mp4",
  },
  {
    id: "VID-20260429-WA0165",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 03",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0165.mp4",
  },
  {
    id: "VID-20260429-WA0168",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 04",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0168.mp4",
  },
  {
    id: "VID-20260429-WA0179",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 05",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0179.mp4",
  },
  {
    id: "VID-20260429-WA0180",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 06",
    description: "Okul atmosferinden kısa video kesiti.",
    videoSrc: "/social-media/VID-20260429-WA0180.mp4",
  },
  {
    id: "VID-20260429-WA0169",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 07",
    description: "Sultan Okulları’ndan kısa video paylaşımı.",
    videoSrc: "/social-media/VID-20260429-WA0169.mp4",
  },
  {
    id: "VID-20260429-WA0178",
    url: instagramProfileUrl,
    kind: "reel",
    title: "Sosyal medya vitrini - 08",
    description: "Resmî Instagram hesabından seçili Reels içeriği.",
    videoSrc: "/social-media/VID-20260429-WA0178.mp4",
  },
];
