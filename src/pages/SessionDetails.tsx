import html2canvas from "html2canvas";
import { RiTreeFill } from "react-icons/ri";
import { IoLeaf } from "react-icons/io5";
import { capitalize } from "lodash";
import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IcInfoCircleGreen,
  IcSaveGreen,
  IcShareGreen2,
  IcSuccessGreen,
  IcTimerCircle,
} from "../assets";
import { Session, VoucherUsage } from "../common";
import {
  BetweenText,
  Button,
  Header,
  LoadingPage,
  Separator,
} from "../components";
import { fetchDetailSession } from "../features";
import {
  formatDuration,
  getLabelPaymentMethod,
  moments,
  rupiah,
} from "../helpers";
import { AppDispatch, RootState } from "../store";
import { FaArrowRight } from "react-icons/fa6";

const SessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const detailSession = useSelector((state: RootState) => state.detailSession);

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    const handleBack = () => {
      onDismiss();
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  const getData = () => {
    dispatch(fetchDetailSession(Number(id)));
  };

  const onDismiss = () => {
    if (location?.state?.isGoHome) navigate("/home", { replace: true });
    else navigate(-1);
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

  const onView = () => {
    navigate("/home/order", { replace: true });
  };

  const dataSession: Session | null = detailSession?.data;
  let dataVoucher: VoucherUsage | undefined = undefined;
  let isShowVoucher: boolean = false;
  const status: number | undefined = dataSession?.Status;
  const isFull =
    (dataSession?.Transaction?.Amount || 0) -
      (dataSession?.RefundAmount || 0) ===
    0
      ? true
      : false;

  if (
    dataSession?.VoucherUsages &&
    dataSession?.VoucherUsages.length &&
    status !== 7 &&
    status !== 8
  ) {
    isShowVoucher = true;
    dataVoucher = dataSession?.VoucherUsages[0];
  }

  const isShowMilestone: boolean = useMemo(
    () => (dataSession?.User?.Milestone ? true : false),
    [dataSession?.User?.Milestone]
  );

  const co2: number = Number(
    ((dataSession?.TotalKwhUsed || 0) * 1.5).toFixed(3)
  );

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header type="secondary" title="Detail Sesi" onDismiss={onDismiss} />

      <LoadingPage loading={detailSession?.loading}>
        <div
          id="receipt"
          className="flex-1 overflow-auto scrollbar-none px-4 pb-7"
        >
          {/* ICON */}
          <div className="center flex-col gap-2 my-[28px]">
            {status === 7 || status === 8 ? (
              <IcTimerCircle className="text-red" />
            ) : (
              <IcSuccessGreen />
            )}
            <span className="text-blackBold font-medium">
              {`Sesi ${
                status === 7
                  ? "Expired"
                  : status === 8
                  ? "Dibatalkan"
                  : "Selesai"
              }`}
            </span>
          </div>

          {/* CO2 */}
          {isShowMilestone && (
            <div className="bg-primary10 rounded-lg py-4 px-2.5 mb-4 flex flex-col items-center">
              <div className="row gap-1">
                <IoLeaf className="text-green" />

                <span>Selamat! kamu telah menghemat</span>
              </div>

              <span className="text-2xl font-semibold my-3">{co2}kg CO₂</span>

              <div className="row gap-1 text-black70 text-xs">
                <span>Setara dengan menanam</span>

                <RiTreeFill />

                <span className="font-medium">{(co2 / 20).toFixed(3)}</span>
                <span>pohon</span>
              </div>
            </div>
          )}

          {/* TOOL INFORMATION */}
          <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
            <div className="row gap-3 mb-3">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <span className="text-blackBold font-medium">Informasi Alat</span>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="Lokasi"
              labelRight={dataSession?.ChargingStation?.Name || "-"}
              className="bg-baseLightGray p-3 rounded-t"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Nomor Alat"
              labelRight={dataSession?.Device?.PileNumber || "-"}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Socket"
              labelRight={`Socket ${dataSession?.Socket?.Port}`}
              className="bg-baseLightGray p-3 rounded-b"
            />
          </div>

          {/* SESSION INFORMATION */}
          <div className="bg-white p-3 rounded-lg mb-4 drop-shadow">
            <div className="row gap-3 mb-3">
              <div className="w-[30px] h-[30px] rounded-full center bg-primary10">
                <IcInfoCircleGreen />
              </div>

              <span className="text-blackBold font-medium">Informasi Sesi</span>
            </div>

            <BetweenText
              type="medium-content"
              labelLeft="ID Sesi"
              labelRight={dataSession?.ID || "-"}
              className="bg-baseLightGray p-3 rounded-t"
            />

            {status !== 7 && status !== 8 && (
              <>
                {/* {!isFull && (
                  <BetweenText
                    type="medium-content"
                    labelLeft="Keterangan Sesi"
                    labelRight="Dihentikan manual"
                    className="p-3"
                  />
                )} */}

                <BetweenText
                  type="medium-content"
                  labelLeft="Waktu Mulai"
                  labelRight={moments(dataSession?.StartChargingTime).format(
                    "DD MMM HH:mm"
                  )}
                  className="p-3"
                />

                <BetweenText
                  type="medium-content"
                  labelLeft="Waktu Selesai"
                  labelRight={moments(dataSession?.StopChargingTime).format(
                    "DD MMM HH:mm"
                  )}
                  className="bg-baseLightGray p-3"
                />

                <BetweenText
                  type="medium-content"
                  labelLeft={`Durasi ${!isFull && "Pesanan"}`}
                  labelRight={formatDuration(dataSession?.ExpectedDuration)}
                  className="p-3"
                />

                {!isFull && (
                  <BetweenText
                    type="medium-content"
                    labelLeft="Durasi Pemakaian"
                    labelRight={formatDuration(dataSession?.Duration)}
                    className="p-3"
                  />
                )}

                <BetweenText
                  type="medium-content"
                  labelLeft="Maksimum Watt"
                  labelRight={`${dataSession?.MaxWatt}W`}
                  className="bg-baseLightGray p-3"
                />

                <BetweenText
                  type="medium-content"
                  labelLeft="Tarif Pengecasan"
                  labelRight={dataSession?.ChargingFee || "-"}
                  className="p-3"
                />

                <BetweenText
                  type="medium-content"
                  labelLeft="Nominal Pesanan"
                  labelRight={`Rp${rupiah(dataSession?.Transaction?.Amount)}`}
                  className="bg-baseLightGray p-3"
                />

                {!isFull && (
                  <BetweenText
                    type="medium-content"
                    labelLeft="Nominal Pemakaian"
                    labelRight={`Rp${rupiah(dataSession?.UsedAmount)}`}
                    className="bg-baseLightGray p-3"
                  />
                )}
              </>
            )}
          </div>

          {/* PAYMENT INFORMATION */}
          <div className="p-3 pb-6 bg-white rounded-lg drop-shadow">
            <p className="font-medium mb-2">Informasi Transaksi</p>

            <div className="text-black100/70 row gap-2">
              <p className="text-xs">
                {moments(dataSession?.Transaction?.CreatedAt).format(
                  "DD MMMM YYYY"
                )}
              </p>
              <p className="text-xs">
                {moments(dataSession?.Transaction?.CreatedAt).format(
                  "HH:mm WIB"
                )}
              </p>
              <p className="text-xs">{`ID${dataSession?.TransactionID}`}</p>
            </div>

            <Separator className="my-4 bg-black10" />

            <p className="text-xs text-black100/70 mb-2">Detail Transaksi</p>

            <BetweenText
              labelLeft="Metode Pembayaran"
              labelRight={getLabelPaymentMethod(
                (dataSession?.Transaction?.PaymentMethod || "")
                  .replace("_TU", "")
                  .toLocaleLowerCase()
              )}
              className="py-2 border-b border-b-black10"
            />

            <BetweenText
              labelLeft="Nominal Pengisian"
              labelRight={`Rp${rupiah(dataSession?.Transaction?.Amount)}`}
              className="py-2 border-b border-b-black10"
            />

            {isShowVoucher && (
              <BetweenText
                labelLeft="Voucher Discount"
                labelRight=""
                content={
                  <div className="row gap-1">
                    <p>
                      {dataVoucher
                        ? dataVoucher.VoucherDetails?.DiscountType === 1
                          ? `-Rp${rupiah(
                              dataVoucher.VoucherDetails?.DiscountValue
                            )}`
                          : `[${dataVoucher.VoucherDetails?.Description}]`
                        : 0}
                    </p>

                    {dataVoucher?.VoucherDetails?.DiscountType === 2 && (
                      <FaArrowRight
                        onClick={() => alert()}
                        className="cursor-pointer text-primary100"
                      />
                    )}
                  </div>
                }
                className="py-2 border-b border-b-black10"
              />
            )}

            <BetweenText
              labelLeft="Biaya Transaksi"
              labelRight={`Rp${rupiah(dataSession?.Transaction?.TotalFee)}`}
              className="py-2 border-b border-b-black10"
            />

            {isShowMilestone && (
              <BetweenText
                labelLeft={`${dataSession?.User?.Milestone?.Name} ${dataSession?.User?.Milestone?.DiscountPercent}% Disc`}
                labelRight={
                  dataSession?.Transaction?.MilestoneDiscount
                    ? `-Rp${rupiah(
                        dataSession?.Transaction?.MilestoneDiscount
                      )}`
                    : "Rp0"
                }
                className="py-2"
              />
            )}

            <BetweenText
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(dataSession?.Transaction?.DueAmount)}`}
              classNameLabelLeft="text-black100"
              classNameLabelRight="text-black100"
              className="py-2 border-y border-y-black100"
            />

            {status === 8 && (
              <BetweenText
                labelLeft="Pengembalian Dana"
                labelRight={`Rp${rupiah(dataSession?.RefundAmount)}`}
                className="mt-2"
              />
            )}

            {status !== 7 && status !== 8 && (
              <>
                <Separator className="my-6 bg-black10" />

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
              </>
            )}
          </div>
        </div>

        {/* FOOTER */}
        {status !== 7 && status !== 8 && (
          <div className="p-4 bg-white drop-shadow">
            <Button
              buttonType="lg"
              label="Lihat Daftar Order"
              onClick={onView}
            />
          </div>
        )}
      </LoadingPage>
    </div>
  );
};

export default SessionDetails;
