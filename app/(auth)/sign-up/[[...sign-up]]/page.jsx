import AuthForm from "../../_components/AuthForm";

export default function Page() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
      <AuthForm mode="sign-up" />
    </div>
  );
}