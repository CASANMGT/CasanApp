export interface SessionSettingProps {
  data: SessionProps | null;
  loading: boolean;
  error: string | null;
}

export interface SessionProps {
  header: SessionHeaderProps;
  signalValue: number;
  temperature: number;
  totalPortCount: number;
  portStatus: number[];
}

export interface SessionHeaderProps {
  length: number;
  seq: number;
  encrypted: boolean;
  frameId: string;
}

export type FormSession = {
  voltage:string|number
  ampere: string|number;
};
