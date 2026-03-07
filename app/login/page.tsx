import "./login.css";
import JournalLayout from "@/components/login/JournalLayout";
import JournalBrandPage from "@/components/login/JournalBrandPage";
import JournalLoginForm from "@/components/login/JournalLoginForm";

export default function LoginPage() {
  return (
    <JournalLayout
      leftPage={<JournalBrandPage />}
      rightPage={<JournalLoginForm />}
    />
  );
}
