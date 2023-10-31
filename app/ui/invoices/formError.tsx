import { State, StateFormError } from "@/app/lib/actions";
import { ComponentProps } from "react";

interface FormError extends ComponentProps<"div"> {
  state: State;
  field: keyof StateFormError;
}

function FormError({ state, field, ...props }: FormError) {
  if (!state.errors || !state.errors[field]) return null;
  return (
    <div
      id='customer-error'
      aria-live='polite'
      className='mt-2 text-sm text-red-500'
    >
      {state.errors[field] &&
        state.errors[field]!.map((error: string) => <p key={error}>{error}</p>)}
    </div>
  );
}

export default FormError;
