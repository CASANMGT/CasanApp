import { isEmpty } from "lodash";
import React, { useState } from "react";
import { IcClose } from "../../../assets";
import {
  ERROR_MESSAGE,
  FormDefaultPersonalData,
  FormErrorDefaultPersonalData,
} from "../../../common";
import { useForm } from "../../../helpers";
import { Button, Input, UploadImage } from "../../atoms";
import ModalContainer from "./ModalContainer";

const ModalPersonalData: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [form, setForm] = useForm<FormPersonalData>(
    FormDefaultPersonalData(null)
  );
  const [formError, setFormError] = useForm<FormErrorPersonalData>(
    FormErrorDefaultPersonalData
  );

  const [loading, setLoading] = useState<boolean>(false);

  const onDismiss = () => {
    setForm("reset");
    setFormError("reset");
    onClose();
  };

  const onValidation = () => {
    const errors: FormErrorPersonalData = {};

    if (!form?.fullname) errors.fullname = "Nama Wajib Diisi!";
    if (!form?.nik) errors.nik = "NIK Wajib Diisi!";
    if (!form?.noSIMC) errors.noSIMC = "No SIM Wajib Diisi!";
    if (!form?.noHP) errors.noHP = "No HP Wajib Diisi!";
    if (!form?.email) errors.email = "Email Wajib Diisi!";
    if (!form?.imageKTP) errors.imageKTP = "KTP Wajib Diisi!";
    if (!form?.imageKK) errors.imageKK = "KK Wajib Diisi!";
    if (!form?.imageSIMC) errors.imageSIMC = "SIM C Wajib Diisi!";

    if (isEmpty(errors)) onSubmit();
    else setFormError("all", errors);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      // const body: EditVehicleBodyProps = await EditVehicleBody(form, data?.ID);

      // await Api.put({
      //   url: "vehicles",
      //   body,
      // });

      if (onConfirm) onConfirm();
      onDismiss();
      setLoading(false);
    } catch (error) {
      setLoading(false);
      alert(ERROR_MESSAGE);
    }
  };

  return (
    <ModalContainer
      isOpen={isOpen}
      isBottom
      onDismiss={onClose}
      classNameBottom="!h-3/4 overflow-hidden relative flex-1"
    >
      <div className="w-full bg-white p-4 rounded-t-xl relative overflow-hidden flex flex-col">
        {/* HEADER */}
        <div className="between-x mb-4">
          <label className="text-base font-semibold">Biodata Diri</label>

          <div onClick={onClose} className="cursor-pointer">
            <IcClose className="text-black100" />
          </div>
        </div>

        <p className="text-xs text-black90 mb-4">
          *Verifikasi Maximal{" "}
          <span className="text-black100 font-medium text-xs">1x 24 jam</span>
        </p>

        <div className="overflow-auto flex-1 scrollbar-none">
          <div className="space-y-3">
            <Input
              label="Nama Lengkap"
              value={form.fullname}
              error={formError?.fullname}
              placeholder="Nama Lengkap"
              onChange={(value) => {
                if (formError?.fullname) setFormError("fullname", "");
                setForm("fullname", value);
              }}
            />

            <Input
              label="NIK"
              value={form.nik}
              error={formError?.nik}
              placeholder="NIK"
              onChange={(value) => {
                if (formError?.nik) setFormError("nik", "");
                setForm("nik", value);
              }}
            />

            <Input
              label="No SIM"
              value={form.noSIMC}
              error={formError?.noSIMC}
              placeholder="No SIM"
              onChange={(value) => {
                if (formError?.noSIMC) setFormError("noSIMC", "");
                setForm("noSIMC", value);
              }}
            />
            <Input
              label="No HP"
              value={form.noHP}
              error={formError?.noHP}
              placeholder="No HP"
              onChange={(value) => {
                if (formError?.noHP) setFormError("noHP", "");
                setForm("noHP", value);
              }}
            />
            <Input
              label="Email"
              value={form.email}
              error={formError?.email}
              placeholder="Email"
              onChange={(value) => {
                if (formError?.email) setFormError("email", "");
                setForm("email", value);
              }}
            />

            <div className="grid grid-cols-2 gap-3">
              <UploadImage
                value={form.imageKTP}
                placeholder="Upload KTP"
                error={formError.imageKTP}
                onChange={(select) => {
                  if (formError.imageKTP) setFormError("imageKTP", "");
                  setForm("imageKTP", select);
                }}
              />

              <UploadImage
                value={form.imageKK}
                placeholder="Upload KK"
                error={formError.imageKK}
                onChange={(select) => {
                  if (formError.imageKK) setFormError("imageKK", "");
                  setForm("imageKK", select);
                }}
              />

              <UploadImage
                value={form.imageSIMC}
                placeholder="Upload SIM C"
                error={formError.imageSIMC}
                onChange={(select) => {
                  if (formError.imageSIMC) setFormError("imageSIMC", "");
                  setForm("imageSIMC", select);
                }}
              />
            </div>
          </div>
          <Button
            label="Simpan"
            loading={loading}
            onClick={onValidation}
            className="mt-8"
          />
        </div>
      </div>
    </ModalContainer>
  );
};

export default ModalPersonalData;
