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
    <div className="flex-1 bg-gradient-to-b from-[#f0faf8] to-[#f5f8f9] px-4 py-6">
      <div className="mb-5">
        <h2 className="text-base font-bold text-gray-900">Pilih paket pembayaran</h2>
        <p className="mt-1 text-[13px] leading-snug text-gray-500">
          Paket lebih banyak hari biasanya lebih hemat per hari. Tap kartu untuk lanjut bayar.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
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
          <div className="col-span-full rounded-2xl border border-dashed border-gray-200 bg-white/80 px-4 py-10 text-center">
            <p className="text-sm font-semibold text-gray-700">Belum ada paket kredit</p>
            <p className="mt-1 text-xs text-gray-500">
              Hubungi dealer atau cek lagi nanti. Paket akan muncul di sini.
            </p>
          </div>
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
  const listPrice = originalPrice * (data?.DayCount ?? 1);
  const hasDiscount = Boolean(data?.DiscountRate && listPrice > (data?.Price ?? 0));
  const savings = hasDiscount ? Math.max(0, listPrice - (data?.Price ?? 0)) : 0;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full overflow-hidden rounded-2xl border border-gray-100 bg-white text-left shadow-sm transition-all hover:border-[#4DB6AC]/35 hover:shadow-md active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4DB6AC] focus-visible:ring-offset-2"
    >
      <div
        className="flex items-center justify-between px-3 py-2.5 text-white"
        style={{
          background: `linear-gradient(270deg, #21927B, #327478)`,
        }}
      >
        <span className="text-sm font-semibold">{`Beli ${data?.DayCount} hari kredit`}</span>
        <FaChevronRight size={14} className="opacity-90" aria-hidden />
      </div>

      <div className="relative space-y-1 px-3 py-3">
        {hasDiscount && data.DayCount > 1 && (
          <span className="absolute right-2 top-2 rounded-full bg-amber-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-800 ring-1 ring-amber-100">
            Hemat
          </span>
        )}
        <p className="text-lg font-bold tabular-nums text-gray-900">
          Rp{rupiah(data?.Price)}
        </p>
        {hasDiscount ? (
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="text-[11px] text-gray-400 line-through">
              Rp{rupiah(listPrice)}
            </p>
            {savings > 0 && (
              <span className="text-[10px] font-semibold text-[#2E7D32]">
                Hemat Rp{rupiah(savings)}
              </span>
            )}
          </div>
        ) : (
          <p className="text-[11px] text-gray-500">Harga normal</p>
        )}
      </div>
    </button>
  );
};
