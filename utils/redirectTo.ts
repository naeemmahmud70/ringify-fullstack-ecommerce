"use server";

import { redirect } from "next/navigation";

export const redirectTo = (path: string) => {
  console.log("inside redirect to");
  redirect(path);
};
