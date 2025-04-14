import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IcLineDown,
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
  hideLoading,
  resetDataAddSession,
  resetDataCancelSession,
  showLoading,
} from "../features";
import {
  getIconPaymentMethod,
  getLabelPaymentMethod,
  moments,
  rupiah,
} from "../helpers";
import { AppDispatch, RootState } from "../store";

const TransactionDetails = () => {
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const { id, type } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);
  const cancelSession = useSelector((state: RootState) => state.cancelSession);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);

  useEffect(() => {
    dispatch(resetDataAddSession());
    getData();
  }, []);

  // Manage response cancel session
  useEffect(() => {
    if (cancelSession?.loading) dispatch(showLoading());
    else
      setTimeout(() => {
        dispatch(hideLoading());
      }, 1000);

    if (cancelSession?.data) {
      dispatch(resetDataCancelSession());
      getData();
    }
  }, [cancelSession]);

  useEffect(() => {
    if (detailSession?.data?.Transaction?.Status === 2) {
      setIsRunning(true);
    } else if (isRunning && detailSession?.data?.Transaction?.Status === 1) {
      setIsRunning(false);
      navigate(`/payment-success/${detailSession?.data?.ID}`);
    }

    if (detailSession?.data?.Transaction?.Status === 1) setIsShow(true);
    else setIsShow(false);
  }, [detailSession?.data]);

  useEffect(() => {
    if (isRunning) timeoutProgress();
  }, [isRunning]);

  const getData = () => {
    dispatch(fetchDetailSession(Number(id)));
  };

  const timeoutProgress = () => {
    const timer = setTimeout(() => {
      getData();
    }, 3000); // 3 second

    return () => clearTimeout(timer);
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

  const status: number = detailSession?.data?.Transaction?.Status || 0;
  let duration: number = 0;

  if (status === 2) {
    const diff = moments(detailSession?.data?.ExpiredAt).diff(
      moments(),
      "second"
    );
    duration = diff > 0 ? diff : 0;
  }

  const onDismiss = () => {
    if (location?.state?.isGoOrder) navigate("/home/order");
    else navigate(-1);
  };

  const IconPayment = getIconPaymentMethod(
    (detailSession?.data?.Transaction?.PaymentMethod || "")
      .split("_")[0]
      .toLocaleLowerCase()
  );
  const labelPayment = getLabelPaymentMethod(
    (detailSession?.data?.Transaction?.PaymentMethod || "")
      .replace("_TU", "")
      .toLocaleLowerCase()
  );

  const isShowRefund: boolean =
    Number(detailSession?.data?.Transaction?.WalletUsedAmount || 0) > 0 &&
    (status === 3 || status === 4)
      ? true
      : false;

  return (
    <div className="background-1 py-[14px] px-4">
      <Header type="secondary" title="Detail Transaksi" onDismiss={onDismiss} />

      <LoadingPage loading={detailSession?.loading}>
        <div className="flex flex-col gap-2 items-center justify-center my-7 ">
          {status === 1 ? (
            <IcSuccessGreen />
          ) : (
            <IcTimerCircle
              className={status === 3 ? "text-red" : "text-orange"}
            />
          )}

          {status === 1 || status === 3 ? (
            <span className="font-medium text-blackBold">
              {`Transaksi ${status === 1 ? "Selesai" : "Expired"}`}
            </span>
          ) : (
            <CountdownTimer
              label="Berlaku"
              initialSeconds={duration}
              onFinish={getData}
            />
          )}
        </div>

        <div
          id="receipt"
          className="relative p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow"
        >
          {status !== 1 && (
            <>
              <div className="between-x">
                <div>
                  <span className="text-blackBold font-medium flex flex-col">
                    Nominal Pembayaran
                  </span>

                  <span className="text-base font-semibold text-primary100">
                    {`Rp${rupiah(detailSession?.data?.Transaction?.DueAmount)}`}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsShow(!isShow)}
                  className="row gap-1 py-1.5 px-[14px] bg-primary10 border border-primary50 rounded-full"
                >
                  <span className="text-xs text-primary100 font-medium">
                    Lihat Detail
                  </span>

                  <div
                    className={`transform transition-transform duration-500 ${
                      isShow ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <IcLineDown className="w-[12px] h-auto text-primary100" />
                  </div>
                </button>
              </div>

              <Separator className="!bg-baseLightGray mb-4 mt-2.5" />

              <BetweenText
                labelLeft="Metode Pembayaran"
                labelRight={""}
                content={
                  <div className="row">
                    <IconPayment className="w-6 h-auto mr-1.5" />

                    <span className="text-base font-medium">
                      {labelPayment}
                    </span>
                  </div>
                }
              />

              <Separator className="my-4" />
            </>
          )}

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

          {status !== 1 && (
            <BetweenText
              labelLeft="Referensi Sesi ID"
              labelRight={detailSession?.data?.ID || "-"}
              className="pt-4"
            />
          )}

          {isShow && (
            <>
              <BetweenText
                labelLeft="Tipe Transaksi"
                labelRight="Pengisisan Daya"
                classNameLabelRight="font-medium text-black100"
                className="mb-2 mt-4"
              />

              <BetweenText
                labelLeft="Referensi Sesi ID"
                labelRight={detailSession?.data?.ID || "-"}
                className="border-y border-black10 py-2"
              />

              <BetweenText
                labelLeft="Metode Pembayaran"
                labelRight={getLabelPaymentMethod(
                  (detailSession?.data?.Transaction?.PaymentMethod || "")
                    .replace("_TU", "")
                    .toLocaleLowerCase()
                )}
                className="my-2"
              />

              <BetweenText
                labelLeft="Nominal Pengecasan"
                labelRight={`Rp${rupiah(
                  detailSession?.data?.Transaction?.Amount
                )}`}
                className="border-y border-black10 py-2"
              />

              <BetweenText
                labelLeft="Admin Fee"
                labelRight={`Rp${rupiah(
                  detailSession?.data?.Transaction?.TotalFee
                )}`}
                className="my-2"
              />

              {/* <BetweenText
            labelLeft="Service Fee"
            labelRight={detailSession?.data?.ChargingFee || "-"}
            className="border-t border-black10 py-2"
          /> */}

              <BetweenText
                labelLeft="Pembayaran Casan Wallet"
                labelRight={`Rp${rupiah(
                  detailSession?.data?.Transaction?.WalletUsedAmount
                )}`}
                className="border-t border-t-black10 py-2"
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

              {isShowRefund && (
                <BetweenText
                  labelLeft="Pengembalian Dana"
                  labelRight={`Rp${rupiah(detailSession?.data?.RefundAmount)}`}
                  className="my-2"
                />
              )}
            </>
          )}

          {status !== 3 && (
            <>
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
            </>
          )}
        </div>
      </LoadingPage>
    </div>
  );
};

export default TransactionDetails;
