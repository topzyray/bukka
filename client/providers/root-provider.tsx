import {
  AuthProvider,
  AuthSyncProvider,
  GlobalStateProvider,
  ReactQueryProvider,
  ThemeProvider,
  UserLocationProvider,
} from "@/providers";
import { Toaster } from "@/components/ui/sonner";
import { SessionExpirationModal } from "@/events/session-event-listener";

export function RootProvider({ children }: { children: React.ReactNode }) {
  return (
    <ReactQueryProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        {/* <AuthSyncProvider /> */}
        <SessionExpirationModal />
        <UserLocationProvider>
          {/* <LocationConsent /> */}
          <AuthProvider>
            <GlobalStateProvider>
              {children}
              <Toaster richColors position="top-center" closeButton />
            </GlobalStateProvider>
          </AuthProvider>
        </UserLocationProvider>
      </ThemeProvider>
    </ReactQueryProvider>
  );
}
