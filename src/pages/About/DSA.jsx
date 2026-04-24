import Barkemeyer from "../../assets/Barkemeyer.png";
import { useEffect, useState } from "react";

export default function DSA() {
  const [glowRGB, setGlowRGB] = useState("134 18 18"); // fallback Lowell red

  useEffect(() => {
    let cancelled = false;

    async function computeGlowColor() {
      try {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = Barkemeyer;

        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });

        // Downsample for speed and performance.
        const canvas = document.createElement("canvas");
        const size = 100;
        canvas.width = size;
        canvas.height = size;

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        // Average only pixels that aren't basically "black background".
        let rSum = 0;
        let gSum = 0;
        let bSum = 0;
        let count = 0;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          if (a === 0) continue;

          // brightness in [0..255]
          const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;
          if (brightness < 28) continue;

          rSum += r;
          gSum += g;
          bSum += b;
          count += 1;
        }

        if (cancelled || count === 0) return;

        const rAvg = Math.round(rSum / count);
        const gAvg = Math.round(gSum / count);
        const bAvg = Math.round(bSum / count);

        setGlowRGB(`${rAvg} ${gAvg} ${bAvg}`);
      } catch {
        // Keep fallback.
      }
    }

    computeGlowColor();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <div className="title">
        <h1>Directors of Student Activities</h1>
      </div>
      <section className="dsa dsa-page">
        <div className="dsa-card">
          <div
            className="dsa-photo-wrap"
            aria-hidden
            style={{ "--dsa-glow": glowRGB }}
          >
            <img
              src={Barkemeyer}
              alt="Mr. Barkemeyer"
              className="dsa-image"
            />
          </div>

          <div className="dsa-info">
            <h2 className="dsa-name">JACOB BARKEMEYER</h2>
            <p className="dsa-description">
              APUSH & Leadership Teacher, Badminton Coach, Director of Student
              Activities
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
