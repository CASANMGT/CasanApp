import { useEffect, useState } from "react";
import { CiCircleCheck } from "react-icons/ci";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { IcRedeem, ILNoImage } from "../assets";
import { ERROR_MESSAGE, VoucherUsage } from "../common";
import {
  AlertModal,
  Button,
  Header,
  LoadingPage,
  ModalSKVoucher,
  Separator
} from "../components";
import { hideLoading, showLoading } from "../features";
import { moments } from "../helpers";
import { Api } from "../services";
import { AppDispatch } from "../store";

const VoucherDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VoucherUsage>();
  const [openClaim, setOpenClaim] = useState(false);
  const [openSKVoucher, setOpenSKVoucher] = useState(false);

  useEffect(() => {
    // getData();
  }, []);

  const getData = async () => {
    setLoading(true);

    try {
      const res = await Api.get({
        url: `vouchers/usages/${id}`,
      });

      setLoading(false);
      setData(res?.data);
    } catch (error) {
      setLoading(false);
      alert(ERROR_MESSAGE);
    }
  };

  const onClaim = async () => {
    setOpenClaim(false);
    dispatch(showLoading());

    try {
      await Api.post({
        url: `vouchers/claim/${id}`,
      });

      getData();
      dispatch(hideLoading());
    } catch (error: any) {
      dispatch(hideLoading());
      alert(error?.response?.data?.message || ERROR_MESSAGE);
    }
  };

  const onDismiss = () => navigate(-1);

  const status = data?.Status;
  const format = getFormatDate(data);

  return (
    <div className="background-2 flex flex-col">
      <Header
        className="mx-4 mt-3.5"
        type={"secondary"}
        title="Voucher"
        onDismiss={onDismiss}
      />

      <LoadingPage loading={loading}>
        <div className="flex flex-col mx-4 mt-8 px-4 py-6">
          <div className="justify-center flex">
            <img
              src={data?.VoucherDetails?.VoucherThumbnailURL || ILNoImage}
              alt="voucher"
              className="w-[184px] h-[118px] rounded z-10"
            />
          </div>

          <div className="flex flex-col items-center bg-white -mt-12 pt-16 pb-6 px-4 rounded">
            <span className="text-lg font-medium">
              {data?.VoucherDetails?.VoucherName}
            </span>

            <div
              className={`my-4 rounded row gap-1.5 ${
                status === 3
                  ? "text-red"
                  : "text-black100 bg-baseLightGray py-2 px-3 "
              }`}
            >
              {status === 1 && (
                <CiCircleCheck size={14} className="text-primary100" />
              )}
              <p className="text-xs">
                {status === 1
                  ? "Diklaim tanggal"
                  : status === 3
                  ? "Expired"
                  : "Berlaku sampai"}{" "}
                <span className="text-xs font-semibold">
                  {moments(
                    status === 1 ? data?.RedeemedAt : data?.ProductExpiredAt
                  ).format("DD MMM YYYY HH:mm")}
                </span>
              </p>
            </div>

            {status === 2 && (
              <div className="border border-primary100 rounded-md p-3 bg-primary10 mb-2">
                <p className="text-primary100 text-xs">
                  Tunjukkan voucher ini untuk klaim produk. Tombol hanya bisa
                  dipencet oleh PIC produk agar klaim tidak void
                </p>
              </div>
            )}

            <span className="text-[10px]">Sesi ID {data?.SessionID}</span>

            <Separator className="my-5" />

            {status === 1 || status === 3 ? (
              <div className="flex flex-col items-center gap-4">
                {status === 1 && <IcRedeem />}

                <p className="text-base font-medium">
                  {status === 1
                    ? "Selamat Menikmati! 👋"
                    : "Vouchermu Sudah Expired"}
                </p>
              </div>
            ) : (
              <Button
                label="Klaim Voucher"
                onClick={() => setOpenClaim(true)}
              />
            )}
          </div>

          <p className="text-center">{format?.label}</p>

          {format?.isShow && (
            <>
              <div className="border border-primary100 rounded-md p-3 bg-primary10 mb-6 mt-4">
                <p className="text-primary100 text-xs">
                  Tunjukkan voucher ini untuk klaim produk. Tombol hanya bisa
                  dipencet oleh PIC produk agar klaim tidak void
                </p>
              </div>
              <Button
                label="Klaim Voucher"
                onClick={() => setOpenClaim(true)}
              />
            </>
          )}
        </div>
      </LoadingPage>

      {/* MODAL */}
      {openClaim && (
        <AlertModal
          visible={openClaim}
          title="Klaim Voucher"
          description="Apakah anda ingin mengkalim voucher?"
          labelButtonLeft="Klaim"
          labelButtonRight="Batal"
          onDismiss={() => setOpenClaim(false)}
          onClick={onClaim}
        />
      )}

      {openSKVoucher && (
        <ModalSKVoucher
          visible={openSKVoucher}
          data={data?.VoucherDetails}
          onDismiss={() => setOpenSKVoucher(false)}
        />
      )}
      {/* END MODAL */}
    </div>
  );
};

export default VoucherDetails;

const getFormatDate = (data: VoucherUsage | undefined) => {
  let label: string = "";
  let isShow: boolean = false;

  const status = data?.Status;
  const FORMAT = "DD MMM YYYY HH:mm";

  if (status === 1) {
    label = `Diklaim tanggal ${moments(data?.RedeemedAt).format(FORMAT)}`;
  }

  switch (status) {
    case 1:
      label = `Diklaim tanggal ${moments(data?.RedeemedAt).format(FORMAT)}`;
      break;

    case 2:
      if (data?.ProductExpiredAt) {
        isShow = true;
        label = `Berlaku sampai ${moments(data?.ProductExpiredAt).format(
          FORMAT
        )}`;
      }
      break;

    case 3:
      label = `Expired ${moments(data?.ProductExpiredAt).format(FORMAT)}`;
      break;

    default:
      label = "";
      isShow = false;
      break;
  }

  return { label, isShow };
};
