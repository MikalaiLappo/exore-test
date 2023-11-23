import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Router } from './Router';
import { theme } from './theme';
import { persistor, store } from '../store';

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<>Loading</>} persistor={persistor}>
        <MantineProvider theme={theme}>
          <Router />
        </MantineProvider>
      </PersistGate>
    </Provider>
  );
}
