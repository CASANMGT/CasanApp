import { useState } from "react";
import { FaChevronRight } from "react-icons/fa6";
import { FeeSettingsProps } from "../../common";
import { ModalPaymentMethod } from "../../components";
import { rupiah } from "../../helpers";

interface Props {}

interface PackageProps {
  title: string;
  price: string;
  oldPrice?: string;
  isNormal?: boolean;
}

const packages: PackageProps[] = [
  { title: "Beli 1 hari kredit", price: "50000", isNormal: true },
  { title: "Beli 2 hari kredit", price: "100000", isNormal: true },
  { title: "Beli 3 hari kredit", price: "150000", isNormal: true },
  { title: "Beli 5 hari kredit", price: "180000", oldPrice: "200000" },
  { title: "Beli 7 hari kredit", price: "200000", oldPrice: "250000" },
  { title: "Beli 15 hari kredit", price: "400000", oldPrice: "450000" },
  {
    title: "Beli 30 hari kredit",
    price: "1300000",
    oldPrice: "1500000",
  },
  {
    title: "Beli 60 hari kredit",
    price: "2600000",
    oldPrice: "3000000",
  },
];

const Package: React.FC<Props> = () => {
  const [openPaymentMethod, setOpenPaymentMethod] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<FeeSettingsProps>();

  return (
    <div className="bg-white flex-1 h-full px-4 py-6">
      <span className="text-base font-semibold">Pilih Paket Pembayaran</span>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {packages.map((pkg, i) => (
          <div
            key={i}
            onClick={() => setOpenPaymentMethod(true)}
            className="rounded-lg overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition cursor-pointer"
          >
            {/* Header */}
            <div
              className="bg-teal-700 text-white p-2.5 flex items-center justify-between"
              style={{
                background: `linear-gradient(270deg, #21927B, #327478)`,
              }}
            >
              <p className="font-semibold">{pkg.title}</p>
              <FaChevronRight size={16} />
            </div>

            {/* Content */}
            <div className="px-2.5 py-2 bg-white">
              <p className="text-blackBold font-semibold text-base">
                {`Rp${rupiah(pkg.price)}`}
              </p>
              {pkg.oldPrice ? (
                <p className="text-[10px] text-black70 line-through">
                  {`Rp${rupiah(pkg.oldPrice)}`}
                </p>
              ) : (
                <p className="text-[10px] text-black70">Harga Normal</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {openPaymentMethod && (
        <ModalPaymentMethod
          visible={openPaymentMethod}
          select={paymentMethod}
          selectBalance={0}
          total={0}
          loading={false}
          onDismiss={() => setOpenPaymentMethod(false)}
          onSelect={(select, value) => {
            setOpenPaymentMethod(false);
            setPaymentMethod(select);
          }}
        />
      )}
    </div>
  );
};

export default Package;
