import { capitalize } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import {
  IcSaveGreen,
  IcShareGreen2,
  IcSuccessGreen,
  IcTimerCircle,
} from "../assets";
import {
  BetweenText,
  Button,
  CountdownTimer,
  Header,
  LoadingPage,
  Separator,
} from "../components";
import {
  fetchCancelSession,
  fetchDetailSession,
  resetDataAddSession,
  resetDataCancelSession,
} from "../features";
import { moments, rupiah } from "../helpers";
import { AppDispatch, RootState } from "../store";

const TransactionHistoryDetails = () => {
  const navigate: NavigateFunction = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);
  const addSession = useSelector((state: RootState) => state.addSession);
  const cancelSession = useSelector((state: RootState) => state.cancelSession);

  useEffect(() => {
    dispatch(fetchDetailSession(62));
    getData();
  }, []);

  // Manage response cancel session
  useEffect(() => {
    if (cancelSession?.data) {
      dispatch(resetDataCancelSession());
      getDetails();
    }
  }, [cancelSession?.data]);

  // useEffect(() => {
  //   if (detailSession?.data?.Transaction?.Status === 2) timeoutProgress();
  // }, [detailSession?.data]);

  const getData = () => {
    if (addSession?.data?.ID) {
      dispatch(fetchDetailSession(addSession?.data?.ID));
      dispatch(resetDataAddSession());
    }
  };

  const getDetails = () => {
    if (detailSession?.data?.ID)
      dispatch(fetchDetailSession(detailSession?.data?.ID));
  };

  const timeoutProgress = () => {
    const timer = setTimeout(() => {
      getDetails;
    }, 3000); // 3 second

    return () => clearTimeout(timer);
  };

  const onDismiss = () => {
    navigate(-1);
  };

  const handleShare = () => {
    const receiptElement = document.getElementById("receipt");
    if (!receiptElement) return;

    const receiptText = receiptElement.innerText;

    if (navigator.share) {
      navigator
        .share({
          title: "Informasi Transaksi",
          text: receiptText,
        })
        .then(() => console.log("Shared successfully"))
        .catch((error) => console.error("Error sharing:", error));
    } else {
      alert("Sharing is not supported on this browser.");
    }
  };

  const handleSave = async () => {
    const receiptElement = document.getElementById("receipt"); // Ensure the receipt has an ID
    if (!receiptElement) return;

    const canvas = await html2canvas(receiptElement);
    const image = canvas.toDataURL("image/png");

    const link = document.createElement("a");
    link.href = image;
    link.download = "receipt.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const status: number = 1; // detailSession?.data?.Transaction?.Status || 0;
  let duration: number = 0;

  if (status === 2) {
    const diff = moments(detailSession?.data?.ExpiredAt).diff(
      moments(),
      "second"
    );
    duration = diff > 0 ? diff : 0;
  }

  return (
    <div className="background-1 py-[14px] px-4">
      <Header type="secondary" title="Detail Transaksi" onDismiss={onDismiss} />

      <LoadingPage loading={detailSession?.loading}>
        <div className="flex flex-col gap-2 items-center justify-center my-7 ">
          {status === 1 ? (
            <IcSuccessGreen />
          ) : (
            <IcTimerCircle className="text-orange" />
          )}

          {status === 1 ? (
            <span className="font-medium text-blackBold">
              Transaksi Selesai
            </span>
          ) : (
            <CountdownTimer
              label="Berlaku"
              initialSeconds={duration}
              onFinish={getDetails}
            />
          )}
        </div>

        <div
          id="receipt"
          className="relative p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow"
        >
          <p className="font-medium mb-2">Informasi Transaksi</p>
          <div className="text-black100/70 row gap-2">
            <p className="text-xs">
              {moments(detailSession?.data?.Transaction?.CreatedAt).format(
                "DD MMMM YYYY"
              )}
            </p>
            <p className="text-xs">
              {moments(detailSession?.data?.Transaction?.CreatedAt).format(
                "HH:mm WIB"
              )}
            </p>
            <p className="text-xs">{`ID${detailSession?.data?.TransactionID}`}</p>
          </div>

          <Separator className="my-4 bg-black10" />

          <p className="text-xs text-black100/70  mb-2">Detail Transaksi</p>

          <BetweenText
            labelLeft="Tipe Transaksi"
            labelRight="Pengisisan Daya"
            classNameLabelRight="font-medium text-black100"
            className="mb-2"
          />

          <BetweenText
            labelLeft="Referensi Sesi ID"
            labelRight={detailSession?.data?.ID || "-"}
            className="border-y border-black10 py-2"
          />

          <BetweenText
            labelLeft="Metode Pembayaran"
            labelRight={capitalize(
              (detailSession?.data?.Transaction?.PaymentMethod || "")
                .replace("_TU", "")
                .toLocaleLowerCase()
            )}
            className="my-2"
          />

          <BetweenText
            labelLeft="Nominal Pengecasan"
            labelRight={`Rp${rupiah(detailSession?.data?.Transaction?.Amount)}`}
            className="border-y border-black10 py-2"
          />

          <BetweenText
            labelLeft="Admin Fee"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.TotalFee
            )}`}
            className="my-2"
          />

          <BetweenText
            labelLeft="Service Fee"
            labelRight={`Rp${rupiah(detailSession?.data?.ChargingFee || 0)}`}
            className="border-t border-black10 py-2"
          />

          <BetweenText
            labelLeft="Total Transaksi"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.DueAmount
            )}`}
            className="border-y border-black100 py-2"
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100 font-medium"
          />

          <BetweenText
            labelLeft="Pembayaran Casan Wallet"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.WalletUsedAmount
            )}`}
            className="mt-2"
          />

          <Separator className="my-6 bg-black10" />

          {status === 1 ? (
            <div className="between-x gap-6">
              <Button
                type="secondary"
                label="Bagikan Resi"
                iconRight={IcShareGreen2}
                onClick={handleShare}
              />
              <Button
                type="secondary"
                label="Simpan Resi"
                iconRight={IcSaveGreen}
                onClick={handleSave}
              />
            </div>
          ) : (
            <div className="between-y gap-4">
              <button
                onClick={() =>
                  window.open(
                    detailSession?.data?.Transaction?.DeepLinkRedirectURL,
                    "_blank"
                  )
                }
                className="btn-secondary w-full h-[38px] flex gap-1 border rounded-full text-sm justify-center items-center flex drop-shadow"
              >
                <span>Lanjutkan Pembayaran</span>
                <span className="font-semibold">{`Rp${rupiah(
                  detailSession?.data?.Transaction?.DueAmount
                )}`}</span>
              </button>

              <Button
                type="danger"
                label="Cancel"
                onClick={() =>
                  dispatch(fetchCancelSession(detailSession?.data?.ID || 0))
                }
              />
            </div>
          )}
        </div>
      </LoadingPage>
    </div>
  );
};

export default TransactionHistoryDetails;
