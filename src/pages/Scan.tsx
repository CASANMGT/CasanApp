import { BrowserMultiFormatReader } from "@zxing/library";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { IcInfoCircleBlack } from "../assets";
import { Header } from "../components";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import { setFromGlobal } from "../features";

const Scan = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const codeReader = new BrowserMultiFormatReader();

  useEffect(() => {
    dispatch(
      setFromGlobal({
        type: "paymentMethod",
        value: "",
      })
    );
    
    navigate(`/session-settings/${999}`);
  }, []);

  useEffect(() => {
    if (false) {
      const startScanner = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
          });

          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          }

          // Decode barcode once from video
          const result = await codeReader.decodeOnceFromStream(
            stream,
            videoRef.current!
          );

          onNext(result.getText()); // Save the scanned result

          stream.getTracks().forEach((track) => track.stop());
        } catch (error) {
          console.error("Error scanning barcode:", error);
        }
      };

      // Start scanning when the component mounts
      startScanner();

      return () => {
        codeReader.reset();
      };
    }
  }, []);

  const onDismiss = () => {
    navigate(-1);
  };

  const onNext = (result: string) => {
    navigate(`/session-settings/${result}`);
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
