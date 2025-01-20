import { Route, Routes } from "react-router-dom";
import {
  Charging,
  ChargingLocationDetails,
  ComingSoon,
  History,
  Home,
  InputPin,
  Location,
  LocationList,
  Login,
  Main,
  NotFound,
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

const RoutesPage = () => {
  return (
      <Routes>
        <Route index element={<Splash />} />
        <Route path="charging" element={<Charging />} />
        <Route
          path="charging-location-details"
          element={<ChargingLocationDetails />}
        />
        <Route path="input-pin" element={<InputPin />} />
        <Route path="location-list" element={<LocationList />} />
        <Route path="login" element={<Login />} />
        <Route path="scan" element={<Scan />} />
        <Route path="select-bank" element={<SelectBank />} />
        <Route path="select-payment-method" element={<SelectPaymentMethod />} />
        <Route path="session-settings" element={<SessionSettings />} />
        <Route path="session-details" element={<SessionDetails />} />
        <Route path="top-up-balance" element={<TopUpBalance />} />
        <Route path="transaction-history" element={<TransactionHistory />} />
        <Route
          path="transaction-history-details"
          element={<TransactionHistoryDetails />}
        />
        <Route path="vehicle" element={<Vehicle />} />
        <Route path="verification" element={<VerificationNumber />} />
        <Route path="withdraw" element={<Withdraw />} />

        {/* BOTTOM NAVIGATION */}
        <Route path="home" element={<Main />}>
          <Route path="index" element={<Home />}></Route>
          <Route path="location" element={<ComingSoon />} />
          <Route path="history" element={<ComingSoon />} />
          <Route path="profile" element={<ComingSoon />} />
          {/* <Route path="location" element={<Location />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<Profile />} /> */}
        </Route>

        {/* HANDLE PATH NOT FOUND */}
        <Route path="/test" element={<Test />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default RoutesPage;
