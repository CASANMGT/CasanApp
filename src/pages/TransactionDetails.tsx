import html2canvas from "html2canvas";
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  NavigateFunction,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  IcLineDown,
  IcQrisLabel,
  IcRightCircleGreen,
  IcSaveGreen,
  IcShareGreen2,
  IcSuccessGreen,
  IcTimerCircle,
} from "../assets";
import { ERROR_MESSAGE } from "../common";
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
  fetchTransactionById,
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
  const qrRef = useRef<HTMLCanvasElement | null>(null);
  const navigate: NavigateFunction = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const transactionById = useSelector(
    (state: RootState) => state.transactionById
  );
  const cancelSession = useSelector((state: RootState) => state.cancelSession);

  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isShow, setIsShow] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>();

  console.log("cek transactionById", transactionById?.data);

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
    if (transactionById?.data?.Status === 2) {
      const diff = moments(transactionById?.data?.Session?.ExpiredAt).diff(
        moments(),
        "second"
      );
      const newDuration = diff > 0 ? diff : 0;

      setDuration(newDuration);
      setIsRunning(true);
    } else if (isRunning && transactionById?.data?.Status === 1) {
      setIsRunning(false);
      navigate(`/payment-success/${transactionById?.data?.SessionID}`);
    }

    if (transactionById?.data?.Status === 1) setIsShow(true);
    else setIsShow(false);
  }, [transactionById?.data]);

  useEffect(() => {
    if (isRunning) timeoutProgress();
  }, [isRunning]);

  const getData = () => {
    if (id) dispatch(fetchTransactionById(Number(id)));
    else {
      alert("Can't find transaction ID");
      onDismiss();
    }
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

  const handleSave = async (isQris?: boolean) => {
    if (isQris) {
      const canvas = qrRef.current;
      if (!canvas) return;

      const pngUrl = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");

      const downloadLink = document.createElement("a");
      downloadLink.href = pngUrl;
      downloadLink.download = "qr-code.png";
      downloadLink.click();
    } else {
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
    }
  };

  const status: number = transactionById?.data?.Status || 0;

  const transactionType: number = transactionById?.data?.Type || 0;

  const onDismiss = () => {
    if (location?.state?.isGoOrder) navigate("/home/order", { replace: true });
    else if (location?.state?.isGoHome) navigate("/home", { replace: true });
    else navigate(-1);
  };

  const onViewSession = () => {
    let nextPage = "charging";

    if (transactionById?.data?.Session?.Status === 6)
      nextPage = "session-details";

    if (transactionById?.data?.Session?.ID)
      navigate(`/${nextPage}/${transactionById?.data?.Session?.ID}`);
    else alert(ERROR_MESSAGE);
  };

  const IconPayment = getIconPaymentMethod(
    (transactionById?.data?.PaymentMethod || "")
      .split("_")[0]
      .toLocaleLowerCase()
  );
  const labelPayment = getLabelPaymentMethod(
    (transactionById?.data?.PaymentMethod || "")
      .replace("_TU", "")
      .toLocaleLowerCase()
  );

  const isShowRefund: boolean =
    Number(transactionById?.data?.WalletUsedAmount || 0) > 0 &&
    (status === 3 || status === 4)
      ? true
      : false;

  return (
    <div className="background-1 py-[14px] px-4">
      <Header type="secondary" title="Detail Transaksi" onDismiss={onDismiss} />

      <LoadingPage loading={transactionById?.loading}>
        <div className="flex flex-col gap-2 items-center justify-center my-7 ">
          {status === 1 ? (
            <IcSuccessGreen />
          ) : (
            <IcTimerCircle
              className={
                status === 3 || status === 4 ? "text-red" : "text-orange"
              }
            />
          )}

          {status === 1 || status === 3 || status === 4 ? (
            <span className="font-medium text-blackBold">
              {`Transaksi ${
                status === 1
                  ? "Selesai"
                  : status === 4
                  ? "Dibatalkan"
                  : "Expired"
              }`}
            </span>
          ) : (
            <CountdownTimer
              label="Berlaku"
              initialSeconds={duration || 0}
              onFinish={getData}
            />
          )}
        </div>

        <div
          id="receipt"
          className="relative p-3 pb-4 bg-white rounded-lg mt-[28px] drop-shadow"
        >
          {status !== 1 && (
            <>
              <div className="between-x">
                <div>
                  <span className="text-blackBold font-medium flex flex-col">
                    Nominal Pembayaran
                  </span>

                  <span className="text-base font-semibold text-primary100">
                    {`Rp${rupiah(transactionById?.data?.DueAmount)}`}
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

              <Separator className="!bg-baseLightGray mb-3 mt-2.5" />

              {transactionById?.data?.PaymentMethod === "QRIS_TU" &&
              status === 2 ? (
                <div className="center-y gap-4">
                  <IcQrisLabel />
                  <QRCodeCanvas
                    ref={qrRef}
                    value={transactionById?.data?.GeneratedQRCodeURL || ""}
                    size={220}
                  />
                </div>
              ) : (
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
              )}
            </>
          )}

          <Separator className="mb-4 mt-3" />

          <p className="font-medium mb-2">Informasi Transaksi</p>
          <div className="text-black100/70 row gap-2">
            <p className="text-xs">
              {moments(transactionById?.data?.CreatedAt).format("DD MMMM YYYY")}
            </p>
            <p className="text-xs">
              {moments(transactionById?.data?.CreatedAt).format("HH:mm WIB")}
            </p>
            <p className="text-xs">{`ID${transactionById?.data?.ID}`}</p>
          </div>

          {isShow && (
            <>
              {transactionType !== 1 && (
                <BetweenText
                  labelLeft="Referensi Sesi ID"
                  labelRight={transactionById?.data?.SessionID || "-"}
                  className="pt-4"
                />
              )}

              <Separator className="my-4" />
              <span className="text-xs text-black70">Detail Transaksi</span>

              <BetweenText
                labelLeft="Tipe Transaksi"
                labelRight={transactionType === 1 ? "Top Up" : "Pengisian Daya"}
                classNameLabelRight="font-medium text-black100"
                className="py-2 border-b border-b-black10"
              />

              {transactionType !== 1 && (
                <BetweenText
                  labelLeft="Referensi Sesi ID"
                  labelRight={transactionById?.data?.SessionID || "-"}
                  className="py-2 border-b border-b-black10"
                />
              )}

              <BetweenText
                labelLeft="Metode Pembayaran"
                labelRight={getLabelPaymentMethod(
                  (transactionById?.data?.PaymentMethod || "")
                    .replace("_TU", "")
                    .toLocaleLowerCase()
                )}
                className="py-2 border-b border-b-black10"
              />

              <BetweenText
                labelLeft={`Nominal ${
                  transactionType === 1 ? "Topup" : "Pengecasan"
                }`}
                labelRight={`Rp${rupiah(transactionById?.data?.Amount)}`}
                className="py-2 border-b border-b-black10"
              />

              <BetweenText
                labelLeft="Admin Fee"
                labelRight={`Rp${rupiah(transactionById?.data?.TotalFee)}`}
                className="py-2 border-b border-b-black10"
              />

              {/* <BetweenText
            labelLeft="Service Fee"
            labelRight={transactionById?.data?.Session?.ChargingFee || "-"}
            className="py-2 border-b border-b-black10"
          /> */}

              {transactionType !== 1 && (
                <BetweenText
                  labelLeft="Pembayaran Casan Wallet"
                  labelRight={`Rp${rupiah(
                    transactionById?.data?.WalletUsedAmount
                  )}`}
                  className="py-2"
                />
              )}

              <BetweenText
                labelLeft="Total Transaksi"
                labelRight={`Rp${rupiah(transactionById?.data?.DueAmount)}`}
                className="border-y border-black100 py-2"
                classNameLabelLeft="text-black100"
                classNameLabelRight="text-black100 font-medium"
              />

              {isShowRefund && (
                <BetweenText
                  labelLeft="Pengembalian Dana"
                  labelRight={`Rp${rupiah(
                    transactionById?.data?.Session?.RefundAmount
                  )}`}
                  className="my-2"
                />
              )}
            </>
          )}

          {status !== 3 && status !== 4 && (
            <>
              <Separator className="my-6 bg-black10" />

              {status === 1 ? (
                <>
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
                  <div>
                    <Separator className="my-6" />

                    {transactionType !== 1 ? (
                      <div
                        onClick={onViewSession}
                        className="row gap-2 center cursor-pointer"
                      >
                        <span className="text-primary100">Lihat Sesi</span>
                        <IcRightCircleGreen />
                      </div>
                    ) : (
                      <div>
                        <Button
                          label="Kembali ke Beranda"
                          onClick={() =>
                            navigate("/home/index", { replace: true })
                          }
                        />
                      </div>
                    )}
                  </div>
                </>
              ) : transactionById?.data?.GeneratedQRCodeURL ? (
                <>
                  <div className="between-x gap-6">
                    {transactionType !== 1 && (
                      <Button
                        type="secondary"
                        label="Cancel"
                        onClick={() => {
                          if (transactionById?.data?.Session?.ID)
                            dispatch(
                              fetchCancelSession(
                                transactionById?.data?.Session?.ID
                              )
                            );
                        }}
                      />
                    )}
                    <Button
                      label="Unduh QRIS"
                      onClick={() => handleSave(true)}
                    />
                  </div>
                </>
              ) : (
                <div className="between-y gap-4">
                  <button
                    onClick={() =>
                      window.open(
                        transactionById?.data?.DeepLinkRedirectURL,
                        "_blank"
                      )
                    }
                    className="btn-secondary w-full h-[38px] flex gap-1 border rounded-full text-sm justify-center items-center flex drop-shadow"
                  >
                    <span>Lanjutkan Pembayaran</span>
                    <span className="font-semibold">{`Rp${rupiah(
                      transactionById?.data?.DueAmount
                    )}`}</span>
                  </button>

                  {transactionType !== 1 && (
                    <Button
                      type="danger"
                      label="Cancel"
                      onClick={() => {
                        if (transactionById?.data?.Session?.ID)
                          dispatch(
                            fetchCancelSession(
                              transactionById?.data?.Session?.ID
                            )
                          );
                      }}
                    />
                  )}
                </div>
              )}
            </>
          )}

          {isShow && <div className="mb-2" />}
        </div>
      </LoadingPage>
    </div>
  );
};

export default TransactionDetails;
