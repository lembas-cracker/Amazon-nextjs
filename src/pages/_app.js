import { Provider } from "react-redux";
import createStore from "../app/store";
import "../styles/globals.css";
import { SessionProvider as AuthProvider } from "next-auth/react";

const MyApp = ({ Component, pageProps }) => {
  const { initialState, ...restPageProps } = pageProps;

  const store = createStore(initialState);

  return (
    <AuthProvider session={pageProps.session}>
      <Provider store={store}>
        <Component {...restPageProps} />
      </Provider>
    </AuthProvider>
  );
};

export default MyApp;
