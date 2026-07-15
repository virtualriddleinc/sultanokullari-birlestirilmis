import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1c18",
          position: "relative",
        }}
      >
        {/* Dekoratif altıgen arka plan deseni */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            opacity: 0.06,
          }}
        >
          {/* Büyük altıgen dekoratif şekil */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              width: 900,
              height: 900,
              marginTop: -450,
              marginLeft: -450,
              borderRadius: "50%",
              border: "120px solid #4cff00",
              display: "flex",
            }}
          />
        </div>

        {/* Sol yeşil çizgi aksanı */}
        <div
          style={{
            position: "absolute",
            left: 60,
            top: "50%",
            marginTop: -100,
            width: 6,
            height: 200,
            background: "#4cff00",
            borderRadius: 3,
            display: "flex",
          }}
        />

        {/* Ana içerik */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            paddingLeft: 100,
            paddingRight: 100,
          }}
        >
          {/* Üst etiket */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginBottom: 8,
            }}
          >
            <div
              style={{
                width: 40,
                height: 2,
                background: "#4cff00",
                display: "flex",
              }}
            />
            <span
              style={{
                color: "#4cff00",
                fontSize: 20,
                letterSpacing: 6,
                textTransform: "uppercase",
                fontWeight: 400,
              }}
            >
              Resmî Web Sitesi
            </span>
            <div
              style={{
                width: 40,
                height: 2,
                background: "#4cff00",
                display: "flex",
              }}
            />
          </div>

          {/* Ana başlık */}
          <div
            style={{
              color: "#ffffff",
              fontSize: 88,
              fontWeight: 700,
              letterSpacing: 2,
              lineHeight: 1.1,
              textAlign: "center",
              display: "flex",
            }}
          >
            Sultan Okulları
          </div>

          {/* Alt metin */}
          <div
            style={{
              color: "#fff085",
              fontSize: 28,
              fontWeight: 400,
              textAlign: "center",
              letterSpacing: 1,
              marginTop: 8,
              display: "flex",
            }}
          >
            Millî ve Mânevî Değerlerle Bütünleşik Eğitim
          </div>

          {/* Kuruluş yılı ve şube bilgisi */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 20,
            }}
          >
            <span style={{ color: "#6b7566", fontSize: 18, display: "flex" }}>
              Est. 2017
            </span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#4cff00",
                display: "flex",
              }}
            />
            <span style={{ color: "#6b7566", fontSize: 18, display: "flex" }}>
              5 Şehir · 5 Kampüs
            </span>
            <div
              style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: "#4cff00",
                display: "flex",
              }}
            />
            <span style={{ color: "#6b7566", fontSize: 18, display: "flex" }}>
              Anaokulu · İlkokul · Ortaokul
            </span>
          </div>
        </div>

        {/* Alt domain */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            right: 60,
            color: "#4cff00",
            fontSize: 18,
            letterSpacing: 2,
            display: "flex",
          }}
        >
          sultanokullari.com.tr
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
