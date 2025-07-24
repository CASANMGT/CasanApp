import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { ERROR_MESSAGE, VoucherUsage } from "../common";
import {
  AlertModal,
  Button,
  Header,
  LoadingPage,
  VoucherUsageCard,
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

  useEffect(() => {
    getData();
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

  return (
    <div className="background-1 flex flex-col">
      <Header
        className="mx-4 mt-3.5"
        type={"secondary"}
        title="Voucher"
        onDismiss={onDismiss}
      />

      <LoadingPage loading={loading}>
        <div className="flex flex-col bg-white mx-4 mt-8 px-4 py-6">
          <VoucherUsageCard type="secondary" data={data} />

          <p className="text-center mb-4">
            {`${
              status === 1
                ? "Diklaim tanggal"
                : status === 3
                ? "Expired"
                : "Berlaku sampai"
            } ${moments(
              status === 1 ? data?.RedeemedAt : data?.VoucherDetails?.EndDate
            ).format("DD MMM YYYY HH:mm")}`}
          </p>

          <div className="border border-primary100 rounded-md p-3 bg-primary10 mb-6">
            <p className="text-primary100 text-xs">
              Tunjukkan voucher ini untuk klaim produk. Tombol hanya bisa
              dipencet oleh PIC produk agar klaim tidak void
            </p>
          </div>

          {status === 2 && (
            <Button label="Kalim Voucher" onClick={() => setOpenClaim(true)} />
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
      {/* END MODAL */}
    </div>
  );
};

export default VoucherDetails;
