import { Provider } from "react-redux";
import "../styles/globals.css";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { useStore } from "../app/useStore";
import { useEffect } from "react";

const MyApp = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialState);

  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
