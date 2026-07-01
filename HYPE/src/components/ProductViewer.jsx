import { useRef, useEffect, useState } from "react";
import "@google/model-viewer";

export default function ProductViewer({ src, alt, style }) {
  const viewerRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const el = viewerRef.current;
    if (!el) return;

    const onProgress = (e) => setProgress(e.detail.totalProgress * 100);
    const onLoad = () => setLoaded(true);

    el.addEventListener("progress", onProgress);
    el.addEventListener("load", onLoad);
    return () => {
      el.removeEventListener("progress", onProgress);
      el.removeEventListener("load", onLoad);
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        borderRadius: "14px",
        overflow: "hidden",
        background: "#faf8f5",
        ...style,
      }}
    >
      {!loaded && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            zIndex: 1,
            background: "#faf8f5",
          }}
        >
          <div
            style={{
              width: "60%",
              maxWidth: "240px",
              height: "3px",
              background: "#f1f0ee",
              borderRadius: "2px",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${progress}%`,
                background: "#d97706",
                transition: "width 0.3s ease",
              }}
            />
          </div>
          <div
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "13px",
              color: "#94a3b8",
            }}
          >
            Loading 3D model...
          </div>
        </div>
      )}

      <model-viewer
        ref={viewerRef}
        src={src}
        alt={alt}
        camera-controls
        auto-rotate
        rotation-per-second="30deg"
        loading="eager"
        reveal="auto"
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}
