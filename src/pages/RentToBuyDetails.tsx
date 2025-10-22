import { useState } from "react";
import { CgNotes } from "react-icons/cg";
import { FaUser } from "react-icons/fa6";
import { IoArrowBackOutline } from "react-icons/io5";
import { PiStorefrontLight } from "react-icons/pi";
import { useNavigate } from "react-router-dom";
import { ILNoImage } from "../assets";
import {
  BetweenText,
  Button,
  IconText,
  ModalPersonalData,
  Separator,
} from "../components";
import { rupiah } from "../helpers";
import { MdCheckBox, MdCheckBoxOutlineBlank } from "react-icons/md";

const RentToBuyDetails = () => {
  const navigate = useNavigate();

  const [openCompleteBiodata, setOpenCompleteBiodata] =
    useState<boolean>(false);
  const [isAccept, setIsAccept] = useState<boolean>(false);

  return (
    <div className="container-screen flex flex-col relative overflow-hidden !bg-baseLightGray ">
      <div className="flex-1 overflow-auto scrollbar-none pb-4">
        {/* HEADER */}
        <div className="relative w-full overflow-hidden bg-red">
          <div className="aspect-video flex items-center justify-center bg-gray-100">
            <img
              src={ILNoImage}
              alt="Motor"
              className="object-contain w-full h-full"
            />
          </div>

          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="absolute top-4 left-4 w-10 h-10 bg-baseLightGray hover:bg-white rounded-full center shadow transition"
          >
            <IoArrowBackOutline size={20} className="w-5 h-5 text-gray-800" />
          </button>

          {/* Availability bar */}
          <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white px-4 py-2 flex items-end gap-1.5">
            <span className="font-semibold text-lg">5</span>
            <span className="text-xs font-medium mb-1">tersedia</span>
          </div>
        </div>

        {/* VEHICLE */}
        <div className="px-4 py-5 bg-[#F9FBFB]">
          <span className="text-blackBold font-medium">Uwinfly Seri C70</span>

          <div className="row gap-1.5">
            <span className="text-blackBold font-medium">{`Rp${rupiah(
              0
            )}`}</span>
            <span className="text-black70">/hari</span>
            <span>•</span>
            <span className="text-black90 text-xs">x365 Hari</span>
          </div>
        </div>

        {/* SCHEMA INFORMATION */}
        <div className="mt-1 bg-white p-4 flex flex-col">
          <span className="font-medium">Informasi Skema Sewa Beli</span>

          <BetweenText
            labelLeft="Cicilan"
            labelRight={`Rp${rupiah(0)}/hari`}
            classNameLabelRight="font-semibold"
            className="p-3 rounded-t bg-baseLightGray mt-3"
          />
          <BetweenText
            labelLeft="Total Pembayaran"
            labelRight={`(Rp${rupiah(0)}) 6 bulan`}
            classNameLabelRight="font-semibold"
            className="p-3 "
          />
          <BetweenText
            labelLeft="Deposit"
            labelRight={`Rp${rupiah(0)}`}
            classNameLabelRight="font-semibold"
            className="p-3 rounded-b bg-baseLightGray"
          />

          <Separator className="my-3" />

          <span className="font-medium mb-1">Spesifikasi Kendaraan</span>
          <span className="text-xs text-black90">
            500W 48V 12Ah (jarak 35km)
          </span>
        </div>

        {/* PERSONAL DATA */}
        <div className="p-4">
          <div className="p-3 rounded-lg shadow bg-white space-y-4">
            <IconText icon={FaUser} label="Biodata Diri" />

            <BetweenText
              labelLeft="Nama"
              labelRight={"-"}
              classNameLabelRight="font-semibold"
              className="p-3 rounded bg-baseLightGray"
            />

            <Button
              label="Lengkapi Biodata"
              onClick={() => setOpenCompleteBiodata(true)}
            />
          </div>
        </div>

        {/* NOTED */}
        <div className="p-4 bg-white">
          <span className="font-medium">Tambahkan Catatan</span>

          <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-xl p-3 mt-3">
            <CgNotes className="text-black50" />
            <textarea
              placeholder="ex: mau warna hitam"
              className="w-full bg-transparent outline-none text-sm text-gray-700 resize-none placeholder:text-black50"
              rows={3}
            />
          </div>
        </div>

        {/* LOCATION */}
        <div className="mt-1.5 bg-white p-4">
          <span className="font-medium">Pilih Lokasi Pengambilan</span>

          <div className="mt-3">
            {[1, 2, 3].map((item, index) => (
              <PickUpLocation key={index} isActive={true} onClick={() => {}} />
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-white px-4 py-6 shadow-lg">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setIsAccept((prev) => !prev);
          }}
          className="row gap-3 mb-4 cursor-pointer"
        >
          {isAccept ? (
            <MdCheckBox size={20} className="text-primary100" />
          ) : (
            <MdCheckBoxOutlineBlank size={20} className="text-black50" />
          )}

          <p className="text-xs">
            Dengan ini, Saya menyetujui{" "}
            <span
              onClick={(e) => {
                e?.stopPropagation();
              }}
              className="text-xs text-primary100 font-bold cursor-pointer"
            >
              Syarat & Ketentuan
            </span>
          </p>
        </div>

        <Button label="Ajukan" disabled={true} onClick={() => {}} />
      </div>

      {/* MODALS */}
      {openCompleteBiodata && (
        <ModalPersonalData
          isOpen={openCompleteBiodata}
          onClose={() => setOpenCompleteBiodata(false)}
          onConfirm={() => {}}
        />
      )}
      {/* END MODALS */}
    </div>
  );
};

export default RentToBuyDetails;

interface PickUpLocationProps {
  isActive: boolean;
  onClick: () => void;
}

export const PickUpLocation: React.FC<PickUpLocationProps> = ({
  isActive,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className={`mb-3 bg-white p-3 rounded-xl row gap-2 cursor-pointer ${
        isActive ? "border-2" : "border"
      } border-${isActive ? "primary100" : "black30"} hover:bg-baseLightGray`}
    >
      <div className="w-8 h-8 center rounded-full border border-black100 bg-white">
        <PiStorefrontLight />
      </div>

      <div className="flex-1">
        <span className="text-xs font-medium">Kantor Cabang A</span>
        <p className="text-xs text-black90">
          Jl. Layur No.08, RT.01/RW.7, Jati, Kec. Pulo Gadung, Kota Jakarta
          Timur
        </p>

        <div className="row gap-1">
          <span className="text-xs font-medium text-blackBold">10 km</span>
          <span className="text-xs text-black70">dari anda</span>
          <span
            onClick={() => {}}
            className="text-xs font-medium text-primary100 cursor-pointer"
          >
            {"Lihat Lokasi ->"}
          </span>
        </div>
      </div>
    </div>
  );
};
