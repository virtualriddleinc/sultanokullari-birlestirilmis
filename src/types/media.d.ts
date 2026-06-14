/** Bundler tarafından URL string'e dönüştürülen video asset bildirimleri */
declare module "*.mov" {
  const src: string;
  export default src;
}

declare module "*.MOV" {
  const src: string;
  export default src;
}

declare module "*.JPG" {
  import type { StaticImageData } from "next/image";
  const content: StaticImageData;
  export default content;
}
