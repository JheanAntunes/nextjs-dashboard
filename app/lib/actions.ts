"use server";

import { signIn } from "@/auth";
import { sql } from "@vercel/postgres";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if ((error as Error).message.includes("CredentialsSignin")) {
      return "CredentialSignin";
    }
    throw error;
  }
}

const InvoiceSchema = z.object({
  id: z.string(),
  customerId: z.string({
    invalid_type_error: "Please select a customer.",
  }),
  amount: z.coerce
    .number()
    .gt(0, { message: "Please enter an amount greater than $0." }),
  status: z.enum(["pending", "paid"], {
    invalid_type_error: "Please select an invoice status.",
  }),
  date: z.string(),
});

const CreateInvoice = InvoiceSchema.omit({ id: true, date: true });

export type StateFormError = {
  customerId?: string[];
  amount?: string[];
  status?: string[];
  id?: string[];
};
export type State = {
  errors?: StateFormError;
  message?: string | null;
};

export async function createInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = CreateInvoice.safeParse({
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Invoice.",
    };
  }

  // Prepare data for insertion into the database
  const { customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;
  const date = new Date().toISOString().split("T")[0];

  // Insert data into the database
  try {
    await sql`
      INSERT INTO invoices (customer_id, amount, status, date)
      VALUES (${customerId}, ${amountInCents}, ${status}, ${date})
    `;
  } catch (error) {
    // If a database error occurs, return a more specific error.
    return {
      message: "Database Error: Failed to Create Invoice.",
    };
  }

  // Revalidate the cache for the invoices page and redirect the user.
  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}
// Use Zod to update the expected types
const UpdateInvoice = InvoiceSchema.omit({ date: true });

// ...

export async function updateInvoice(prevState: State, formData: FormData) {
  // Validate form using Zod
  const validatedFields = UpdateInvoice.safeParse({
    id: formData.get("id"),
    customerId: formData.get("customerId"),
    amount: formData.get("amount"),
    status: formData.get("status"),
  });

  // If form validation fails, return errors early. Otherwise, continue.
  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Invoice.",
    };
  }
  // Prepare data for insertion into the database
  const { id, customerId, amount, status } = validatedFields.data;
  const amountInCents = amount * 100;

  try {
    await sql`
       UPDATE invoices
       SET customer_id = ${customerId}, amount = ${amountInCents}, status = ${status}
       WHERE id = ${id}
     `;
  } catch (error) {
    return { message: "Database Error: Failed to Update Invoice." };
  }

  revalidatePath("/dashboard/invoices");
  redirect("/dashboard/invoices");
}

const DeleteInvoice = InvoiceSchema.pick({ id: true });

// ...

export async function deleteInvoice(formData: FormData) {
  //example error
  // throw new Error("Failed to Delete Invoice");
  try {
    const id = formData.get("id")?.toString();
    await sql`DELETE FROM invoices WHERE id = ${id}`;
    revalidatePath("/dashboard/invoices");
  } catch (error) {
    console.log(error);
    return { message: "Database Error: Failed to Delete Invoice." };
  }
}
