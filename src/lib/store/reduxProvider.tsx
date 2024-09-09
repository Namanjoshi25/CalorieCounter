"use client"
import { Provider } from "react-redux";
import { store } from "@/lib/store/store";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";


 const persister =  persistStore(store);

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <Provider store={store} >
    <PersistGate persistor={persister} loading={null}>
    {children}
    </PersistGate>
    </Provider>;
}