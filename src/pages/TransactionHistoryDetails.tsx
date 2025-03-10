import { capitalize } from "lodash";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { IcTimerCircle } from "../assets";
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

  const onShare = () => {
    alert("coming soon");
  };

  const onSave = () => {
    alert("coming soon");
  };

  const status: number = 2; // detailSession?.data?.Transaction?.Status || 0;
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
          <IcTimerCircle className="text-orange" />

          <CountdownTimer
            label="Berlaku"
            initialSeconds={duration}
            onFinish={getDetails}
          />
        </div>

        <div className="p-3 pb-6 bg-white rounded-lg mt-[28px] drop-shadow">
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
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Referensi Sesi ID"
            labelRight={detailSession?.data?.ID || "-"}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Metode Pembayaran"
            labelRight={capitalize(
              (detailSession?.data?.Transaction?.PaymentMethod || "")
                .replace("_TU", "")
                .toLocaleLowerCase()
            )}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Nominal Pengecasan"
            labelRight={`Rp${rupiah(detailSession?.data?.Transaction?.Amount)}`}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Admin Fee"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.TotalFee
            )}`}
          />

          <Separator className="my-1.5 bg-black10" />
          <BetweenText
            labelLeft="Service Fee"
            labelRight={`Rp${rupiah(detailSession?.data?.ChargingFee || 0)}`}
          />

          <Separator className="my-1.5 bg-black70" />
          <BetweenText
            labelLeft="Total Transaksi"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.DueAmount
            )}`}
            classNameLabelLeft="text-black100"
            classNameLabelRight="text-black100 font-medium"
          />

          <Separator className="my-1.5 bg-black70" />
          <BetweenText
            labelLeft="Pembayaran Casan Wallet"
            labelRight={`Rp${rupiah(
              detailSession?.data?.Transaction?.WalletUsedAmount
            )}`}
          />

          <Separator className="my-6 bg-black10" />

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
            {/* <Button
              type="secondary"
              label="Bagikan Resi"
              iconRight={IcShareGreen2}
              onClick={onShare}
            /> */}
            {/* <Button
              type="secondary"
              label="Simpan Resi"
              iconRight={IcSaveGreen}
              onClick={onSave}
            /> */}
          </div>
        </div>
      </LoadingPage>
    </div>
  );
};

export default TransactionHistoryDetails;
