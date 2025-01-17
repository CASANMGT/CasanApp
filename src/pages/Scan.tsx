import { BrowserMultiFormatReader } from "@zxing/browser";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IcInfoCircleBlack } from "../assets";
import { Header } from "../components";

const Scan = () => {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [scannedCode, setScannedCode] = useState<string | null>(null);
  const [error, setError] = useState<string | null>();

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    let videoStream: MediaStream | null = null;

    const startScanner = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoInputDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );

        if (videoInputDevices.length === 0) {
          throw new Error("No video input devices found.");
        }

        videoStream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: videoInputDevices[0].deviceId },
          audio: false,
        });

        if (videoRef.current) {
          videoRef.current.srcObject = videoStream;
          videoRef.current.play();
        }

        codeReader.decodeFromVideoDevice(
          videoInputDevices[0].deviceId,
          videoRef.current!,
          (result, err) => {
            if (result) {
              setScannedCode(result.getText());
              navigate("/session-settings");
            }
            if (err) {
              // Handle errors silently or display if needed
              console.warn(err);
            }
          }
        );
      } catch (err: any) {
        setError(`Error starting scanner: ${err.message}`);
      }
    };

    startScanner();

    return () => {
      if (videoStream) {
        videoStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const onDismiss = () => {
    navigate(-1);
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

        <div
          onClick={() => navigate("/session-settings")}
          className="rounded-2xl bg-black5 p-3 row gap-2 mt-[90px]"
        >
          <IcInfoCircleBlack />
          <p className="text-xs font-semibold">
            Scan barcode yang ada di device
          </p>
        </div>

        {error && <p className="text-red-500 absolute bottom-4">{error}</p>}
      </div>
    </div>
  );
};

export default Scan;
