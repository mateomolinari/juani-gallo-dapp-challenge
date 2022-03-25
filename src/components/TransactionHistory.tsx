import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalCloseButton,
    Button,
    useDisclosure,
    UnorderedList,
    ListItem,
    Box, 
    Link,
    Text
  } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useEffect, useState } from 'react'

type Props = {
    account?: string
  };

function TransactionHistory({ account }: Props) {

    const { isOpen, onOpen, onClose } = useDisclosure()
    const [ transactionHistory, setTransactionHistory ] = useState<object[]>([]);

    const provider = new ethers.providers.EtherscanProvider('kovan');
    
    useEffect(() => {
        const getTransactionHistory = async () => {
            if (account) {
                let history = await provider.getHistory(account);
                setTransactionHistory(history)
                console.log(history)    
            }
        }
        getTransactionHistory()
    }, [])


    return (
        <>
        <Button 
        onClick={onOpen} 
        mr={3} borderRadius={10} 
        shadow="xl"
        border="1px solid transparent"
        _hover={{
            borderColor: "white",
            color: "white",
          }}>Transactions</Button>

        <Modal isOpen={isOpen} onClose={onClose} size="xl">
            <ModalOverlay />
            <ModalContent>
            <ModalHeader>Transactions</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
                {transactionHistory.length !== 0 ? <UnorderedList styleType="none" mb={5}>
                    {transactionHistory.map(i => (
                        <ListItem>
                            <Box w="100%" textAlign="center">
                                {i.from.slice(0,6) + '...' + i.from.slice(38,42)} => {i.to.slice(0,6) + '...' + i.to.slice(38,42)} with value {ethers.utils.formatEther(i.value._hex)}
                                <Link href= {`https://kovan.etherscan.io/tx/${i.hash}`} isExternal style={{ textDecoration: 'none' }}>
                                    <Button ml={5} h="100%">
                                        Tx Hash
                                    </Button>
                                </Link>
                            </Box>
                        </ListItem>
                    ))}

                </UnorderedList> : <Text fontSize="2xl" textAlign="center" mb={3}>No transactions for this account</Text>}
            </ModalBody>
            </ModalContent>
        </Modal>
        </>
    )
}

export default TransactionHistory;