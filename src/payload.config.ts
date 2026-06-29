import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { en } from "@payloadcms/translations/languages/en";
import { tr } from "@payloadcms/translations/languages/tr";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Branches } from "./collections/Branches";
import { ContactMessages } from "./collections/ContactMessages";
import { Events } from "./collections/Events";
import { HeroSlides } from "./collections/HeroSlides";
import { IkApplications } from "./collections/IkApplications";
import { InstagramPosts } from "./collections/InstagramPosts";
import { JourneyChapters } from "./collections/JourneyChapters";
import { Media } from "./collections/Media";
import { NedenSultanItems } from "./collections/NedenSultanItems";
import { News } from "./collections/News";
import { Pages } from "./collections/Pages";
import { Staff } from "./collections/Staff";
import { Users } from "./collections/Users";
import { AnaSayfa } from "./globals/AnaSayfa";
import { SiteAyarlari } from "./globals/SiteAyarlari";
import { buildPreviewUrl } from "./lib/preview-url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: "Sultan Okulları Yönetim Paneli",
      description: "Ana sayfa, şubeler, haberler ve form başvurularını yönetin.",
      icons: [
        {
          rel: "icon",
          type: "image/svg+xml",
          url: "/logo.svg",
        },
      ],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    components: {
      beforeLogin: ["@/components/payload/admin/AdminLoginBackdrop"],
      beforeDashboard: ["@/components/payload/admin/DashboardWelcome"],
      beforeNavLinks: ["@/components/payload/admin/InboxNavLinks"],
      afterNavLinks: [],
      graphics: {
        Logo: "@/components/payload/admin/AdminLogo",
        Icon: "@/components/payload/admin/AdminIcon",
      },
    },
    livePreview: {
      url: () => buildPreviewUrl("/"),
      breakpoints: [
        {
          label: "Mobil",
          name: "mobile",
          width: 375,
          height: 667,
        },
        {
          label: "Masaüstü",
          name: "desktop",
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  i18n: {
    supportedLanguages: { tr, en },
    fallbackLanguage: "tr",
  },
  collections: [
    HeroSlides,
    JourneyChapters,
    NedenSultanItems,
    InstagramPosts,
    Branches,
    News,
    Events,
    Pages,
    Staff,
    ContactMessages,
    IkApplications,
    Media,
    Users,
  ],
  globals: [AnaSayfa, SiteAyarlari],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  sharp,
});
