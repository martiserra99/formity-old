import { useContext } from "react";

import FormsifyFormContext from "../context/formsify-form-context";

function useFormsifyForm() {
  const context = useContext(FormsifyFormContext);
  if (!context) {
    throw new Error("useFormsifyForm must be used within a FormsifyForm");
  }
  return context;
}

export default useFormsifyForm;
