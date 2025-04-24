import { useNavigate } from "react-router-dom";
import { IcPlus } from "../assets";
import { BankAccountCard, Header, Separator } from "../components";

const BankAccount = () => {
  const navigate = useNavigate();

  const isShow: boolean = dataDummy?.length ? true : false;

  return (
    <div className="background-1 relative flex flex-col overflow-hidden">
      <Header
        type={"secondary"}
        title="Akun Bank"
        onDismiss={() => navigate(-1)}
      />

      <div className="p-4 pb-8 overflow-auto scrollbar-none">
        {isShow && dataDummy.map((_, index) => <BankAccountCard key={index} />)}

        <div className="bg-white rounded-lg px-3 py-4">
          {!isShow && (
            <>
              <span className="text-xs text-black90">Belum ada akun bank</span>

              <Separator className="my-3" />
            </>
          )}

          <div onClick={() => {}} className="row cursor-pointer">
            <IcPlus />

            <span className="ml-1 text-primary100 text-xs font-medium">
              Tambah Akun Bank
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BankAccount;

const dataDummy = [1, 2, 3];
