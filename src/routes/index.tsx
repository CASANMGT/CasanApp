import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import {
  BalanceHistory,
  BalanceDetails,
  BankAccount,
  Charging,
  ChargingStationDetails,
  ComingSoon,
  ConfirmationPin,
  EditProfile,
  Home,
  Location,
  LocationList,
  Login,
  Main,
  NotFound,
  Order,
  PaymentSuccess,
  PrivacyPolice,
  Profile,
  Scan,
  SelectBank,
  SessionDetails,
  SessionSettings,
  SettingPin,
  Splash,
  TermCondition,
  Test,
  TopUp,
  TransactionDetails,
  TransactionHistory,
  Vehicle,
  VerificationNumber,
  Withdraw,
  WithdrawalDetails,
  WithdrawalHistory,
  Voucher,
  VoucherDetails,
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
          path="charging-station-details/:id"
          element={<ChargingStationDetails />}
        />
        <Route path="location-list" element={<LocationList />} />
        <Route path="login" element={<Login />} />
        <Route path="text-condition" element={<TermCondition />} />
        <Route path="privacy-police" element={<PrivacyPolice />} />
        <Route path="scan" element={<Scan />} />
        <Route path="session-settings/:id?" element={<SessionSettings />} />
        <Route
          path="payment-success/:id"
          element={<ProtectedRoute element={<PaymentSuccess />} />}
        />
        <Route
          path="session-details/:id"
          element={<ProtectedRoute element={<SessionDetails />} />}
        />

        <Route path="vehicle" element={<Vehicle />} />
        <Route path="verification" element={<VerificationNumber />} />

        {/* PROFILE TAB */}
        <>
          <Route
            path="edit-profile"
            element={
              <ProtectedRoute
                element={<ProtectedRoute element={<EditProfile />} />}
              />
            }
          />
          <Route
            path="withdraw"
            element={<ProtectedRoute element={<Withdraw />} />}
          />
          <Route
            path="top-up"
            element={<ProtectedRoute element={<TopUp />} />}
          />
          <Route
            path="voucher"
            element={<ProtectedRoute element={<Voucher />} />}
          />
          <Route
            path="voucher/details/:id"
            element={<ProtectedRoute element={<VoucherDetails />} />}
          />

          <Route
            path="setting-pin"
            element={<ProtectedRoute element={<SettingPin />} />}
          />
          <Route
            path="confirmation-pin"
            element={<ProtectedRoute element={<ConfirmationPin />} />}
          />
          <Route
            path="balance-history"
            element={<ProtectedRoute element={<BalanceHistory />} />}
          />

          <Route
            path="balance-history/details"
            element={<ProtectedRoute element={<BalanceDetails />} />}
          />

          <Route
            path="transaction-history"
            element={<ProtectedRoute element={<TransactionHistory />} />}
          />
          <Route
            path="transaction-history/details/:id"
            element={<ProtectedRoute element={<TransactionDetails />} />}
          />
          <Route
            path="withdrawal-history"
            element={
              <ProtectedRoute
                element={<ProtectedRoute element={<WithdrawalHistory />} />}
              />
            }
          />
          <Route
            path="withdrawal-history/details"
            element={
              <ProtectedRoute
                element={<ProtectedRoute element={<WithdrawalDetails />} />}
              />
            }
          />
          <Route
            path="bank-account"
            element={<ProtectedRoute element={<BankAccount />} />}
          />
          <Route
            path="select-bank"
            element={<ProtectedRoute element={<SelectBank />} />}
          />
        </>
        {/* END PROFILE TAB */}

        {/* BOTTOM NAVIGATION */}
        <Route path="home" element={<Main />}>
          <Route path="index" element={<Home />} />
          <Route path="location" element={<Location />} />
          <Route
            path="order"
            element={<ProtectedRoute element={<Order />} />}
          />
          <Route
            path="profile"
            element={<ProtectedRoute element={<Profile />} />}
          />
        </Route>

        {/* HANDLE PATH NOT FOUND */}
        <Route path="test" element={<Test />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  );
};

export default RoutesPage;
