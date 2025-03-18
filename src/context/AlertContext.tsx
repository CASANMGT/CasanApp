import { createContext, useContext, useState, ReactNode } from "react";

export type AlertType = "success" | "error" | "info" | "warning";
interface messageProps {
  title: string;
  body: string;
}

interface AlertContextType {
  showAlert: (message: messageProps, type?: AlertType, duration?: number) => void;
  hideAlert: () => void;
  alert: { message: messageProps; type: AlertType } | null;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<{
    message: messageProps;
    type: AlertType;
  } | null>(null);

  const showAlert = (
    message: messageProps,
    type: AlertType = "info",
    duration: number = 3000
  ) => {
    setAlert({ message, type });

    setTimeout(() => {
      setAlert(null);
    }, duration);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alert }}>
      {children}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};
