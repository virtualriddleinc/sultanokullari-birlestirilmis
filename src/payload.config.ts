import { postgresAdapter } from "@payloadcms/db-postgres";
import { nodemailerAdapter } from "@payloadcms/email-nodemailer";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { en } from "@payloadcms/translations/languages/en";
import { tr } from "@payloadcms/translations/languages/tr";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { ApplicationFiles } from "./collections/ApplicationFiles";
import { AuditLogs } from "./collections/AuditLogs";
import { Branches } from "./collections/Branches";
import { ContactMessages } from "./collections/ContactMessages";
import { Events } from "./collections/Events";
import { HeroSlides } from "./collections/HeroSlides";
import { IkApplications } from "./collections/IkApplications";
import { InstagramPosts } from "./collections/InstagramPosts";
import { JourneyChapters } from "./collections/JourneyChapters";
import { Media } from "./collections/Media";
import { MediaItems } from "./collections/MediaItems";
import { NedenSultanItems } from "./collections/NedenSultanItems";
import { News } from "./collections/News";
import { Pages } from "./collections/Pages";
import { Staff } from "./collections/Staff";
import { Users } from "./collections/Users";
import { AnaSayfa } from "./globals/AnaSayfa";
import { Navigation } from "./globals/Navigation";
import { SiteAyarlari } from "./globals/SiteAyarlari";
import { assertCmsEnv } from "./lib/env";
import { buildPreviewUrl } from "./lib/preview-url";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

const { payloadSecret, databaseUrl } = assertCmsEnv();

const s3Enabled = Boolean(process.env.S3_BUCKET?.trim());
const smtpHost = process.env.SMTP_HOST?.trim();

const emailAdapter = smtpHost
  ? await nodemailerAdapter({
      defaultFromAddress:
        process.env.SMTP_FROM?.trim() || "noreply@sultanokullari.com",
      defaultFromName: process.env.SMTP_FROM_NAME?.trim() || "Sultan Okulları",
      transportOptions: {
        host: smtpHost,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === "true",
        auth:
          process.env.SMTP_USER && process.env.SMTP_PASS
            ? {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
              }
            : undefined,
      },
    })
  : undefined;

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
      beforeNavLinks: [
        "@/components/payload/admin/AdminHomeNavLink",
        "@/components/payload/admin/InboxNavLinks",
      ],
      afterNavLinks: [],
      graphics: {
        Logo: "@/components/payload/admin/AdminLogo",
        Icon: "@/components/payload/admin/AdminIcon",
      },
      logout: {
        Button: "@/components/payload/admin/AdminLogoutButton",
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
    translations: {
      tr: {
        error: {
          unknown: "Bir şeyler ters gitti.",
          unspecific: "Bir şeyler ters gitti.",
          problemUploadingFile: "Dosya yüklenirken bir sorun oluştu.",
        },
        general: {
          error: "Bir şeyler ters gitti.",
          somethingWentWrong: "Bir şeyler ters gitti.",
          errors: "Hatalar",
          or: "veya",
        },
        fields: {
          chooseBetweenCustomTextOrDocument:
            "Özel bir URL girmek veya başka bir belgeye bağlanmak arasında seçim yapın.",
          itemsAndMore: "{{items}} ve {{count}} tane daha",
          labelRelationship: "{{label}} ilişkisi",
          relationTo: "İlişki",
          swapRelationship: "İlişkiyi değiştir",
        },
        validation: {
          invalidBlocks:
            "Bu alan artık izin verilmeyen bloklar içeriyor: {{blocks}}.",
          invalidSelections: "Bu alanda geçersiz seçimler var:",
          shorterThanMax:
            "Bu değer en fazla {{maxLength}} karakter uzunluğunda olabilir.",
          longerThanMin:
            "Bu değer en az {{minLength}} karakter uzunluğunda olmalıdır.",
        },
        upload: {
          dragAndDrop: "Bir dosyayı sürükleyip bırakabilirsiniz",
          dragAndDropHere: "veya buraya bir dosya sürükleyip bırakabilirsiniz",
        },
      },
    },
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
    ApplicationFiles,
    Media,
    MediaItems,
    AuditLogs,
    Users,
  ],
  globals: [AnaSayfa, SiteAyarlari, Navigation],
  editor: lexicalEditor(),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
    push: false,
    migrationDir: path.resolve(dirname, "migrations"),
  }),
  email: emailAdapter,
  graphQL: {
    disable: process.env.PAYLOAD_GRAPHQL_ENABLED !== "true",
  },
  plugins: [
    s3Storage({
      enabled: s3Enabled,
      collections: {
        media: true,
        "application-files": true,
      },
      bucket: process.env.S3_BUCKET || "unused",
      config: {
        credentials:
          process.env.S3_ACCESS_KEY_ID && process.env.S3_SECRET_ACCESS_KEY
            ? {
                accessKeyId: process.env.S3_ACCESS_KEY_ID,
                secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
              }
            : undefined,
        region: process.env.S3_REGION || "auto",
        endpoint: process.env.S3_ENDPOINT || undefined,
        forcePathStyle: Boolean(process.env.S3_ENDPOINT),
      },
    }),
  ],
  sharp,
  hooks: {
    afterError: [
      async ({ result }) => {
        if (!result || typeof result !== "object") return;
        const message =
          "message" in result && typeof result.message === "string"
            ? result.message
            : null;
        if (
          message === "Something went wrong." ||
          message === "Something went wrong" ||
          message === "There was an error initializing Payload"
        ) {
          return {
            response: {
              ...result,
              message:
                message === "There was an error initializing Payload"
                  ? "Payload başlatılırken bir hata oluştu."
                  : "Bir şeyler ters gitti.",
            },
          };
        }
      },
    ],
  },
});
