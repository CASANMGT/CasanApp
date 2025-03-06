import { useState } from "react";

type FormValues<T> = T;
export type FormAction<T> = "reset" | "all" | keyof T;

export const useForm = <T extends Record<string, any>>(initialValue: T) => {
  const [values, setValues] = useState<FormValues<T>>(initialValue);

  const updateForm = (formType: FormAction<T>, formParams?: any) => {
    if (formType === "reset") {
      setValues(initialValue);
    } else if (formType === "all") {
      setValues(formParams as T);
    } else {
      setValues((prevValues) => ({
        ...prevValues,
        [formType]: formParams,
      }));
    }
  };

  return [values, updateForm] as const;
};
