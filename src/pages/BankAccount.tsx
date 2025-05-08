import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IcInfoCircleRed, IcPlus } from "../assets";
import { BankAccountList } from "../common";
import {
  AlertModal,
  BankAccountCard,
  Header,
  LoadingPage,
  Separator,
} from "../components";
import {
  fetchBankAccountList,
  fetchDeleteBankAccount,
  hideLoading,
  resetDataDeleteBankAccount,
  showLoading,
} from "../features";
import { AppDispatch, RootState } from "../store";

const BankAccount = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const bankAccountList = useSelector(
    (state: RootState) => state.bankAccountList
  );
  const deleteBankAccount = useSelector(
    (state: RootState) => state.deleteBankAccount
  );

  const [openDelete, setOpenDelete] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<BankAccountList>();

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (deleteBankAccount?.loading) dispatch(showLoading());
    else dispatch(hideLoading());

    if (deleteBankAccount?.data) {
      dispatch(resetDataDeleteBankAccount());
      getData();
    }
  }, [deleteBankAccount]);

  const getData = () => {
    dispatch(fetchBankAccountList());
  };

  const isShow: boolean = bankAccountList?.data?.length ? true : false;

  const onDelete = () => {
    setOpenDelete(false);
    if (selectedData?.ID) {
      dispatch(fetchDeleteBankAccount(selectedData?.ID));
    }
  };

  return (
    <div className="background-1 relative flex flex-col overflow-hidden">
      <Header
        type={"secondary"}
        title="Akun Bank"
        onDismiss={() => navigate(-1)}
      />

      <LoadingPage loading={bankAccountList?.loading}>
        <div className="p-4 pb-8 overflow-auto scrollbar-none">
          {bankAccountList?.data &&
            bankAccountList?.data.map((item, index) => (
              <BankAccountCard
                key={index}
                data={item}
                onDelete={() => {
                  setSelectedData(item);
                  setOpenDelete(true);
                }}
              />
            ))}

          <div className="bg-white rounded-lg px-3 py-4">
            {!isShow && (
              <>
                <span className="text-xs text-black90">
                  Belum ada akun bank
                </span>

                <Separator className="my-3" />
              </>
            )}

            <div
              onClick={() => navigate("/select-bank")}
              className="row cursor-pointer"
            >
              <IcPlus />

              <span className="ml-1 text-primary100 text-xs font-medium">
                Tambah Akun Bank
              </span>
            </div>
          </div>
        </div>
      </LoadingPage>

      {/* MODAL */}
      <AlertModal
        visible={openDelete}
        icon={IcInfoCircleRed}
        title="Apakah kamu ingin menghapus?"
        description="Rekening Bank akan dihapus"
        labelButtonLeft="Ya"
        labelButtonRight="Tidak"
        onDismiss={() => setOpenDelete(false)}
        onClick={onDelete}
      />
      {/* END MODAL */}
    </div>
  );
};

export default BankAccount;
