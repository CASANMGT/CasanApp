import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import {
  Charging,
  ChargingStationDetails,
  ComingSoon,
  Order,
  Home,
  InputPin,
  Location,
  LocationList,
  Login,
  Main,
  NotFound,
  PaymentSuccess,
  Profile,
  Scan,
  SelectBank,
  SelectPaymentMethod,
  SessionDetails,
  SessionSettings,
  Splash,
  Test,
  TopUpBalance,
  TransactionHistory,
  TransactionHistoryDetails,
  Vehicle,
  VerificationNumber,
  Withdraw,
} from "../pages";
import ProtectedRoute from "./ProtectedRoute";

const RoutesPage = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route index element={<Splash />} />
        <Route path="coming-soon" element={<ComingSoon />} />
        <Route
          path="charging/:id"
          element={<ProtectedRoute element={<Charging />} />}
        />
        <Route
          path="charging-station-details"
          element={<ProtectedRoute element={<ChargingStationDetails />} />}
        />
        <Route path="input-pin" element={<InputPin />} />
        <Route path="location-list" element={<ProtectedRoute element={<LocationList />} />} />
        <Route path="login" element={<Login />} />
        <Route path="scan" element={<Scan />} />
        <Route path="select-bank" element={<SelectBank />} />
        <Route path="select-payment-method" element={<SelectPaymentMethod />} />
        <Route
          path="session-settings"
          element={<ProtectedRoute element={<SessionSettings />} />}
        />
        <Route
          path="payment-success/:id"
          element={<ProtectedRoute element={<PaymentSuccess />} />}
        />
        <Route
          path="session-details/:id"
          element={<ProtectedRoute element={<SessionDetails />} />}
        />
        <Route path="top-up-balance" element={<TopUpBalance />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
        <Route
          path="transaction-history-details/:type/:id"
          element={<ProtectedRoute element={<TransactionHistoryDetails />} />}
        />
        <Route path="vehicle" element={<Vehicle />} />
        <Route path="verification" element={<VerificationNumber />} />
        <Route path="withdraw" element={<Withdraw />} />

        {/* BOTTOM NAVIGATION */}
        <Route path="home" element={<ProtectedRoute element={<Main />} />}>
          <Route path="index" element={<Home />}></Route>
          <Route path="location" element={<Location />} />
          <Route path="order" element={<Order />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* HANDLE PATH NOT FOUND */}
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default RoutesPage;
