import React from 'react';
import './App.css';
import { Switch, Route } from "react-router-dom";
import { Landing } from './components/Landing';
import { PaymentSessionProvider } from './providers/PaymentSessionProvider';
import { Payment } from './components/Payment';
import { WalletAdapterProvider } from './providers/WalletAdapterProvider';
require('@solana/wallet-adapter-react-ui/styles.css');

function App() {
  return (
    <Switch>
      <Route exact path="/error">
        <div className="flex-container">
          <h1>Some error!</h1>
        </div>
      </Route>
      <Route exact path="/success">
        <div className="flex-container">
          <h1>Payment completed successfully.</h1>
        </div>
      </Route>
      <PaymentSessionProvider>
        <Route exact path="/">
          <Landing />
        </Route>
        <Route exact path="/pay">
          <WalletAdapterProvider>
            <Payment />
          </WalletAdapterProvider>
        </Route>
      </PaymentSessionProvider>
    </Switch>
  );
}

export default App;
