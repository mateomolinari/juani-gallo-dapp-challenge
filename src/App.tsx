import { ChakraProvider } from '@chakra-ui/react';
import TopBar from './components/TopBar';
import MainUI from './components/MainUI';
import { DAppProvider } from '@usedapp/core'; 

function App() {

  return (
    <DAppProvider config={{}}>
      <ChakraProvider>
        <TopBar/>
        <MainUI/>
      </ChakraProvider>
    </DAppProvider>
  )
}

export default App
