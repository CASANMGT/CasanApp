// TorchVideo.tsx
import React, { useEffect, useRef, useState } from "react";

const TorchVideo: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  useEffect(() => {
    const getCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: { exact: "environment" }, // Rear camera
          },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }

        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
      }
    };

    getCamera();

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const toggleTorch = async () => {
    if (!stream) return;

    const videoTrack = stream.getVideoTracks()[0];
    const capabilities = (videoTrack.getCapabilities?.() || {}) as {
      torch?: boolean;
    };

    if (capabilities.torch) {
      try {
        const constraints = {
          advanced: [{ torch: !torchOn }],
        } as MediaTrackConstraints & { advanced: Array<{ torch: boolean }> };

        await videoTrack.applyConstraints(constraints);
        setTorchOn(!torchOn);
      } catch (err) {
        console.error("Torch toggle failed:", err);
      }
    } else {
      console.warn("Torch not supported on this device.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full max-w-md rounded-xl shadow-lg"
      />
      <button
        onClick={toggleTorch}
        className="px-4 py-2 rounded-lg bg-yellow-500 text-white shadow-md"
      >
        {torchOn ? "Turn Off Flashlight" : "Turn On Flashlight"}
      </button>
    </div>
  );
};

export default TorchVideo;
