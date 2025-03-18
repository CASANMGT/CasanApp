import { IcInfoCircle } from "../../assets";
import { useAlert } from "../../context/AlertContext";

const PopupAlert = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const getAlertColor = () => {
    switch (alert.type) {
      case "success":
        return "bg-green-100 border-green-400 text-green-800";
      case "error":
        return "bg-red-100 border-red-400 text-red-800";
      case "warning":
        return "bg-yellow-100 border-yellow-400 text-yellow-800";
      default:
        return "bg-blue-100 border-blue-400 text-blue-800";
    }
  };

  return (
    <div className="fixed bottom-[60px] left-1/2 -translate-x-1/2 z-50 shadow-lg flex items-start">
      <div className="w-[358px] row bg-white py-3 px-4 rounded-lg shadow-lg transition-all transform duration-300 animate-fade-in">
        <div className="w-8 h-8 center rounded-full bg-lightRed mr-4">
          <IcInfoCircle className="text-red w-6" />
        </div>

        <div className="flex-1">
          <p className="font-semibold text-base">{alert?.message?.title}</p>
          <p className="text-xs">{alert?.message?.body}</p>
        </div>

        <button
          onClick={hideAlert}
          className="absolute top-2 right-3 text-xl font-bold text-gray-700 hover:text-black transition-transform transform hover:scale-110"
        >
          &times;
        </button>
      </div>
    </div>
  );
};

export default PopupAlert;
