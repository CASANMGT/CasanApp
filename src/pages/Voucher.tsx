import React from "react";
import { Header, LoadingPage } from "../components";
import { useNavigate } from "react-router-dom";

const Voucher = () => {
  const navigate = useNavigate();

  const onDismiss = () => {
    navigate(-1);
  };

  return (
    <div className="container-screen !bg-white overflow-hidden flex flex-col">
      <Header title="Voucher Saya" onDismiss={onDismiss} />

      <LoadingPage loading={false}>Coming Soon</LoadingPage>
    </div>
  );
};

export default Voucher;
