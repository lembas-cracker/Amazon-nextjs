import { Provider } from "react-redux";
import createStore from "../app/store";
import "../styles/globals.css";
import { SessionProvider as AuthProvider } from "next-auth/react";
import { useStore } from "../app/useStore";

const MyApp = ({ Component, pageProps }) => {
  const store = useStore(pageProps.initialState);
  {
    /*const { initialState, ...restPageProps } = pageProps;

  const store = createStore(initialState);*/
  }

  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
