import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex items-center min-h-[calc(100vh-120px)] justify-center w-full">
      <SignIn
        appearance={{
          variables: {
            colorPrimary: "#000",
          },
          layout: { socialButtonsVariant: "blockButton" },
        }}
      />
    </div>
  );
}
