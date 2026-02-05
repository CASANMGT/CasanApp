import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Header, LoadingPage } from "../../components";
import { openWhatsApp } from "../../helpers";
import { CUSTOMER_SERVICES } from "../../common";
import { useState } from "react";

const RentalBookingDetails = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams();
  const { isAuthenticated } = useAuth();

  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RentalProps>();

  return (
    <div className="background-1 overflow-hidden justify-between flex flex-col">
      <Header
        type="booking"
        title="Detail Booking"
        onDismiss={() => navigate(-1)}
        onPress={() => openWhatsApp(CUSTOMER_SERVICES)}
      />

      {/* <LoadingPage loading={loading}>

      </LoadingPage> */}
    </div>
  );
};

export default RentalBookingDetails;
