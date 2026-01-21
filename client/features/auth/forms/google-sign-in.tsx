"use state";

import Image from "next/image";
import { BukkaButton } from "@/components/ui";
import { useState } from "react";
import { envConfig } from "@/configs";

export function GoogleSignIn() {
  const [redirecting, setRedirecting] = useState(false);

  const loginWithGoogle = () => {
    setRedirecting(true);
    window.location.href = `${envConfig.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google`;
  };

  return (
    <div className="space-y-2">
      <BukkaButton
        variant="outline"
        size="lg"
        className="w-full"
        onClick={loginWithGoogle}
      >
        <Image
          src="/icons/custom/google.svg"
          alt="Google icon"
          width={24}
          height={24}
          className={`${redirecting && "animate-pulse"}`}
        />
        {redirecting ? "Processing..." : " Continue with Google"}
      </BukkaButton>
    </div>
  );
}
