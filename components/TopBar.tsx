import { Flex, Box, Button, Text } from "@chakra-ui/react";
import { useEthers, useEtherBalance, useLookupAddress } from "@usedapp/core";
import { formatEther } from "@ethersproject/units";
import TransactionHistory from "./TransactionHistory";

function TopBar() {
  const { activateBrowserWallet, account, deactivate } = useEthers();
  const ens = useLookupAddress();

  function handleConnectWallet() {
    activateBrowserWallet();
  }

  return (
    <Flex
      flexDirection="row"
      alignItems="center"
      justifyContent="end"
      h="10vh"
      bg="gray.700"
      px="3"
    >
      {account ? (
        <Flex flexDirection="row" justifyContent="space-between" w="100%">
          <TransactionHistory account={account} />
          <Box
            display="flex"
            alignItems="center"
            background="gray.600"
            borderRadius="xl"
            py="0"
            shadow="xl"
          >
            <Button
              bg="0"
              border="1px solid transparent"
              shadow="xl"
              _hover={{
                border: "1px",
                borderStyle: "solid",
                borderColor: "3",
                backgroundColor: "0",
              }}
              borderRadius="xl"
              m="1px"
              px={3}
              height="38px"
              onClick={deactivate}
            >
              <Text color="white" fontSize="md" fontWeight="medium" mr="2">
                {ens ??
                  (account &&
                    `${account.slice(0, 6)}...${account.slice(
                      account.length - 4,
                      account.length
                    )}`)}
              </Text>
            </Button>
          </Box>
        </Flex>
      ) : (
        <Button
          onClick={handleConnectWallet}
          bg="gray.600"
          color="white"
          fontSize="lg"
          fontWeight="medium"
          borderRadius="xl"
          border="1px solid transparent"
          shadow="xl"
          _hover={{
            borderColor: "white",
            color: "white",
          }}
          _active={{
            borderColor: "white",
          }}
        >
          Connect Wallet
        </Button>
      )}
    </Flex>
  );
}

export default TopBar;
