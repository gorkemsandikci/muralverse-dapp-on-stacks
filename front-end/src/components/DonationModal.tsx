import { useExistingDonation, useCampaignInfo } from "@/hooks/campaignQueries";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  NumberInput,
  NumberInputField,
  useToast,
  HStack,
  VStack,
  RadioGroup,
  Radio,
  ModalFooter,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useContext } from "react";
import HiroWalletContext from "./HiroWalletProvider";
import {
  executeContractCall,
  isDevnetEnvironment,
  isTestnetEnvironment,
  openContractCall,
} from "@/lib/contract-utils";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import { ConnectWalletButton } from "./ConnectWallet";
import { DevnetWalletButton } from "./DevnetWalletButton";
import { getContributeSbtcTx, getContributeStxTx } from "@/lib/campaign-utils";
import { getStacksNetworkString } from "@/lib/stacks-api";
import {
  btcToSats,
  satsToSbtc,
  stxToUstx,
  usdToSbtc,
  usdToStx,
  useCurrentPrices,
  ustxToStx,
} from "@/lib/currency-utils";

export default function DonationModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const { mainnetAddress, testnetAddress } = useContext(HiroWalletContext);
  const {
    currentWallet: devnetWallet,
    wallets: devnetWallets,
    setCurrentWallet: setDevnetWallet,
  } = useDevnetWallet();
  const currentWalletAddress = isDevnetEnvironment()
    ? devnetWallet?.stxAddress
    : isTestnetEnvironment()
    ? testnetAddress
    : mainnetAddress;

  const { data: previousDonation } = useExistingDonation(currentWalletAddress);
  const { data: prices } = useCurrentPrices();
  const { data: campaignInfo } = useCampaignInfo(prices);

  const hasMadePreviousDonation =
    previousDonation &&
    (previousDonation?.stxAmount > 0 || previousDonation?.sbtcAmount > 0);

  const [isLoading, setIsLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stx");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const toast = useToast();

  const presetAmounts = [10, 25, 50, 100];

  const handlePresetClick = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(null);
  };

  const handleSubmit = async () => {
    setIsLoading(true);

    const amount = selectedAmount || Number(customAmount);

    if (!amount || amount <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter a valid amount greater than 0",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    if (!campaignInfo?.isInitialized) {
      toast({
        title: "Campaign Not Ready",
        description: "This campaign has not been initialized yet. Please wait for the campaign owner to start the campaign.",
        status: "error",
        duration: 8000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      if (paymentMethod === "stx") {
        const stxAmount = usdToStx(amount, prices?.stx || 0);
        const ustxAmount = stxToUstx(stxAmount);

        if (isDevnetEnvironment()) {
          const txOptions = getContributeStxTx(
            getStacksNetworkString(),
            { address: currentWalletAddress || "", amount: Math.floor(Number(ustxAmount)) }
          );
          await executeContractCall(
            txOptions,
            devnetWallet
          );
        } else {
          const txOptions = getContributeStxTx(
            getStacksNetworkString(),
            { address: currentWalletAddress || "", amount: Math.floor(Number(ustxAmount)) }
          );
          await openContractCall(txOptions);
        }
      } else {
        const sbtcAmount = usdToSbtc(amount, prices?.sbtc || 0);
        const satsAmount = btcToSats(sbtcAmount);

                  if (isDevnetEnvironment()) {
            const txOptions = getContributeSbtcTx(
              getStacksNetworkString(),
              { address: currentWalletAddress || "", amount: Math.floor(satsAmount) }
            );
            await executeContractCall(
              txOptions,
              devnetWallet
            );
          } else {
          const txOptions = getContributeSbtcTx(
            getStacksNetworkString(),
            { address: currentWalletAddress || "", amount: Math.floor(satsAmount) }
            );
          await openContractCall(txOptions);
        }
      }

      toast({
        title: "Contribution submitted",
        description: "Your contribution has been submitted to the blockchain",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
    } catch (error) {
      console.error("Contribution error:", error);
      
      // Provide more specific error messages
      let errorMessage = "There was an error processing your contribution";
      
      if (error instanceof Error) {
        if (error.message.includes('err u102')) {
          errorMessage = "Campaign not initialized yet. Please wait for the campaign to be started.";
        } else if (error.message.includes('broadcasting')) {
          errorMessage = "Transaction failed to broadcast. Please check your wallet connection.";
        } else if (error.message.includes('cancelled')) {
          errorMessage = "Transaction was cancelled.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Contribution failed",
        description: errorMessage,
        status: "error",
        duration: 8000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay 
        bg="rgba(0, 0, 0, 0.8)"
        backdropFilter="blur(20px)"
      />
      <ModalContent 
        bg="rgba(26, 32, 44, 0.85)"
        border="2px solid"
        borderColor="rgba(0, 212, 255, 0.3)"
        borderRadius="2xl"
        backdropFilter="blur(25px)"
        boxShadow="0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 212, 255, 0.2)"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, rgba(255, 107, 53, 0.1) 50%, rgba(57, 255, 20, 0.1) 100%), url('/images/hero-overlay-pattern.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.15,
          borderRadius: "inherit",
          zIndex: 0,
        }}
      >
        {/* Decorative Elements */}
        <Box
          position="absolute"
          top="-50px"
          right="-50px"
          w="100px"
          h="100px"
          bg="rgba(0, 212, 255, 0.2)"
          borderRadius="full"
          filter="blur(20px)"
          zIndex={1}
        />
        <Box
          position="absolute"
          bottom="-30px"
          left="-30px"
          w="60px"
          h="60px"
          bg="rgba(255, 107, 53, 0.2)"
          borderRadius="full"
          filter="blur(15px)"
          zIndex={1}
        />
        
        <ModalHeader 
          color="white" 
          textAlign="center" 
          bg="rgba(26, 32, 44, 0.9)"
          borderBottom="1px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          backdropFilter="blur(10px)"
          position="relative"
          zIndex={2}
          py={6}
        >
          <VStack spacing={2}>
            <Text fontSize="3xl" textShadow="0 0 20px rgba(0, 212, 255, 0.8)">
              🎨
            </Text>
            <Text fontSize="2xl" fontWeight="bold">
              Make a Contribution
            </Text>
            <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
              Support Muralverse: Urban Canvas Community Street Art Revival
            </Text>
          </VStack>
        </ModalHeader>
        
        <ModalCloseButton 
          color="white"
          bg="rgba(0, 0, 0, 0.3)"
          border="1px solid"
          borderColor="rgba(255, 255, 255, 0.2)"
          borderRadius="full"
          w="40px"
          h="40px"
          _hover={{
            bg: "rgba(0, 212, 255, 0.3)",
            borderColor: "rgba(0, 212, 255, 0.8)",
            transform: "scale(1.1)",
          }}
          transition="all 0.3s"
          position="relative"
          zIndex={3}
        />
        
        <ModalBody pb="8" position="relative" zIndex={2}>
          <Flex direction="column" gap={6}>
            {!currentWalletAddress ? (
              <VStack spacing={6}>
                <Box
                  p={8}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(10px)"
                  textAlign="center"
                  w="full"
                >
                  <Text fontSize="lg" color="white" mb={4}>
                    Connect your wallet to contribute to the Urban Canvas campaign
                  </Text>
                  <HStack spacing={4} justify="center">
                    <ConnectWalletButton />
                    <DevnetWalletButton
                      wallets={devnetWallets}
                      currentWallet={devnetWallet}
                      onWalletSelect={setDevnetWallet}
                    />
                  </HStack>
                </Box>
              </VStack>
            ) : (
              <>
                {!campaignInfo?.isInitialized ? (
                  <Alert 
                    bg="rgba(255, 107, 53, 0.1)"
                    borderColor="rgba(255, 107, 53, 0.3)"
                    border="1px solid"
                    borderRadius="xl"
                    backdropFilter="blur(10px)"
                  >
                    <Box>
                      <AlertTitle color="white" fontSize="lg">
                        ⚠️ Campaign Not Ready
                      </AlertTitle>
                      <AlertDescription color="rgba(255, 255, 255, 0.8)" mt={2}>
                        This campaign has not been initialized yet. Please wait for the campaign owner to start the campaign before making donations.
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : hasMadePreviousDonation ? (
                  <Alert 
                    bg="rgba(0, 212, 255, 0.1)"
                    borderColor="rgba(0, 212, 255, 0.3)"
                    border="1px solid"
                    borderRadius="xl"
                    backdropFilter="blur(10px)"
                  >
                    <Box>
                      <AlertTitle color="white" fontSize="lg">
                        🎉 You have already contributed to this campaign!
                      </AlertTitle>
                      <AlertDescription color="rgba(255, 255, 255, 0.8)" mt={2}>
                        <VStack align="start" spacing={1}>
                          <Text>
                            <strong>STX:</strong>{" "}
                            {Number(
                              ustxToStx(previousDonation?.stxAmount)
                            ).toFixed(2)}
                          </Text>
                          <Text>
                            <strong>sBTC:</strong>{" "}
                            {satsToSbtc(previousDonation?.sbtcAmount).toFixed(8)}
                          </Text>
                        </VStack>
                      </AlertDescription>
                    </Box>
                  </Alert>
                ) : null}
                
                <Box 
                  p={8}
                  bg="rgba(255, 255, 255, 0.05)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(10px)"
                  position="relative"
                  overflow="hidden"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: "url('/images/hero-overlay-pattern.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    opacity: 0.08,
                    zIndex: 0,
                  }}
                >
                  {/* Inner decorative elements */}
                  <Box
                    position="absolute"
                    top="10px"
                    right="10px"
                    w="20px"
                    h="20px"
                    bg="rgba(57, 255, 20, 0.3)"
                    borderRadius="full"
                    filter="blur(5px)"
                    zIndex={2}
                  />
                  <Box
                    position="absolute"
                    bottom="10px"
                    left="10px"
                    w="15px"
                    h="15px"
                    bg="rgba(255, 107, 53, 0.3)"
                    borderRadius="full"
                    filter="blur(3px)"
                    zIndex={2}
                  />
                  
                  <VStack spacing={6} align="stretch" position="relative" zIndex={1}>
                    <Box textAlign="center" mb={2}>
                      <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>
                        💳 Choose Payment Method
                      </Text>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                        Select your preferred cryptocurrency
                      </Text>
                    </Box>

                    <RadioGroup
                      value={paymentMethod}
                      onChange={setPaymentMethod}
                    >
                      <HStack spacing={6} justify="center">
                        <Radio 
                          value="stx" 
                          id="stx" 
                          colorScheme="blue"
                          size="lg"
                        >
                          <Box
                            p={3}
                            bg={paymentMethod === "stx" ? "rgba(0, 212, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={paymentMethod === "stx" ? "rgba(0, 212, 255, 0.5)" : "rgba(255, 255, 255, 0.1)"}
                            transition="all 0.3s"
                            _hover={{
                              bg: "rgba(0, 212, 255, 0.1)",
                              borderColor: "rgba(0, 212, 255, 0.3)",
                            }}
                          >
                            <Text color="white" fontWeight="bold">STX</Text>
                            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">Stacks Token</Text>
                          </Box>
                        </Radio>
                        <Radio 
                          value="sbtc" 
                          id="sbtc" 
                          colorScheme="blue"
                          size="lg"
                        >
                          <Box
                            p={3}
                            bg={paymentMethod === "sbtc" ? "rgba(0, 212, 255, 0.2)" : "rgba(255, 255, 255, 0.05)"}
                            borderRadius="lg"
                            border="1px solid"
                            borderColor={paymentMethod === "sbtc" ? "rgba(0, 212, 255, 0.5)" : "rgba(255, 255, 255, 0.1)"}
                            transition="all 0.3s"
                            _hover={{
                              bg: "rgba(0, 212, 255, 0.1)",
                              borderColor: "rgba(0, 212, 255, 0.3)",
                            }}
                          >
                            <Text color="white" fontWeight="bold">sBTC</Text>
                            <Text fontSize="xs" color="rgba(255, 255, 255, 0.6)">Bitcoin on Stacks</Text>
                          </Box>
                        </Radio>
                      </HStack>
                    </RadioGroup>

                    <Box textAlign="center" mt={4}>
                      <Text fontSize="xl" fontWeight="bold" color="white" mb={2}>
                        💰 Choose Contribution Amount
                      </Text>
                      <Text fontSize="sm" color="rgba(255, 255, 255, 0.6)">
                        Select a preset amount or enter custom value
                      </Text>
                    </Box>

                    <HStack spacing={3} justify="center" wrap="wrap">
                      {presetAmounts.map((amount) => (
                        <Button
                          key={amount}
                          size="lg"
                          variant="ghost"
                          onClick={() => handlePresetClick(amount)}
                          bg={selectedAmount === amount ? "rgba(0, 212, 255, 0.3)" : "rgba(255, 255, 255, 0.05)"}
                          color={selectedAmount === amount ? "white" : "rgba(255, 255, 255, 0.8)"}
                          border="1px solid"
                          borderColor={selectedAmount === amount ? "rgba(0, 212, 255, 0.8)" : "rgba(255, 255, 255, 0.1)"}
                          borderRadius="xl"
                          backdropFilter="blur(10px)"
                          _hover={{
                            bg: selectedAmount === amount ? "rgba(0, 212, 255, 0.4)" : "rgba(255, 255, 255, 0.1)",
                            borderColor: selectedAmount === amount ? "rgba(0, 212, 255, 1)" : "rgba(255, 255, 255, 0.2)",
                            transform: "translateY(-2px)",
                            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
                          }}
                          transition="all 0.3s"
                          fontWeight="bold"
                          fontSize="lg"
                        >
                          ${amount}
                        </Button>
                      ))}
                    </HStack>

                    <Box textAlign="center">
                      <Text fontSize="md" color="rgba(255, 255, 255, 0.7)" mb={3}>
                        Or enter custom amount:
                      </Text>
                      <NumberInput
                        min={1}
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                        size="lg"
                      >
                        <NumberInputField
                          placeholder="Enter amount"
                          textAlign="center"
                          fontSize="lg"
                          bg="rgba(255, 255, 255, 0.05)"
                          border="1px solid"
                          borderColor="rgba(255, 255, 255, 0.1)"
                          color="white"
                          borderRadius="xl"
                          h="60px"
                          _placeholder={{ color: "rgba(255, 255, 255, 0.4)" }}
                          _focus={{ 
                            borderColor: "rgba(0, 212, 255, 0.8)",
                            boxShadow: "0 0 20px rgba(0, 212, 255, 0.3)",
                            bg: "rgba(255, 255, 255, 0.08)",
                          }}
                          _hover={{
                            borderColor: "rgba(255, 255, 255, 0.2)",
                            bg: "rgba(255, 255, 255, 0.08)",
                          }}
                          transition="all 0.3s"
                        />
                      </NumberInput>
                    </Box>

                    <Flex direction="column" gap={3} mt={4}>
                      <Button
                        variant="ghost"
                        size="lg"
                        onClick={handleSubmit}
                        isDisabled={
                          (!selectedAmount && !customAmount) || isLoading || !campaignInfo?.isInitialized
                        }
                        isLoading={isLoading}
                        fontSize="lg"
                        bg="linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(255, 107, 53, 0.3) 100%)"
                        color="white"
                        border="1px solid"
                        borderColor="rgba(0, 212, 255, 0.5)"
                        borderRadius="xl"
                        h="60px"
                        backdropFilter="blur(10px)"
                        _hover={{
                          bg: "linear-gradient(135deg, rgba(0, 212, 255, 0.5) 0%, rgba(255, 107, 53, 0.5) 100%)",
                          borderColor: "rgba(0, 212, 255, 0.8)",
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 35px rgba(0, 212, 255, 0.4)",
                        }}
                        _active={{
                          transform: "translateY(-1px)",
                        }}
                        transition="all 0.3s"
                        fontWeight="bold"
                        textShadow="0 1px 2px rgba(0, 0, 0, 0.5)"
                      >
                        {!campaignInfo?.isInitialized 
                          ? "⏳ Campaign Not Ready" 
                          : `🎨 Donate $${selectedAmount || customAmount || "0"}`
                        }
                      </Button>
                      
                      <Box 
                        textAlign="center" 
                        fontSize="sm" 
                        fontWeight="bold" 
                        color="rgba(255, 255, 255, 0.6)"
                        p={3}
                        bg="rgba(0, 0, 0, 0.2)"
                        borderRadius="lg"
                        border="1px solid"
                        borderColor="rgba(255, 255, 255, 0.1)"
                      >
                        ≈ {paymentMethod === "stx"
                          ? `${usdToStx(
                              Number(selectedAmount || customAmount || "0"),
                              prices?.stx || 0
                            ).toFixed(2)} STX`
                          : `${usdToSbtc(
                              Number(selectedAmount || customAmount || "0"),
                              prices?.sbtc || 0
                            ).toFixed(8)} sBTC`}
                      </Box>
                    </Flex>
                  </VStack>
                </Box>
              </>
            )}
          </Flex>
        </ModalBody>
        
        <ModalFooter 
          bg="rgba(26, 32, 44, 0.9)"
          borderTop="1px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          backdropFilter="blur(10px)"
          position="relative"
          zIndex={2}
          py={4}
        >
          <Button 
            onClick={onClose} 
            variant="ghost"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.2)"
            color="rgba(255, 255, 255, 0.8)"
            bg="rgba(255, 255, 255, 0.05)"
            borderRadius="xl"
            backdropFilter="blur(10px)"
            _hover={{ 
              bg: "rgba(255, 255, 255, 0.1)",
              borderColor: "rgba(255, 255, 255, 0.4)",
              color: "white",
            }}
            transition="all 0.3s"
          >
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
