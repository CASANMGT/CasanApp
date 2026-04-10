import html2canvas from "html2canvas";
import { useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa6";
import { IoLeaf, IoWallet } from "react-icons/io5";
import { RiTreeFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  IcInfoCircleGreen,
  IcSaveGreen,
  IcShareGreen2,
  IcSuccessGreen,
  IcTimerCircle,
} from "../assets";
import { VoucherUsage } from "../common";
import {
  BetweenText,
  Button,
  Header,
  LoadingPage,
  ModalPriceDetails,
  Separator,
} from "../components";
import {
  formatDuration,
  getLabelPaymentMethod,
  moments,
  rupiah,
} from "../helpers";
import { Api } from "../services";
import { AppDispatch } from "../store";
import NotFound from "./NotFound";

const SessionDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();

  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Session>();
  const [isNotFound, setIsNotFound] = useState<boolean>(false);
  const [openPriceDetails, setOpenPriceDetails] = useState<boolean>(false);

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

  const getData = async () => {
    try {
      if (id) {
        const res = await Api.get({
          url: `sessions/${id}`,
        });

        setData(res?.data);
      }
    } catch (error: any) {
      if (error?.message) setIsNotFound(true);
    } finally {
      setLoading(false);
    }
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

  let dataVoucher: VoucherUsage | undefined = undefined;
  const status: number | undefined = data?.Status;
  let isShowVoucher: boolean = false;
  const isShowRefund =
    (status === 6 || status === 7 || status === 8) &&
    (data?.RefundAmount || 0) > 0
      ? true
      : false;
  const isFull =
    (data?.Transaction?.Amount || 0) - (data?.RefundAmount || 0) === 0
      ? true
      : false;

  if (
    data?.VoucherUsages &&
    data?.VoucherUsages.length &&
    status !== 7 &&
    status !== 8
  ) {
    isShowVoucher = true;
    dataVoucher = data?.VoucherUsages[0];
  }

  const co2: number = Number(((data?.TotalKwhUsed || 0) * 1.5).toFixed(3));
  const percentage: number = Number(
    (
      ((data?.UsedAmount || 1) / (data?.Transaction?.NetCharge || 1)) *
      100
    ).toFixed(0)
  );

  if (!id || isNotFound) return <NotFound onDismiss={onDismiss} />;

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header type="secondary" title="Detail Sesi Test" onDismiss={onDismiss} />

      <LoadingPage loading={loading}>
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
          {status === 6 && (
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

          {isShowRefund && (
            <div className="bg-primary10 p-3 rounded-lg mb-4 row gap-3">
              <div className="w-9 h-9 rounded-full bg-primary100/10 center">
                <IoWallet size={20} className="text-primary100" />
              </div>

              <p className="flex-1">
                Sisa kWh
                <span className="text-primary100 font-semibold">{` Rp${rupiah(
                  data?.RefundAmount
                )} `}</span>
                telah dikembalikan ke dompet Casan anda
              </p>
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
              labelRight={data?.ChargingStation?.Name || "-"}
              className="bg-baseLightGray p-3 rounded-t"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Nomor Alat"
              labelRight={data?.Device?.PileNumber || "-"}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Socket"
              labelRight={`Socket ${data?.Socket?.Port}`}
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
              labelRight={data?.ID || "-"}
              className="bg-baseLightGray p-3 rounded-t"
            />

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
              labelRight={
                data?.StartChargingTime
                  ? moments(data?.StartChargingTime).format("DD MMM HH:mm")
                  : "-"
              }
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Waktu Selesai"
              labelRight={
                data?.StopChargingTime
                  ? moments(data?.StopChargingTime).format("DD MMM HH:mm")
                  : "-"
              }
              className="bg-baseLightGray p-3"
            />

            {!isFull && (
              <BetweenText
                type="medium-content"
                labelLeft="Durasi Pemakaian"
                labelRight={
                  data?.Duration ? formatDuration(data?.Duration) : "-"
                }
                className="p-3"
              />
            )}

            {status !== 7 && status !== 8 && (
              <BetweenText
                type="medium-content"
                labelLeft="Maksimum Watt"
                labelRight={`${data?.MaxWatt}W`}
                className="bg-baseLightGray p-3"
              />
            )}

            <BetweenText
              type="medium-content"
              labelLeft="Tarif Pengecasan"
              labelRight={`Rp${rupiah(data?.Transaction?.BaseFare)}/kWh`}
              className="p-3"
            />

            <BetweenText
              type="medium-content"
              labelLeft="Nominal Pesanan"
              labelRight={`${data?.PaidKWH}kWh (Rp${rupiah(
                data?.Transaction?.NetCharge
              )})`}
              className="bg-baseLightGray p-3"
            />

            {!isFull && (
              <BetweenText
                type="medium-content"
                labelLeft="Nominal Pemakaian"
                labelRight={
                  (data?.UsedAmount || 0) > 0
                    ? `${data?.TotalKwhUsed}kWh (Rp${rupiah(data?.UsedAmount)})`
                    : "-"
                }
                className="bg-baseLightGray p-3"
              />
            )}
          </div>

          {/* PAYMENT INFORMATION */}
          <div className="p-3 pb-6 bg-white rounded-lg drop-shadow">
            <p className="font-medium mb-2">Informasi Transaksi</p>

            <div className="text-black100/70 row gap-2">
              <p className="text-xs">
                {moments(data?.Transaction?.CreatedAt).format("DD MMMM YYYY")}
              </p>
              <p className="text-xs">
                {moments(data?.Transaction?.CreatedAt).format("HH:mm WIB")}
              </p>
              <p className="text-xs">{`ID${data?.TransactionID}`}</p>
            </div>

            <Separator className="my-4 bg-black10" />

            <p className="text-xs text-black100/70 mb-2">Detail Transaksi</p>

            <BetweenText
              labelLeft="Metode Pembayaran"
              labelRight={getLabelPaymentMethod(
                (data?.Transaction?.PaymentMethod || "")
                  .replace("_TU", "")
                  .toLocaleLowerCase()
              )}
              className="py-2 border-b border-b-black10"
            />

            <BetweenText
              labelLeft="Nominal Pengisian"
              labelRight={`Rp${rupiah(
                (data?.Transaction?.NetCharge || 0) -
                  (data?.Transaction?.PaymentMethodFee || 0)
              )}`}
              className="py-2 border-b border-b-black10"
            />

            {isShowVoucher && (
              <BetweenText
                labelLeft="Voucher Discount"
                labelRight=""
                content={
                  <div className="row gap-1">
                    <p className="text-black100 text-xs">
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
              labelRight={`Rp${rupiah(data?.Transaction?.PaymentMethodFee)}`}
              className="py-2 border-b border-b-black10"
            />

            <BetweenText
              labelLeft="Total Transaksi"
              labelRight={`Rp${rupiah(data?.Transaction?.DueAmount)}`}
              classNameLabelLeft="text-black100"
              classNameLabelRight="text-black100"
              className="py-2 border-y border-y-black100"
            />

            {(status === 8 || (status === 6 && percentage < 100)) && (
              <BetweenText
                labelLeft="Pengembalian Dana"
                labelRight={`Rp${rupiah(data?.RefundAmount)}`}
                className="mt-2"
              />
            )}

            <div className="flex justify-end mt-5">
              <span
                onClick={() => setOpenPriceDetails(true)}
                className="font-medium text-primary100 cursor-pointer"
              >
                {"Lihat Rincian ->"}
              </span>
            </div>

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

      {/* MODAL */}
      {openPriceDetails && (
        <ModalPriceDetails
          isOpen={openPriceDetails}
          dataPriceSetting={data?.PriceSetting}
          dataDevice={data?.Device}
          dataVoucher={undefined}
          dataUser={data?.User}
          price={data?.Transaction?.TotalFare || 0}
          power={data?.PaidKWH || 0}
          duration={data?.Duration || 0}
          onClose={() => setOpenPriceDetails(false)}
        />
      )}
      {/* END MODAL */}
    </div>
  );
};

export default SessionDetails;
