"use server";

export async function loginWithEmail(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  // TODO: Supabase Auth 연동
  console.log("loginWithEmail", { email });
}

export async function loginWithGoogle() {
  // TODO: Supabase Auth Google OAuth 연동
  console.log("loginWithGoogle");
}
