// context/TurnkeyAppContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { useTurnkey } from "@turnkey/sdk-react";
import { Session } from "@turnkey/sdk-types"; 

type TurnkeyAppContextType = {
  session: Session | null;
  wallets: any[] | null;
  loading: boolean;
  refresh: () => Promise<void>;
};

const TurnkeyAppContext = createContext<TurnkeyAppContextType>({
  session: null,
  wallets: null,
  loading: true,
  refresh: async () => {},
});

export const TurnkeyAppProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { turnkey, indexedDbClient } = useTurnkey();
  const [session, setSession] = useState<Session | null>(null);
  const [wallets, setWallets] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSessionAndWallets = async () => {
    try {
      setLoading(true);

      const currentSession = await turnkey?.getSession();
      setSession(currentSession ?? null);

      if (currentSession && indexedDbClient) {
        const result = await indexedDbClient.getWallets({
          organizationId: currentSession.organizationId,
        });
        setWallets(result?.wallets ?? []);
      } else {
        setWallets(null);
      }
    } catch (error) {
      console.error("Error fetching session/wallets:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessionAndWallets();
  }, []);

  return (
    <TurnkeyAppContext.Provider
      value={{ session, wallets, loading, refresh: fetchSessionAndWallets }}
    >
      {children}
    </TurnkeyAppContext.Provider>
  );
};

export const useAppTurnkey = () => useContext(TurnkeyAppContext);
