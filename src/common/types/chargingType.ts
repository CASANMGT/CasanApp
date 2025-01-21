export interface initialStateFormChargingProps {
  formData: {
    deviceId: string;
    price: number;
    port: number;
  } | null;
  data: any;
  [key: string]: any;
}

export interface chargingStartBodyProps {
  deviceID: string;
  port: number;
  orderNumber: string;
  value: number;
}

export interface chargingStopBodyProps {
  deviceID: string;
  port: number;
  orderNumber: string;
}

export interface portReportBodyProps {
  deviceID: string;
  port: number;
}

export interface chargingStartProps {
  data: string | null;
  loading: boolean;
  error: string | null;
}

export interface chargingSessionProps {
  data: chargingSessionResponseProps | null;
  loading: boolean;
  error: string | null;
}

export interface chargingSessionResponseProps {
  DeviceID: string;
  Port: number;
  StartTime: string;
  StopTime: string;
  ExpectedStopTime: any;
  MaxWatt: number;
  Value: number;
  DurationInSecond: number;
  ChargeAmount: number;
  RefundAmount: number;
}
