import { isEmpty } from "lodash";
import { useEffect, useState } from "react";
import { FaFileLines, FaUser } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcSuccessGreen } from "../assets";
import {
  AlertModal,
  Button,
  Header,
  Input,
  SubTitle,
  UploadImage,
} from "../components";
import { fetchMyUser } from "../features";
import { convertPhoneTo62, getImageUrl, useForm } from "../helpers";
import { Api } from "../services";
import { AppDispatch, RootState } from "../store";

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const myUser = useSelector((state: RootState) => state.myUser);

  const [form, setForm] = useForm<FormEditAccountProps>({
    name: "",
    phone: "",
    email: "",
    nik: "",
    simc: "",
    ktpImage: "",
    simcImage: "",
    kkImage: "",
  });

  const [formError, setFormError] = useForm<FormErrorEditAccountProps>({});

  const [loading, setLoading] = useState(false);
  const [openSuccess, setOpenSuccess] = useState(false);

  useEffect(() => {
    if (!myUser?.data) dispatch(fetchMyUser());
  }, []);

  useEffect(() => {
    const getData = () => {
      const user: UserProps | null = myUser?.data;
      const dataForm: FormEditAccountProps = {
        name: user?.Name || "",
        phone: user?.Phone ? user?.Phone.replace("+62", "") : "",
        email: user?.Email || "",
        nik: user?.NIK || "",
        simc: user?.SIMCNo || "",
        ktpImage: user?.KTPImage || "",
        simcImage: user?.SIMCImage || "",
        kkImage: user?.KKImage || "",
      };

      setForm("all", dataForm);
    };

    getData();
  }, [myUser?.data]);

  const onValidation = () => {
    const errors: FormErrorEditAccountProps = {};

    if (!form.name) errors.name = "Nama lengkap kosong!";
    if (form.nik && form.nik.length < 16) errors.nik = "NIK minimal 16 angka!";
    if (form.simc && form.simc.length < 14)
      errors.simc = "Sim C minimal 14 angka!";

    if (isEmpty(errors)) onSubmit();
    else setFormError("all", errors);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);
      const [ktpimage, simcimage, kkimage] = await Promise.all([
        getImageUrl(form.ktpImage),
        getImageUrl(form.simc),
        getImageUrl(form.kkImage),
      ]);

      const body: EditUserBodyProps = {
        name: form.name,
        phone: convertPhoneTo62(form.phone),
        email: form.email,
        nik: form.nik,
        simcno: form.simc,
        ktpimage,
        simcimage,
        kkimage,
      };

      await Api.put({
        url: "users",
        body,
      });

      setOpenSuccess(true);
      dispatch(fetchMyUser());
    } catch (error) {
      const dataError: any = error;
      if (dataError?.response?.data?.error) {
        if (dataError?.response?.data?.code === "4105")
          setFormError("phone", "No HP telah digunakan");
        if (dataError?.response?.data?.code === "4104")
          setFormError("email", "Email telah digunakan");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="background-1 flex flex-col justify-between overflow-hidden">
      <Header
        type={"secondary"}
        title="Edit Akun"
        onDismiss={() => navigate(-1)}
      />

      <div className="flex-1 overflow-auto scrollbar-none p-4 space-y-4">
        <div className="bg-white rounded-lg p-4">
          <SubTitle icon={FaUser} label="Informasi Akun" className="mb-4" />

          <div className="space-y-[14px]">
            <Input
              label="Nama Lengkap"
              value={form.name}
              error={formError.name}
              placeholder="Nama"
              onChange={(value) => {
                if (formError.name) setFormError("name", "");
                setForm("name", value);
              }}
            />

            <Input
              type="phone"
              label="Nomor Handphone"
              value={form.phone}
              error={formError.phone}
              disabled
              onChange={(value) => {}}
            />

            <Input
              label="Email"
              labelExtra="Opsional"
              value={form.email}
              error={formError.email}
              placeholder="Email (Opsional)"
              onChange={(value) => setForm("email", value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg p-4">
          <SubTitle
            icon={FaFileLines}
            label="Dokumen Tambahan (Opsional)"
            className="mb-4"
          />

          <div className="space-y-[14px]">
            <Input
              type="number"
              label="NIK"
              value={form.nik}
              error={formError.nik}
              placeholder="NIK"
              onChange={(value) => {
                if (formError.nik) setFormError("nik", "");
                setForm("nik", value);
              }}
            />

            <Input
              type="number"
              label="No Sim C"
              value={form.simc}
              error={formError.simc}
              placeholder="No Sim C"
              onChange={(value) => {
                if (formError.simc) setFormError("simc", "");
                setForm("simc", value);
              }}
            />

            <div className="grid grid-cols-2 gap-4">
              <UploadImage
                label="KTP"
                value={form.ktpImage}
                onChange={(select) => setForm("ktpImage", select)}
              />

              <UploadImage
                label="SIM C"
                value={form.simcImage}
                onChange={(select) => setForm("simcImage", select)}
              />

              <UploadImage
                label="KK"
                value={form.kkImage}
                onChange={(select) => setForm("kkImage", select)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container-button-footer">
        <Button
          buttonType="lg"
          label="SIMPAN"
          loading={loading}
          onClick={onValidation}
        />
      </div>

      {/* MODAL */}
      <AlertModal
        visible={openSuccess}
        icon={IcSuccessGreen}
        title="Akun berhasil Diperbarui"
        description="Informasi Akun berhasil diperbarui"
        labelButtonRight="Tutup"
        onDismiss={() => setOpenSuccess(false)}
      />
    </div>
  );
};

export default EditProfile;
