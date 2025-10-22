export const FormDefaultPersonalData: (data: any | null) => FormPersonalData = (
  data
) => {
  const newForm: FormPersonalData = {
    fullname: "",
    nik: "",
    noSIMC: "",
    noHP: "",
    email: "",
    imageKTP: "",
    imageKK: "",
    imageSIMC: "",
  };

  return newForm;
};

export const FormErrorDefaultPersonalData: FormErrorPersonalData = {};
