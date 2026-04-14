import { Route, Routes } from "react-router-dom";
import {
  BalanceDetails,
  BalanceHistory,
  BankAccount,
  BuyCredit,
  ChargingNew,
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
  ProfileNew,
  ProgressDetails,
  RentalBookingDetails,
  RentalHistory,
  RentToBuy,
  RentToBuyDetails,
  RTOBookingDetails,
  RTOHistory,
  RTOMotorbikeProgram,
  RTOOperatorDetail,
  RTOProgramExplore,
  Scan,
  SearchStation,
  SelectBank,
  SelectDealer,
  SelectRentBuy,
  SessionDetails,
  SessionSettings,
  SettingPin,
  Splash,
  StationDetails,
  TermCondition,
  Test,
  TopUp,
  TransactionDetails,
  TransactionHistory,
  TransactionRTODetails,
  Vehicle,
  VerificationNumber,
  Voucher,
  VoucherDetails,
  WithdrawalDetails,
  WithdrawalHistory,
} from "../pages";
import { useAxiosInterceptor } from "../services/ApiClient";
import ProtectedRoute from "./ProtectedRoute";

const RoutesPage = () => {
  useAxiosInterceptor();

  return (
    <Routes>
      <Route index element={<Splash />} />
      <Route path="coming-soon" element={<ComingSoon />} />

      <Route
        path="charging/:id"
        element={<ProtectedRoute element={<ChargingNew />} />}
      />
      <Route path="search-station" element={<SearchStation />} />
      <Route path="station-details/:id" element={<StationDetails />} />
      <Route path="location-list" element={<LocationList />} />
      <Route path="login" element={<Login />} />
      <Route path="text-condition" element={<TermCondition />} />
      <Route path="privacy-police" element={<PrivacyPolice />} />
      <Route path="scan" element={<Scan />} />
      <Route
        path="session-settings/:id?/:socketId?"
        element={<SessionSettings />}
      />
      <Route
        path="payment-success/:id"
        element={<ProtectedRoute element={<PaymentSuccess />} />}
      />
      <Route
        path="session-details/:id"
        element={<ProtectedRoute element={<SessionDetails />} />}
      />
      <Route
        path="rto-details/:id"
        element={<ProtectedRoute element={<RTOBookingDetails />} />}
      />
      <Route
        path="rental-details/:id"
        element={<ProtectedRoute element={<RentalBookingDetails />} />}
      />
      <Route
        path="buy-credit"
        element={<ProtectedRoute element={<BuyCredit />} />}
      />
      <Route
        path="select-dealer"
        element={<ProtectedRoute element={<SelectDealer />} />}
      />
      <Route
        path="select-rent-buy"
        element={<ProtectedRoute element={<SelectRentBuy />} />}
      />
      <Route
        path="rent-to-buy"
        element={<ProtectedRoute element={<RentToBuy />} />}
      />
      <Route
        path="rent-to-buy-details"
        element={<ProtectedRoute element={<RentToBuyDetails />} />}
      />
      <Route
        path="rto-program-explore"
        element={<ProtectedRoute element={<RTOProgramExplore />} />}
      />
      <Route
        path="rto-program-explore/operator/:operatorId"
        element={<ProtectedRoute element={<RTOOperatorDetail />} />}
      />
      <Route
        path="rto-program-explore/bike/:bikeId"
        element={<ProtectedRoute element={<RTOMotorbikeProgram />} />}
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
        {/* <Route
          path="withdraw"
          element={<ProtectedRoute element={<Withdraw />} />}
        /> */}
        <Route path="top-up" element={<ProtectedRoute element={<TopUp />} />} />
        <Route
          path="progress-details"
          element={<ProtectedRoute element={<ProgressDetails />} />}
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
          path="transaction-rto-history/details/:id"
          element={<ProtectedRoute element={<TransactionRTODetails />} />}
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

      <Route
        path="rto-history"
        element={<ProtectedRoute element={<RTOHistory />} />}
      />

      <Route
        path="rental-history"
        element={<ProtectedRoute element={<RentalHistory />} />}
      />

      {/* BOTTOM NAVIGATION */}
      <Route path="home" element={<Main />}>
        <Route path="index" element={<Home />} />
        <Route path="location" element={<Location />} />
        <Route path="order" element={<ProtectedRoute element={<Order />} />} />
        <Route
          path="profile"
          element={<ProtectedRoute element={<ProfileNew />} />}
        />
      </Route>

      {/* HANDLE PATH NOT FOUND */}
      <Route path="test" element={<Test />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default RoutesPage;
