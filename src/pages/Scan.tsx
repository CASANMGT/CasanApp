import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IcInfoCircleBlack } from "../assets";
import { ERROR_MESSAGE } from "../common";
import { Header } from "../components";
import { isValidURL, openURL } from "../helpers";

const Scan = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = new BrowserMultiFormatReader();

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [torchOn, setTorchOn] = useState(false);

  const isUseMobile: boolean = useIsMobile();

  useEffect(() => {
    const startScanner = async () => {
      try {
        const constraints = {
          video: isUseMobile
            ? {
                facingMode: { exact: "environment" }, // Rear camera
              }
            : { facingMode: "environment" },
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(
          constraints
        );

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play();
        }

        if (isUseMobile) setStream(mediaStream);

        // Decode barcode once from video
        const result = await codeReader.decodeOnceFromStream(
          mediaStream,
          videoRef.current!
        );

        onNext(result.getText()); // Save the scanned result

        mediaStream.getTracks().forEach((track) => track.stop());
      } catch (error) {
        console.error("Error scanning barcode:", error);
      }
    };

    // Start scanning when the component mounts
    startScanner();

    return () => {
      codeReader.reset();
    };
  }, []);

  useEffect(() => {
    if (isUseMobile) toggleTorch();
  }, [stream]);

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

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = (result: string) => {
    const check = isValidURL(result);
    if (check) openURL(result);
    else alert(ERROR_MESSAGE);
  };

  return (
    <div className="container-screen !bg-black overflow-hidden flex flex-col relative">
      <Header
        className="z-10"
        type="secondary"
        title="Scan Barcode"
        onDismiss={onDismiss}
      />

      {/* Video Feed */}
      <video ref={videoRef} className="absolute w-full h-full object-cover" />

      <div className="relative flex-1 flex flex-col items-center justify-center">
        {/* Scanner Overlay */}
        <div className="relative w-[210px] h-[210px]">
          {/* Animated Corners */}
          <div className="absolute top-0 left-0 w-[70px] h-[70px] border-t-4 border-l-4 rounded-tl-[40px] border-white"></div>
          <div className="absolute top-0 right-0 w-[70px] h-[70px] border-t-4 border-r-4 rounded-tr-[40px] border-white"></div>
          <div className="absolute bottom-0 left-0 w-[70px] h-[70px] border-b-4 border-l-4 rounded-bl-[40px] border-white"></div>
          <div className="absolute bottom-0 right-0 w-[70px] h-[70px] border-b-4 border-r-4 rounded-br-[40px] border-white"></div>

          {/* Scanning Line */}
          <div className="absolute w-full h-0.5 bg-white animate-scan"></div>
        </div>

        <div className="rounded-2xl bg-black5 p-3 row gap-2 mt-[90px]">
          <IcInfoCircleBlack />
          <p className="text-xs font-semibold">
            Scan barcode yang ada di device
          </p>
        </div>
      </div>
    </div>
  );
};

export default Scan;

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const userAgent = navigator.userAgent || navigator.vendor;
    const mobile = /android|iphone|ipad|ipod/i.test(userAgent);
    const touch = "ontouchstart" in window || navigator.maxTouchPoints > 0;

    setIsMobile(mobile && touch);
  }, []);

  return isMobile;
};
