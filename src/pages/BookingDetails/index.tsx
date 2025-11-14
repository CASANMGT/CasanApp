import { useState } from "react";
import { FaChevronRight, FaLock, FaUser } from "react-icons/fa6";
import { FiEdit3, FiNavigation } from "react-icons/fi";
import { GiSandsOfTime } from "react-icons/gi";
import {
  MdHistory,
  MdInfo,
  MdOutlineStorefront,
  MdPhoneInTalk,
} from "react-icons/md";
import { TbRoute } from "react-icons/tb";
import { WiTime4 } from "react-icons/wi";
import { useNavigate } from "react-router-dom";
import { ILNoImage, ILPin } from "../../assets";
import {
  BetweenText,
  Button,
  Header,
  IconText,
  LoadingPage,
  ModalVehicleDetails,
  Separator,
} from "../../components";
import { moments, rupiah } from "../../helpers";
import Container from "./Container";
import Status from "./Status";
import { PiWarningCircle, PiWarningCircleFill } from "react-icons/pi";

const BookingDetails = () => {
  const navigate = useNavigate();

  const [openVehicleDetails, setOpenVehicleDetails] = useState<boolean>(false);

  const status = 11;

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header
        type="secondary"
        title="Detail Booking"
        onDismiss={() => navigate(-1)}
        onPress={() => {}}
      />

      <LoadingPage loading={false}>
        <div className="flex flex-col flex-1 overflow-hidden relative">
          <div className="flex-1 overflow-auto scrollbar-none space-y-3 px-4 pb-7 pt-6 ">
            <Status />

            {(status === 5 ||
              status === 6 ||
              status === 7 ||
              status === 11) && (
              <Container className="">
                <div className="between-x mb-2">
                  <span className="text-xs text-blackBold">
                    {status === 5 || status === 11
                      ? "Saldo Kredit"
                      : "Tagihan Tersisa"}
                  </span>
                  <div className="row gap-1.5">
                    <span className="text-xs text-primary100 font-medium">
                      Lihat riwayat
                    </span>
                    <MdHistory size={14} className="text-primary100" />
                  </div>
                </div>

                <div className="row gap-1.5 mb-1">
                  <span className="text-blackBold font-semibold">5</span>
                  <span className="text-xs text-black90">Kredit Hari</span>
                </div>

                <div className="flex-1 h-3 bg-black10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary100 transition-all duration-300"
                    style={{ width: `${10}%` }}
                  />
                </div>
                <div className="row gap-1.5 mt-1">
                  <span className="text-xs text-black70">Jatuh Tempo</span>
                  <span className="text-xs ">
                    {moments().format("DD MMMM YYYY")}
                  </span>
                  {status === 6 && (
                    <span className="text-red text-xs font-medium ml-2">
                      Terlambat 3 Hari
                    </span>
                  )}
                </div>

                {status == 11 && (
                  <div className="flex-1 row gap-1 mt-4">
                    <div className="center rounded-full w-5 h-5 bg-lightOrange">
                      <WiTime4 size={12} className="text-orange" />
                    </div>

                    <span className="text-black90 font-medium">
                      Libur Bayar
                    </span>

                    <span className="text-blackBold font-medium ml-2">
                      1 Hari Lagi
                    </span>
                    <span className="text-black70 font-medium">
                      (12-15 Apr)
                    </span>
                  </div>
                )}

                <Separator className="my-3" />

                <div className="between-x">
                  <Button
                    label="Beli Kredit harian"
                    iconRight={FaChevronRight}
                    onClick={() => navigate("/buy-credit")}
                    className="flex-1"
                  />

                  <div className="flex-1 row gap-1 center">
                    {(status === 6 || status === 7) && (
                      <>
                        <div className="center rounded-full w-5 h-5 bg-lightRed">
                          <PiWarningCircleFill size={12} className="text-red" />
                        </div>

                        <span className="text-blackBold font-semibold">{`Rp${rupiah(
                          0
                        )}`}</span>
                      </>
                    )}
                  </div>
                </div>
              </Container>
            )}

            <Container className="mt-2">
              <div className="row gap-4 ">
                <div className="flex-1 ">
                  <div className="row gap-1 font-semibold">
                    <span className="text-blackBold ">Uwinfly Seri C70</span>
                    <span className="text-black70">(***34B)</span>
                  </div>

                  <div className="row gap-1 font-medium">
                    <span className="text-black90 text-xs">
                      Uwinfly Seri C70
                    </span>
                    <span className="text-black70 text-xs">(***34B)</span>
                  </div>

                  {status !== 9 && status !== 10 && (
                    <span
                      onClick={() => setOpenVehicleDetails(true)}
                      className="text-xs text-primary100 font-medium cursor-pointer"
                    >
                      {"Lihat Detail >"}
                    </span>
                  )}
                </div>

                <div className="relative w-[78px] h-[78px]">
                  <img
                    src={ILNoImage}
                    alt="photo"
                    className="w-full h-full rounded-lg bg-baseLightGray "
                  />

                  {(status === 7 || status === 11) && (
                    <div className="center absolute top-0 left-0 right-0 bottom-0 bg-black100/50 rounded-lg">
                      <FaLock size={32} className="text-white z-10" />
                    </div>
                  )}
                </div>
              </div>

              {(status === 5 ||
                status === 6 ||
                status === 7 ||
                status === 8 ||
                status === 11) && (
                <>
                  <Separator className="my-3" />

                  <div className="row gap-1.5">
                    <div className="flex-1 p-3 h-[70x] flex flex-col justify-center gap-2 bg-baseLightGray rounded-sm">
                      <span className="text-xs text-black90 ">
                        Lokasi Kendaraan
                      </span>
                      <div className="row gap-2">
                        <span className="text-blackBold text-xs font-medium">
                          Tangerang
                        </span>
                        <div className="center w-6 h-6 rounded-full border border-primary100 bg-primary10">
                          <FiNavigation size={12} className="text-primary100" />
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 p-3 h-[70x] flex flex-col justify-center gap-2 bg-baseLightGray rounded-sm">
                      <span className="text-xs text-black90 ">
                        Jarak Tempuh Hari ini
                      </span>
                      <span className="text-black100 text-base font-medium">
                        10km
                      </span>
                    </div>
                  </div>

                  <div className="flex items-baseline">
                    <div className="row gap-1.5 bg-primary10 border border-primary100 rounded-full px-3 py-2 mt-3">
                      <span className="text-xs text-primary100 font-medium">
                        Lihat Perjalanan Saya
                      </span>
                      <TbRoute size={12} className="text-primary100" />
                    </div>
                  </div>
                </>
              )}
            </Container>

            {(status === 4 || status === 9 || status === 10) && (
              <Container className="flex flex-col gap-2">
                <span className="text-blackBold">Informasi Pengambilan</span>

                <div className="row gap-1.5">
                  <span className="text-xs text-black90">ID</span>
                  <span className="text-xs text-blackBold font-medium">
                    1234
                  </span>
                </div>

                {status === 4 && (
                  <>
                    <Separator className="my-1" />

                    <div className="row gap-1">
                      <GiSandsOfTime size={16} className="text-primary100" />
                      <span className="text-primary100 text-xs font-medium">
                        Batas Akhir Pengambilan
                      </span>
                    </div>

                    <div className="row gap-1.5">
                      <span className="text-base font-semibold text-blackBold">
                        {moments().format("dddd, DD MMM")}
                      </span>
                      <span className="text-black70">{`${moments().format(
                        "HH:mm"
                      )} WIB`}</span>
                    </div>
                  </>
                )}

                <Separator className="my-1" />

                <div className="flex gap-4">
                  <div className="space-y-2">
                    <div className="row gap-1">
                      <MdOutlineStorefront
                        size={16}
                        className="text-primary100"
                      />
                      <span className="text-primary100 text-xs font-medium">
                        Alamat Pengambilan
                      </span>
                    </div>

                    <span className="text-xs text-black90">
                      Jl. Letnan Sutopo, Rw. Mekar Jaya, Kec. Serpong, Kota
                      Tangerang Selatan, Banten
                    </span>
                  </div>

                  <img src={ILPin} alt="Pin" className="w-16 h-16 rounded-sm" />
                </div>

                {status === 4 && (
                  <>
                    {" "}
                    <Separator className="my-1" />
                    <div className="row gap-1">
                      <WiTime4 size={16} className="text-primary100" />
                      <span className="text-primary100 text-xs font-medium">
                        Jam Operasional
                      </span>
                    </div>
                    <div className="row gap-1.5">
                      <span className="text-xs text-black90">Buka:</span>
                      <span className="text-xs text-blackBold font-medium">
                        {"09:00"}
                      </span>
                      <span className="pl-1.5 text-xs text-black90">
                        Tutup:
                      </span>
                      <span className="text-xs text-blackBold font-medium">
                        {"19:00"}
                      </span>
                    </div>
                  </>
                )}

                {status !== 10 && (
                  <>
                    <Separator className="my-1" />

                    <div className="between-x">
                      <span className="text-blackBold font-medium">
                        Hubungi Kami:
                      </span>

                      <div
                        onClick={() => {}}
                        className="row gap-1.5 px-3 py-1.5 bg-primary10 border border-primary100 rounded-full cursor-pointer"
                      >
                        <MdPhoneInTalk size={16} className="text-primary100" />
                        <span className="text-xs text-primary100 font-medium">
                          Sales (Rere)
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </Container>
            )}

            {status === 3 && (
              <Container>
                <span className="text-blackBold font-medium">
                  Alasan Penolakan
                </span>

                <div className="p-3 mt-4 rounded-sm font-medium bg-baseLightGray">
                  Dokumen Palsu
                </div>
              </Container>
            )}

            {(status === 3 ||
              status === 4 ||
              status === 5 ||
              status === 6 ||
              status === 7 ||
              status === 8 ||
              status === 9 ||
              status === 10 ||
              status === 11) && (
              <Container>
                <IconText
                  icon={MdInfo}
                  label="Informasi Skema RTO"
                  className="mb-3"
                />

                <BetweenText
                  labelLeft="Cicilan"
                  labelRight={`Rp${rupiah(0)}/hari`}
                  classNameLabelRight="font-semibold"
                  className="p-3 rounded-t bg-baseLightGray"
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
                  className={`p-3 bg-baseLightGray ${
                    status === 3 && "rounded-b"
                  }`}
                />
                <BetweenText
                  labelLeft="Perkiraan Selesai"
                  labelRight={moments().format("DD MMMM YYYY")}
                  classNameLabelRight="font-semibold"
                  className="p-3 "
                />
                <BetweenText
                  labelLeft="Libur Pembayaran"
                  labelRight={"Setiap Hari Minggu"}
                  classNameLabelRight="font-semibold"
                  className={`p-3 bg-baseLightGray ${
                    status !== 6 && status !== 7 && "rounded-b"
                  }`}
                />
                {status !== 6 && status !== 7 && (
                  <BetweenText
                    labelLeft="Progres"
                    labelRight={"1/365"}
                    classNameLabelRight="font-semibold"
                    className="p-3 "
                  />
                )}
              </Container>
            )}

            {(status === 1 || status === 2 || status === 3) && (
              <Container>
                <div className="between-x">
                  <IconText
                    icon={FaUser}
                    label="Biodata Diri"
                    className="flex-1"
                  />

                  <div onClick={() => {}} className="row gap-1 cursor-pointer">
                    <span className="text-xs text-primary100 font-medium">
                      Ubah
                    </span>
                    <FiEdit3 size={12} className="text-primary100" />
                  </div>
                </div>

                <div className="p-3 bg-baseLightGray rounded-sm mt-4 row gap-2">
                  <span className="text-base text-black80">Nama</span>
                  <span className="text-base text-black100 font-medium">
                    Tedy Iman
                  </span>
                  <span className="text-xs text-primary100 font-medium bg-primary10 rounded-sm p-1">
                    Diterima
                  </span>
                </div>
              </Container>
            )}

            {(status === 1 || status === 2) && (
              <Container>
                <IconText
                  icon={MdInfo}
                  label="Informasi Skema Sewa Beli"
                  className="mb-3"
                />

                <BetweenText
                  labelLeft="Cicilan"
                  labelRight={`Rp${rupiah(0)}/hari`}
                  classNameLabelRight="font-semibold"
                  className="p-3 rounded-t bg-baseLightGray"
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
              </Container>
            )}
          </div>

          {/* FOOTER */}
          {status === 3 && (
            <div className="container-button-footer">
              <Button
                buttonType="lg"
                label="Ajukan Kembali"
                onClick={() => {}}
              />
            </div>
          )}
        </div>
      </LoadingPage>

      {/* MODALS */}
      {openVehicleDetails && (
        <ModalVehicleDetails
          isOpen={openVehicleDetails}
          onClose={() => setOpenVehicleDetails(false)}
        />
      )}
      {/* END MODALS */}
    </div>
  );
};

export default BookingDetails;
