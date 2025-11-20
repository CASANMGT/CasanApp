import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { useDispatch } from "react-redux";
import {
  AddTransactionRTOBody,
  ERROR_MESSAGE,
  FeeSettingsProps,
} from "../../common";
import { ModalPaymentMethod } from "../../components";
import { fetchAddTransactionRTO } from "../../features";
import { rupiah } from "../../helpers";
import { AppDispatch, RootState } from "../../store";
import { useSelector } from "react-redux";

interface Props {
  data: RTOProps | undefined;
}

const Package: React.FC<Props> = ({ data }) => {
  const dispatch = useDispatch<AppDispatch>();

  const addTransactionRTO = useSelector(
    (state: RootState) => state?.addTransactionRTO
  );

  const [openPaymentMethod, setOpenPaymentMethod] = useState<boolean>(false);
  const [selectedPackage, setSelectedPackage] = useState<
    RTOCreditProps | undefined
  >();
  const [paymentMethod, setPaymentMethod] = useState<FeeSettingsProps>();

  const isShow = data?.DayCredits?.length ? true : false;

  const onSelectPayment = async (select: FeeSettingsProps | undefined) => {
    try {
      if (!data || !selectedPackage) {
        throw new Error("Missing required data");
      }

      const body = AddTransactionRTOBody(data, selectedPackage, select);
      dispatch(fetchAddTransactionRTO(body));
    } catch (error) {
      alert(ERROR_MESSAGE);
    }
  };

  return (
    <div className="bg-white flex-1 h-full px-4 py-6">
      <p className="text-base font-semibold mb-4">Pilih Paket Pembayaran</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {isShow ? (
          data?.DayCredits.map((item, i) => (
            <PaymentPackageCard
              key={i}
              data={item}
              originalPrice={data?.DayCredits[0]?.Price ?? 0}
              onClick={() => {
                setSelectedPackage(item);
                setOpenPaymentMethod(true);
              }}
            />
          ))
        ) : (
          <span>No Data</span>
        )}
      </div>

      {openPaymentMethod && (
        <ModalPaymentMethod
          type="credit"
          visible={openPaymentMethod}
          select={paymentMethod}
          selectBalance={0}
          total={selectedPackage?.Price || 0}
          loading={addTransactionRTO?.loading}
          totalCredit={selectedPackage?.DayCount || 0}
          deposit={data?.IsDeposited ? 0 : data?.Deposit || 0}
          onDismiss={() => setOpenPaymentMethod(false)}
          onSelect={onSelectPayment}
        />
      )}
    </div>
  );
};

export default Package;

interface PaymentPackageCardProps {
  data: RTOCreditProps;
  originalPrice: number;
  onClick: () => void;
}

const PaymentPackageCard: React.FC<PaymentPackageCardProps> = ({
  data,
  originalPrice,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
    >
      {/* Header */}
      <div
        className="bg-teal-700 text-white p-2.5 flex items-center justify-between"
        style={{
          background: `linear-gradient(270deg, #21927B, #327478)`,
        }}
      >
        <p className="font-semibold">{`Beli ${data?.DayCount} hari kredit`}</p>
        <FaChevronRight size={16} />
      </div>

      {/* Content */}
      <div className="px-2.5 py-2 bg-white">
        <p className="text-blackBold font-semibold text-base">
          {`Rp${rupiah(data?.Price)}`}
        </p>
        {data?.DiscountRate ? (
          <p className="text-[10px] text-black70 line-through">
            {`Rp${rupiah(originalPrice * data?.DayCount)}`}
          </p>
        ) : (
          <p className="text-[10px] text-black70">Harga Normal</p>
        )}
      </div>
    </div>
  );
};
