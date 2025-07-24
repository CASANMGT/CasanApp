import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Header, LoadingPage, VoucherUsageCard } from "../components";
import { fetchVoucherUsageProduct } from "../features";
import { AppDispatch, RootState } from "../store";

const Voucher = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const voucherUsageProduct = useSelector(
    (state: RootState) => state?.voucherUsageProduct
  );

  useEffect(() => {
    const getData = () => {
      dispatch(fetchVoucherUsageProduct({ page: 1, limit: 10 }));
    };

    getData();
  }, []);

  const onDismiss = () => {
    navigate(-1);
  };

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Voucher Saya" onDismiss={onDismiss} />

      <LoadingPage
        loading={voucherUsageProduct?.loading && !voucherUsageProduct?.data}
      >
        <div className="py-6 px-4">
          <h2 className="font-medium text-sm mb-2.5">Voucher Produk</h2>

          {voucherUsageProduct?.data?.data &&
            voucherUsageProduct?.data?.data.length &&
            voucherUsageProduct?.data?.data.map((item, index) => (
              <VoucherUsageCard key={index} data={item} onSelect={() => {}} />
            ))}
        </div>
      </LoadingPage>
    </div>
  );
};

export default Voucher;
