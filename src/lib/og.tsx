import { ImageResponse } from "next/og";
import { site } from "@/lib/content";

export const ogSize = {
  width: 1200,
  height: 630,
};

export const ogAlt = site.shareTitle;
export const ogContentType = "image/png";

export function generateOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0a0b0b",
          color: "#f2f2ee",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -100,
            top: -80,
            width: 560,
            height: 560,
            borderRadius: "50%",
            background: "#12393c",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 40,
            top: 60,
            width: 280,
            height: 280,
            borderRadius: "50%",
            background: "#0f5c62",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: -140,
            bottom: -180,
            width: 460,
            height: 460,
            borderRadius: "50%",
            background: "#0d2c30",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: "0.18em",
              color: "#00d6d6",
              textTransform: "uppercase",
            }}
          >
            {site.name.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: "0.22em",
              color: "rgba(242, 242, 238, 0.55)",
              textTransform: "uppercase",
            }}
          >
            {site.tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 20,
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              fontSize: 22,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "rgba(242, 242, 238, 0.65)",
            }}
          >
            <div style={{ width: 40, height: 2, background: "#00d6d6" }} />
            Senior Full-Stack Engineer
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 0.95,
              letterSpacing: "-0.04em",
            }}
          >
            <span>Charisis</span>
            <span style={{ color: "rgba(242, 242, 238, 0.38)" }}>Samaras</span>
          </div>
          <div
            style={{
              display: "flex",
              maxWidth: 780,
              fontSize: 28,
              lineHeight: 1.35,
              color: "rgba(242, 242, 238, 0.72)",
            }}
          >
            {site.shareDescription}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: 28,
            position: "relative",
            fontSize: 22,
            color: "rgba(242, 242, 238, 0.55)",
          }}
        >
          <span>charisiss.gr</span>
          <span style={{ color: "#00d6d6" }}>Available for projects</span>
        </div>
      </div>
    ),
    { ...ogSize },
  );
}
