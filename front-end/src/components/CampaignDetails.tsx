"use client";
import {
  Container,
  Box,
  IconButton,
  Image,
  Text,
  Flex,
  Heading,
  Progress,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  Alert,
  AlertTitle,
  AlertDescription,
  Spinner,
  Grid,
  GridItem,
  AspectRatio,
  Icon,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, TimeIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState, useCallback } from "react";
import { CAMPAIGN_SUBTITLE, CAMPAIGN_TITLE } from "@/constants/campaign";

import { useCampaignInfo, useExistingDonation } from "@/hooks/campaignQueries";
import { useCurrentBtcBlock } from "@/hooks/chainQueries";
import DonationModal from "./DonationModal";
import HiroWalletContext from "./HiroWalletProvider";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import {
  isDevnetEnvironment,
  isTestnetEnvironment,
} from "@/lib/contract-utils";
import { useCurrentPrices } from "@/lib/currency-utils";
import { FUNDRAISING_CONTRACT } from "@/constants/contracts";
import { getRefundTx } from "@/lib/campaign-utils";
import { getStacksNetworkString } from "@/lib/stacks-api";
import useTransactionExecuter from "@/hooks/useTransactionExecuter";
import CampaignAdminControls from "./CampaignAdminControls";

export default function CampaignDetails({
  images,
}: {
  images: string[];
}) {
  const { mainnetAddress, testnetAddress } = useContext(HiroWalletContext);
  const { currentWallet: devnetWallet } = useDevnetWallet();
  const currentWalletAddress = isDevnetEnvironment()
    ? devnetWallet?.stxAddress
    : isTestnetEnvironment()
    ? testnetAddress
    : mainnetAddress;

  const [isDonationModalOpen, setIsDonationModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { data: currentPrices } = useCurrentPrices();
  const { data: campaignInfo, error: campaignFetchError } =
    useCampaignInfo(currentPrices);
  const { data: currentBlock } = useCurrentBtcBlock();

  const campaignIsUninitialized = campaignInfo?.start === 0;
  const campaignIsExpired = !campaignIsUninitialized && campaignInfo?.isExpired;
  const campaignIsCancelled =
    !campaignIsUninitialized && campaignInfo?.isCancelled;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }, [images.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }, [images.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const progress = campaignInfo
    ? (campaignInfo.usdValue / campaignInfo.goal) * 100
    : 0;

  const blocksLeft = campaignInfo ? campaignInfo?.end - (currentBlock || 0) : 0;

  const { data: previousDonation } = useExistingDonation(currentWalletAddress);

  const hasMadePreviousDonation =
    previousDonation &&
    (previousDonation?.stxAmount > 0 || previousDonation?.sbtcAmount > 0);

  const executeTx = useTransactionExecuter();

  const handleRefund = async () => {
    const txOptions = getRefundTx(
      getStacksNetworkString(),
      currentWalletAddress || ""
    );
    await executeTx(
      txOptions,
      devnetWallet,
      "Refund requested",
      "Refund not requested"
    );
  };

  // Visual content array for dynamic display
  const visualContent = [
    {
      image: "/images/artist-at-work.jpg",
      title: "Artist at Work",
      description: "Creating urban masterpieces"
    },
    {
      image: "/images/mural-community-holding-hands.jpg", 
      title: "Community Unity",
      description: "Bringing people together"
    },
    {
      image: "/images/Before-After-Wall-Transformation.jpg",
      title: "Transformation",
      description: "From blank to beautiful"
    },
    {
      image: "/images/geometric-mural-paint.jpg",
      title: "Geometric Art",
      description: "Modern urban aesthetics"
    }
  ];

  return (
    <Container maxW="container.xl" py="8" px="0">
      {/* Hero Section - Full Visual Impact */}
      <Box
        position="relative"
        h="80vh"
        minH="600px"
        borderRadius="2xl"
        overflow="hidden"
        mb="8"
        bg="rgba(26, 32, 44, 0.9)"
        border="3px solid"
        borderColor="rgba(0, 212, 255, 0.4)"
        boxShadow="0 25px 50px rgba(0, 0, 0, 0.6), 0 0 100px rgba(0, 212, 255, 0.3)"
      >
        {/* Dynamic Background Image */}
        <Image
          src={visualContent[currentIndex % visualContent.length].image}
          alt="Urban Art Hero"
          position="absolute"
          top="0"
          left="0"
          w="100%"
          h="100%"
          objectFit="cover"
          zIndex="0"
          transition="all 0.5s ease-in-out"
        />
        
        {/* Gradient Overlay */}
        <Box
          position="absolute"
          top="0"
          left="0"
          right="0"
          bottom="0"
          bg="linear-gradient(135deg, rgba(26, 32, 44, 0.8) 0%, rgba(0, 212, 255, 0.2) 100%)"
          zIndex="1"
        />
        
        {/* Content Overlay */}
        <Flex
          position="relative"
          zIndex="2"
          direction="column"
          justify="center"
          align="center"
          h="100%"
          textAlign="center"
          px="8"
        >
          <Heading
            fontSize={{ base: "4xl", md: "6xl", lg: "7xl" }}
            fontWeight="900"
            color="white"
            textShadow="2px 2px 4px rgba(0,0,0,0.8)"
            mb="6"
            fontFamily="Permanent Marker, cursive"
          >
            {CAMPAIGN_TITLE}
          </Heading>
          
          <Text
            fontSize={{ base: "lg", md: "xl" }}
            color="rgba(255,255,255,0.9)"
            maxW="600px"
            mb="8"
            textShadow="1px 1px 2px rgba(0,0,0,0.8)"
          >
            {CAMPAIGN_SUBTITLE}
          </Text>

          {/* Visual Progress Indicator */}
          {campaignInfo && !campaignIsUninitialized && (
            <Box
              bg="rgba(255,255,255,0.1)"
              backdropFilter="blur(10px)"
              borderRadius="full"
              p="4"
              mb="6"
              minW="300px"
            >
              <Progress
                value={progress}
                size="lg"
                borderRadius="full"
                bg="rgba(255,255,255,0.2)"
                sx={{
                  '& > div': {
                    background: 'linear-gradient(90deg, #00D4FF 0%, #39FF14 100%)',
                    borderRadius: 'full'
                  }
                }}
              />
              <Text color="white" mt="2" fontSize="lg" fontWeight="bold">
                ${campaignInfo.usdValue.toLocaleString()} / ${campaignInfo.goal.toLocaleString()}
              </Text>
            </Box>
          )}

          {/* Action Buttons */}
          <Flex gap="4" flexWrap="wrap" justify="center">
            <Button
              size="lg"
              colorScheme="blue"
              bg="rgba(0, 212, 255, 0.9)"
              _hover={{ bg: "rgba(0, 212, 255, 1)" }}
              onClick={() => setIsDonationModalOpen(true)}
              borderRadius="full"
              px="8"
              py="6"
              fontSize="lg"
              fontWeight="bold"
              boxShadow="0 8px 25px rgba(0, 212, 255, 0.4)"
            >
              🎨 Support the Art
            </Button>
            
            {hasMadePreviousDonation && (
              <Button
                size="lg"
                variant="outline"
                color="white"
                borderColor="rgba(255,255,255,0.5)"
                _hover={{ bg: "rgba(255,255,255,0.1)" }}
                onClick={handleRefund}
                borderRadius="full"
                px="8"
                py="6"
                fontSize="lg"
              >
                💰 Get Refund
              </Button>
            )}
          </Flex>
        </Flex>

        {/* Navigation Arrows */}
        <IconButton
          aria-label="Previous image"
          icon={<ChevronLeftIcon />}
          position="absolute"
          left="4"
          top="50%"
          transform="translateY(-50%)"
          zIndex="3"
          onClick={prevSlide}
          bg="rgba(255,255,255,0.2)"
          _hover={{ bg: "rgba(255,255,255,0.3)" }}
          color="white"
          borderRadius="full"
          size="lg"
        />
        <IconButton
          aria-label="Next image"
          icon={<ChevronRightIcon />}
          position="absolute"
          right="4"
          top="50%"
          transform="translateY(-50%)"
          zIndex="3"
          onClick={nextSlide}
          bg="rgba(255,255,255,0.2)"
          _hover={{ bg: "rgba(255,255,255,0.3)" }}
          color="white"
          borderRadius="full"
          size="lg"
        />
      </Box>

      {/* Visual Grid Layout */}
      <Grid
        templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
        gap="6"
        mb="8"
      >
        {/* Campaign Stats - Visual Cards */}
        {campaignInfo && !campaignIsUninitialized && (
          <>
            <GridItem>
              <Box
                bg="rgba(0, 212, 255, 0.1)"
                border="2px solid"
                borderColor="rgba(0, 212, 255, 0.3)"
                borderRadius="2xl"
                p="6"
                textAlign="center"
                backdropFilter="blur(10px)"
                _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }}
              >
                <Icon as={StarIcon} w="12" h="12" color="blue.400" mb="4" />
                <Stat>
                  <StatNumber fontSize="3xl" color="blue.400" fontWeight="bold">
                    ${campaignInfo.usdValue.toLocaleString()}
                  </StatNumber>
                  <StatLabel color="gray.600" fontSize="lg">Raised</StatLabel>
                </Stat>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg="rgba(255, 107, 53, 0.1)"
                border="2px solid"
                borderColor="rgba(255, 107, 53, 0.3)"
                borderRadius="2xl"
                p="6"
                textAlign="center"
                backdropFilter="blur(10px)"
                _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }}
              >
                <Icon as={StarIcon} w="12" h="12" color="orange.400" mb="4" />
                <Stat>
                  <StatNumber fontSize="3xl" color="orange.400" fontWeight="bold">
                    {campaignInfo.donationCount}
                  </StatNumber>
                  <StatLabel color="gray.600" fontSize="lg">Supporters</StatLabel>
                </Stat>
              </Box>
            </GridItem>

            <GridItem>
              <Box
                bg="rgba(57, 255, 20, 0.1)"
                border="2px solid"
                borderColor="rgba(57, 255, 20, 0.3)"
                borderRadius="2xl"
                p="6"
                textAlign="center"
                backdropFilter="blur(10px)"
                _hover={{ transform: "translateY(-5px)", transition: "all 0.3s" }}
              >
                <Icon as={TimeIcon} w="12" h="12" color="green.400" mb="4" />
                <Stat>
                  <StatNumber fontSize="3xl" color="green.400" fontWeight="bold">
                    {blocksLeft}
                  </StatNumber>
                  <StatLabel color="gray.600" fontSize="lg">Blocks Left</StatLabel>
                </Stat>
              </Box>
            </GridItem>
          </>
        )}
      </Grid>

      {/* Visual Gallery Section */}
      <Box mb="8">
        <Heading
          fontSize="3xl"
          textAlign="center"
          mb="6"
          color="gray.800"
          fontFamily="Permanent Marker, cursive"
        >
          🎨 Art Gallery
        </Heading>
        
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing="6">
          {visualContent.map((item, index) => (
            <Box
              key={index}
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="0 10px 30px rgba(0,0,0,0.2)"
              _hover={{ transform: "scale(1.05)", transition: "all 0.3s" }}
            >
              <AspectRatio ratio={4/3}>
                <Image
                  src={item.image}
                  alt={item.title}
                  objectFit="cover"
                />
              </AspectRatio>
              <Box p="4" bg="white">
                <Text fontWeight="bold" fontSize="lg" mb="2">
                  {item.title}
                </Text>
                <Text color="gray.600" fontSize="sm">
                  {item.description}
                </Text>
              </Box>
            </Box>
          ))}
        </SimpleGrid>
      </Box>

      {/* Error Display - Minimal Text */}
      {campaignFetchError && (
        <Box mb="8">
          <Alert 
            status="warning" 
            bg="rgba(255, 107, 53, 0.1)"
            borderColor="rgba(255, 107, 53, 0.3)"
            border="2px solid"
            borderRadius="2xl"
            backdropFilter="blur(10px)"
          >
            <Box>
              <AlertTitle color="orange.600" fontSize="lg">
                ⚠️ Campaign Data Unavailable
              </AlertTitle>
              <AlertDescription color="gray.600">
                {campaignFetchError.message === "Contract address not configured. Please check environment variables." 
                  ? "Smart contract not deployed or configured. Please ensure the contract is deployed on testnet and environment variables are set correctly."
                  : campaignFetchError.message === "Error fetching campaign info from blockchain"
                  ? "Unable to retrieve campaign data from the blockchain. This could be due to network issues, the campaign may no longer exist, or the contract may not be deployed."
                  : `Error: ${campaignFetchError.message}`}
              </AlertDescription>
              <Box mt="3" fontSize="sm" color="gray.500">
                <Text>Network: {process.env.NEXT_PUBLIC_STACKS_NETWORK || 'devnet'}</Text>
                <Text>Contract: {FUNDRAISING_CONTRACT.address || 'Not configured'}</Text>
              </Box>
            </Box>
          </Alert>
        </Box>
      )}

      {/* Loading State - Visual */}
      {!campaignFetchError && !campaignIsUninitialized && !campaignInfo && (
        <Box textAlign="center" py="20">
          <Spinner size="xl" color="blue.400" thickness="4px" />
          <Text mt="4" color="gray.600" fontSize="lg">
            Loading campaign data...
          </Text>
        </Box>
      )}

      {/* Admin Controls - Visual */}
      {campaignInfo && (
        <CampaignAdminControls
          campaignIsUninitialized={campaignIsUninitialized || false}
          campaignIsCancelled={campaignIsCancelled || false}
          campaignIsExpired={campaignIsExpired || false}
          campaignIsWithdrawn={campaignInfo.isWithdrawn}
        />
      )}

      {/* Donation Modal */}
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => setIsDonationModalOpen(false)}
      />
    </Container>
  );
}
