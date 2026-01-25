"use state";

import Image from "next/image";
import { BukkaButton } from "@/components/ui";
import { useState } from "react";
import { envConfig, STORE_KEYS } from "@/configs";
import { ClientTypeEnum } from "@/enums/ClientTypeEnum";
import { OAuthHelper } from "@/helpers";
import { StorageUtilsHelper } from "@/utils";

export function GoogleSignIn() {
  const [redirecting, setRedirecting] = useState(false);

  const loginWithGoogle = (
    clientType: ClientTypeEnum,
    redirectPath?: string,
    forceConsent = false,
  ) => {
    setRedirecting(true);

    const codeVerifier = OAuthHelper.generateCodeVerifier();
    const codeChallenge = OAuthHelper.generateCodeChallenge(codeVerifier);

    // Save PKCE codeVerifier: localStorage for web, secure storage for mobile
    StorageUtilsHelper.saveToLocalStorage([
      STORE_KEYS.OAUTH_CODE_VERIFIER,
      codeVerifier,
    ]);

    const state = OAuthHelper.encodeState({
      client: clientType,
      redirectPath: redirectPath ?? "/Oauth/bootstrap",
    });

    const prompt = forceConsent ? "consent" : "select_account";

    const oauthUrl =
      `${envConfig.NEXT_PUBLIC_API_BASE_URL}/api/v1/auth/google` +
      `?state=${encodeURIComponent(state)}` +
      `&code_challenge=${encodeURIComponent(codeChallenge)}` +
      `&code_challenge_method=S256` +
      `&prompt=${prompt}`;

    window.location.href = oauthUrl;
  };

  return (
    <div className="space-y-2">
      <BukkaButton
        variant="outline"
        size="lg"
        className="w-full"
        onClick={() => loginWithGoogle(ClientTypeEnum.WEB)}
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
