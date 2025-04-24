import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcUser } from "../assets";
import { REGEX_PHONE_NUMBER_HALF } from "../common";
import { Button, Header, Input, SubTitle } from "../components";
import {
  EditUserRequestProps,
  fetchEditUser,
  resetDataEditUser,
} from "../features/users/editUserSlice";
import { useForm } from "../helpers";
import { AppDispatch, RootState } from "../store";
import { fetchMyUser } from "../features";

interface FormEditProfile {
  name: string;
  phone: string;
  email: string;
}
interface FormErrorEditProfile {
  name?: string;
  phone?: string;
  email?: string;
}

const EditProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const myUser = useSelector((state: RootState) => state.myUser);
  const editUser = useSelector((state: RootState) => state.editUser);

  const [form, setForm] = useForm<FormEditProfile>({
    name: "",
    phone: "",
    email: "",
  });

  const [formError, setFormError] = useForm<FormErrorEditProfile>({});

  useEffect(() => {
    const getData = () => {
      const dataForm: FormEditProfile = {
        name: myUser?.data?.Name || "",
        phone: myUser?.data?.Phone?.replace("+62", "") || "",
        email: myUser?.data?.Email || "",
      };

      setForm("all", dataForm);
    };

    getData();
  }, []);

  useEffect(() => {
    if (editUser?.data) {
      dispatch(resetDataEditUser());
      dispatch(fetchMyUser());
    }
  }, [editUser]);

  const handleChange = (type: "name" | "phone" | "email", value: string) => {
    setForm(type, value);
  };

  const validation = () => {
    let value: boolean = true;
    let validationPhone: boolean = REGEX_PHONE_NUMBER_HALF.test(form.phone);

    if (form.name.trim() && form.phone.trim() && validationPhone) value = false;

    return value;
  };

  const onSubmit = () => {
    try {
      const body: EditUserRequestProps = {
        name: form.name,
        phone: `+62${form.phone}`,
        email: form.email,
      };
      
      dispatch(fetchEditUser(body));
    } catch (error) {
      console.log(error);
    }
  };

  console.log("cek d", editUser);

  return (
    <div className="background-1">
      <Header
        type={"secondary"}
        title="Edit Akun"
        onDismiss={() => navigate(-1)}
      />

      <div className="bg-white rounded-lg p-3 m-4 space-y-3">
        <div>
          <SubTitle icon={IcUser} label="Informasi Akun" />
        </div>

        <Input
          value={form.name}
          placeholder="Nama"
          onChange={(value) => handleChange("name", value)}
        />

        <Input
          type={"phone"}
          value={form.phone}
          placeholder="Nomor Handphone"
          onChange={(value) => handleChange("phone", value)}
        />

        <Input
          value={form.email}
          placeholder="Email (Opsional)"
          onChange={(value) => handleChange("email", value)}
        />

        <Button
          label="Simpan"
          loading={editUser?.loading}
          disabled={validation()}
          onClick={onSubmit}
        />
      </div>
    </div>
  );
};

export default EditProfile;
