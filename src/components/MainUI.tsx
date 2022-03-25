import { Flex, Text, Input, Button, Spinner } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { useState, useEffect } from 'react'
import ABI from '../compoundABI.json'
import ERC20ABI from '../ERC20.json'
import { useEthers } from '@usedapp/core'
import TransactionHistory from './TransactionHistory'


function MainUI() {

    const compoundAddress = '0xF0d0EB522cfa50B716B3b1604C4F0fA6f04376AD'
    const [ userBalance, setUserBalance] = useState<ethers.BigNumber>()
    const [ network, setNetwork ] = useState('')
    const [ DAIallowed, setDAIAllowed ] = useState(false)
    const [ mining, startTransaction ] = useState(false)
    const [ tokenAmount, setTokenAmount ] = useState('')
    const handleInputChange = (event: any) => setTokenAmount(event.target.value)

    const { account } = useEthers()
    const provider = new ethers.providers.Web3Provider((window as any).ethereum)
    const signer = provider.getSigner()
    const CErc20Delegator = new ethers.Contract(compoundAddress, ABI, signer)
    const DAIcontract = new ethers.Contract('0x4f96fe3b7a6cf9725f59d353f723c1bdb64ca6aa', ERC20ABI, signer)

    useEffect(() => {
        const fetchUserBalance = async () => {
            let balance = await CErc20Delegator.balanceOf(account)
            setUserBalance(balance)
        }
        fetchUserBalance()
        const getNetwork = async () => {
            let connectedto = await provider.getNetwork()
            setNetwork(connectedto.name)
        }
        getNetwork()
        const checkAllowance = async () => {
            let daiAllowance = await DAIcontract.allowance(account, compoundAddress)
            if (daiAllowance.toString() !== '0') { setDAIAllowed(true) }
        }
        checkAllowance()
    })

    const approveDAI = async () => {
        let tx = await DAIcontract.approve(compoundAddress, ethers.constants.MaxUint256)
        startTransaction(true)
        await tx.wait()
        startTransaction(false)
    }

    const mintcDAI = async () => {
        let tx = await CErc20Delegator.mint(ethers.utils.parseUnits(tokenAmount, 18))
        startTransaction(true)
        await tx.wait()
        startTransaction(false)
        setTokenAmount('')
    }

    if (network !== 'kovan') {
        return(
            <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            h="90vh"
            bg="gray.700">
                <Text fontSize="4xl" color="white">Change network to Kovan</Text>
            </Flex>
        )
    } else if (!account) {
        return(
            <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            h="90vh"
            shadow="xl"
            bg="gray.700">
                <Flex
                h="50vh"
                w="70vh"
                bg="gray.800"
                borderRadius={10}
                flexDirection="column"
                justifyContent="space-around"
                alignItems="center">
                    <Text fontSize="2xl" color="white">Please connect your wallet</Text>
                </Flex>
            </Flex>
        )
    } else {
        return(
            <Flex
            flexDirection="row"
            alignItems="center"
            justifyContent="center"
            h="90vh"
            bg="gray.700"
            px="3">
                {!mining ? 
                    <Flex
                    h="50vh"
                    w="70vh"
                    bg="gray.800"
                    shadow="dark-lg"
                    borderRadius={10}
                    flexDirection="column"
                    justifyContent="space-around"
                    alignItems="center">
                        <Text fontSize="3xl" color="white"> Supply DAI to Compound </Text>
                        <Text fontSize="xl" color="white">
                            cDAI Balance: {userBalance ? parseFloat(ethers.utils.formatUnits(userBalance, 8)).toFixed(2) : '0'}
                        </Text>
                        <Input 
                        type="number" 
                        w="50%" 
                        onChange={handleInputChange} 
                        isDisabled={!DAIallowed}
                        textAlign="center"
                        fontSize="xl"/>
                        {DAIallowed ? 
                            <Flex flexDirection="column" alignItems="center">
                                <Button 
                                w="200%" 
                                border="1px solid transparent"
                                _hover={{
                                    borderColor: "white",
                                    color: "white",
                                }}
                                onClick={() => mintcDAI()} 
                                isDisabled={tokenAmount === '' || parseInt(tokenAmount) === 0}>
                                    Mint cDAI
                                </Button>
                            </Flex>
                        :
                            <Flex flexDirection="column">
                                <Button 
                                w="100%"
                                border="1px solid transparent"
                                _hover={{
                                    borderColor: "white",
                                    color: "white",
                                }}
                                onClick={() => approveDAI()}>
                                    Approve DAI
                                </Button>
                            </Flex>
                        }
                    </Flex>
                :
                    <Flex
                    h="50vh"
                    w="70vh"
                    bg="gray.800"
                    borderRadius={10}
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center">
                        <Spinner mb={5}/>
                        <Text fontSize="3xl" color="white"> Mining transaction </Text>
                    </Flex>
                }
            </Flex>
        )
    }

}

export default MainUI