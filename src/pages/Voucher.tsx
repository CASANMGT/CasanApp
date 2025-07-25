import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ERROR_MESSAGE, VoucherUsage } from "../common";
import { Header, LoadingPage, VoucherUsageCard } from "../components";
import { Api } from "../services";

const Voucher = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<VoucherUsage[]>();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await Api.get({
          url: "vouchers/usage/products",
          params: { page: 1, limit: 10 },
        });

        setLoading(false);
        setData(res?.data);
      } catch (error) {
        setLoading(false);
        alert(ERROR_MESSAGE);
      }
    };

    setLoading(true);
    getData();
  }, []);

  const onDismiss = () => {
    navigate(-1);
  };

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Voucher Saya" onDismiss={onDismiss} />

      <LoadingPage loading={loading && !data}>
        <div className="pt-6 px-4 flex flex-col overflow-hidden ">
          <h2 className="font-medium text-sm mb-2.5">Voucher Produk</h2>

          <div className="overflow-auto scrollbar-none">
            {data &&
              data.length &&
              data.map((item, index) => (
                <VoucherUsageCard
                  key={index}
                  data={item}
                  onSelect={() => navigate(`details/${item?.ID}`)}
                />
              ))}

              <div className="h-6"/>
          </div>
        </div>
      </LoadingPage>
    </div>
  );
};

export default Voucher;
