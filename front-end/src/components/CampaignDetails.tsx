"use client";
import {
  Container,
  Box,
  IconButton,
  Image,
  Text,
  Flex,
  useBreakpointValue,
  Heading,
  Progress,
  Button,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Alert,
  AlertTitle,
  AlertDescription,
  Spinner,
  Tooltip,
  VStack,
  HStack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@chakra-ui/icons";
import { useContext, useEffect, useState } from "react";
import { CAMPAIGN_SUBTITLE, CAMPAIGN_TITLE, CAMPAIGN_GOAL_USD, CAMPAIGN_MILESTONES, FUNDING_BREAKDOWN } from "@/constants/campaign";

import { useCampaignInfo, useExistingDonation } from "@/hooks/campaignQueries";
import { useCurrentBtcBlock } from "@/hooks/chainQueries";
import { format } from "timeago.js";
import DonationModal from "./DonationModal";
import HiroWalletContext from "./HiroWalletProvider";
import { useDevnetWallet } from "@/lib/devnet-wallet-context";
import {
  isDevnetEnvironment,
  isTestnetEnvironment,
} from "@/lib/contract-utils";
import { satsToSbtc, useCurrentPrices, ustxToStx } from "@/lib/currency-utils";
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
  const slideSize = useBreakpointValue({ base: "100%", md: "500px" });

  const { data: currentPrices } = useCurrentPrices();
  const { data: campaignInfo, error: campaignFetchError } =
    useCampaignInfo(currentPrices);
  const { data: currentBlock } = useCurrentBtcBlock();

  const campaignIsUninitialized = campaignInfo?.start === 0;
  const campaignIsExpired = !campaignIsUninitialized && campaignInfo?.isExpired;
  const campaignIsCancelled =
    !campaignIsUninitialized && campaignInfo?.isCancelled;

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const progress = campaignInfo
    ? (campaignInfo.usdValue / campaignInfo.goal) * 100
    : 0;

  const blocksLeft = campaignInfo ? campaignInfo?.end - (currentBlock || 0) : 0;
  const secondsLeft = blocksLeft * 600; // estimate each block is 10 minutes
  const secondsLeftTimestamp = new Date(Date.now() - secondsLeft * 1000);

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

  return (
    <Container maxW="container.xl" py="8">
      <Flex direction="column" gap="6">
        {/* Street Art Hero Section with Glassmorphism */}
        <Box
          position="relative"
          p={8}
          borderRadius="2xl"
          textAlign="center"
          overflow="hidden"
          mb={6}
          minH="400px"
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="rgba(26, 32, 44, 0.8)"
          border="2px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          backdropFilter="blur(20px)"
          boxShadow="0 25px 50px rgba(0, 0, 0, 0.5), 0 0 100px rgba(0, 212, 255, 0.2)"
        >
          {/* Background Image */}
          <Image
            src="/images/main-hero-background.jpg"
            alt="Street Art Mural Background"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            zIndex={0}
          />
          {/* Overlay Pattern */}
          <Image
            src="/images/hero-overlay-pattern.jpg"
            alt="Hero Overlay Pattern"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.3}
            zIndex={1}
          />
          {/* Glassmorphism Overlay */}
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(26, 32, 44, 0.7)"
            backdropFilter="blur(10px)"
            zIndex={2}
          />
          
          {/* Decorative Glass Elements */}
          <Box
            position="absolute"
            top="20px"
            right="20px"
            w="80px"
            h="80px"
            bg="rgba(0, 212, 255, 0.2)"
            borderRadius="full"
            filter="blur(15px)"
            zIndex={3}
          />
          <Box
            position="absolute"
            bottom="20px"
            left="20px"
            w="60px"
            h="60px"
            bg="rgba(255, 107, 53, 0.2)"
            borderRadius="full"
            filter="blur(10px)"
            zIndex={3}
          />
          
          <VStack spacing={6} position="relative" zIndex={4}>
            <Heading
              size="2xl"
              color="white"
              fontFamily="tech"
              textShadow="2px 2px 4px rgba(0,0,0,0.8), 0 0 30px rgba(0, 212, 255, 0.5)"
            >
              {CAMPAIGN_TITLE}
            </Heading>
            <Text fontSize="xl" color="white" maxW="2xl" textShadow="1px 1px 2px rgba(0,0,0,0.8)">
              {CAMPAIGN_SUBTITLE}
            </Text>
            <HStack spacing={6} justify="center" wrap="wrap">
              <Stat 
                textAlign="center" 
                bg="rgba(0, 212, 255, 0.15)" 
                p={4} 
                borderRadius="xl" 
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(0, 212, 255, 0.3)"
                backdropBlur="15px"
              >
                <StatLabel color="white" fontSize="lg">Funding Goal</StatLabel>
                <StatNumber color="white" fontSize="2xl">${CAMPAIGN_GOAL_USD.toLocaleString()}</StatNumber>
              </Stat>
              <Stat 
                textAlign="center" 
                bg="rgba(255, 107, 53, 0.15)" 
                p={4} 
                borderRadius="xl" 
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(255, 107, 53, 0.3)"
              >
                <StatLabel color="white" fontSize="lg">Campaign Duration</StatLabel>
                <StatNumber color="white" fontSize="2xl">90 Days</StatNumber>
              </Stat>
              <Stat 
                textAlign="center" 
                bg="rgba(57, 255, 20, 0.15)" 
                p={4} 
                borderRadius="xl" 
                backdropFilter="blur(15px)"
                border="1px solid"
                borderColor="rgba(57, 255, 20, 0.3)"
              >
                <StatLabel color="white" fontSize="lg">Beneficiary</StatLabel>
                <StatNumber color="white" fontSize="lg">Downtown Arts Collective</StatNumber>
              </Stat>
            </HStack>
          </VStack>
        </Box>

        <Flex direction="column" gap="1">
          <Heading fontFamily="tech" color="streetArt.primary">{CAMPAIGN_TITLE}</Heading>
          <Text fontSize="lg" color="dark.400">{CAMPAIGN_SUBTITLE}</Text>
        </Flex>

        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8} alignItems="start">
          {/* Left column: Image carousel with glassmorphism */}
          <Box 
            position="relative" 
            width="full" 
            overflow="hidden" 
            borderRadius="2xl"
            bg="rgba(255, 255, 255, 0.05)"
            border="1px solid"
            borderColor="rgba(255, 255, 255, 0.1)"
            backdropFilter="blur(10px)"
            p={2}
          >
            <Flex width={slideSize} mx="auto" position="relative">
              <Image
                src={images[currentIndex]}
                alt={`Campaign image ${currentIndex + 1}`}
                objectFit="cover"
                width="full"
                height="auto"
                borderRadius="xl"
              />
              <IconButton
                aria-label="Previous image"
                icon={<ChevronLeftIcon boxSize="5" />}
                onClick={prevSlide}
                position="absolute"
                left="2"
                top="50%"
                transform="translateY(-50%)"
                colorScheme="blue"
                rounded="full"
                bg="rgba(0, 0, 0, 0.7)"
                color="white"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(10px)"
                _hover={{ 
                  bg: "rgba(0, 212, 255, 0.3)",
                  borderColor: "rgba(0, 212, 255, 0.8)",
                  transform: "translateY(-50%) scale(1.1)",
                }}
                transition="all 0.3s"
              />
              <IconButton
                aria-label="Next image"
                icon={<ChevronRightIcon boxSize="5" />}
                onClick={nextSlide}
                position="absolute"
                right="2"
                top="50%"
                transform="translateY(-50%)"
                colorScheme="blue"
                rounded="full"
                bg="rgba(0, 0, 0, 0.7)"
                color="white"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.2)"
                backdropFilter="blur(10px)"
                _hover={{ 
                  bg: "rgba(0, 212, 255, 0.3)",
                  borderColor: "rgba(0, 212, 255, 0.8)",
                  transform: "translateY(-50%) scale(1.1)",
                }}
                transition="all 0.3s"
              />
              <Text
                position="absolute"
                bottom="2"
                right="2"
                bg="rgba(0, 0, 0, 0.8)"
                color="white"
                px="3"
                py="2"
                rounded="xl"
                fontSize="sm"
                backdropFilter="blur(10px)"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.2)"
              >
                {currentIndex + 1} / {images.length}
              </Text>
            </Flex>
          </Box>

          {/* Right column: Campaign stats & donation with glassmorphism */}
          <Box>
            {campaignInfo &&
            currentWalletAddress === FUNDRAISING_CONTRACT.address ? (
              <CampaignAdminControls
                campaignIsUninitialized={campaignIsUninitialized}
                campaignIsExpired={!!campaignIsExpired}
                campaignIsCancelled={!!campaignIsCancelled}
                campaignIsWithdrawn={!!campaignInfo?.isWithdrawn}
              />
            ) : null}
            <Box 
              p={6} 
              borderRadius="2xl" 
              border="1px solid" 
              borderColor="rgba(255, 255, 255, 0.1)"
              bg="rgba(255, 255, 255, 0.05)"
              backdropFilter="blur(15px)"
              position="relative"
              overflow="hidden"
            >
              {/* Inner decorative elements */}
              <Box
                position="absolute"
                top="-20px"
                right="-20px"
                w="60px"
                h="60px"
                bg="rgba(0, 212, 255, 0.1)"
                borderRadius="full"
                filter="blur(10px)"
              />
              <Box
                position="absolute"
                bottom="-15px"
                left="-15px"
                w="40px"
                h="40px"
                bg="rgba(255, 107, 53, 0.1)"
                borderRadius="full"
                filter="blur(8px)"
              />
              
              {campaignIsUninitialized ? (
                <Flex direction="column" gap={4}>
                  <Text color="dark.400">This campaign hasn&apos;t started yet!</Text>
                </Flex>
              ) : null}

              {campaignInfo && !campaignIsUninitialized ? (
                <Flex direction="column" gap={6}>
                  <SimpleGrid columns={2} spacing={4}>
                    <Stat>
                      <StatLabel color="dark.400">Raised</StatLabel>
                      <StatNumber color="white">
                        $
                        {campaignInfo?.usdValue?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}
                      </StatNumber>
                      <StatHelpText color="dark.400">
                        of ${campaignInfo?.goal?.toLocaleString()} goal
                      </StatHelpText>
                    </Stat>
                    <Stat>
                      <StatLabel color="dark.400">Contributions</StatLabel>
                      <StatNumber color="white">{campaignInfo?.donationCount}</StatNumber>
                      <StatHelpText color="dark.400">
                        {campaignIsExpired ? (
                          <Flex direction="column">
                            <Box>
                              Campaign expired
                              <Tooltip
                                label={
                                  <Flex direction="column" gap="1">
                                    <Box>
                                      Expired at: Block #{campaignInfo?.end}
                                    </Box>
                                    <Box>Current: Block #{currentBlock}</Box>
                                  </Flex>
                                }
                              >
                                <InfoIcon ml="1.5" mt="-3px" />
                              </Tooltip>
                            </Box>
                          </Flex>
                        ) : (
                          <Flex direction="column">
                            <Box>
                              {blocksLeft.toLocaleString()} BTC blocks left
                              <Tooltip
                                label={
                                  <Flex direction="column" gap="1">
                                    <Box>
                                      Started: Block #{campaignInfo?.start}
                                    </Box>
                                    <Box>Ends: Block #{campaignInfo?.end}</Box>
                                    <Box>Current: Block #{currentBlock}</Box>
                                  </Flex>
                                }
                              >
                                <InfoIcon ml="1.5" mt="-3px" />
                              </Tooltip>
                            </Box>
                            <Box>
                              (About{" "}
                              {format(secondsLeftTimestamp)?.replace(
                                " ago",
                                ""
                              )}
                              )
                            </Box>
                          </Flex>
                        )}
                      </StatHelpText>
                    </Stat>
                  </SimpleGrid>

                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={3} color="streetArt.primary">
                      🎨 Progress: Paint Can Filling Up!
                    </Text>
                    <Box
                      p={4}
                      bg="rgba(255, 255, 255, 0.05)"
                      borderRadius="xl"
                      border="1px solid"
                      borderColor="rgba(255, 255, 255, 0.1)"
                      backdropFilter="blur(10px)"
                    >
                      <Progress
                        value={progress}
                        size="lg"
                        borderRadius="full"
                        bg="dark.200"
                        sx={{
                          '& > div': {
                            background: 'linear-gradient(90deg, #00D4FF 0%, #FF6B35 50%, #39FF14 100%)',
                            boxShadow: '0 0 20px rgba(0, 212, 255, 0.4)',
                          }
                        }}
                      />
                      <Text fontSize="sm" color="streetArt.primary" mt={2} textAlign="center">
                        {progress.toFixed(1)}% Complete - Your contribution just added color to our community!
                      </Text>
                    </Box>
                  </Box>

                  {campaignIsExpired || campaignIsCancelled ? (
                    <Flex direction="column" gap="2">
                      <Text color="dark.400">
                        This fundraiser{" "}
                        {campaignIsCancelled ? "was cancelled" : "has ended"}.
                        {campaignIsCancelled
                          ? " Contributors are eligible for a refund."
                          : null}
                      </Text>
                      {hasMadePreviousDonation ? (
                        <Alert 
                          mb="4" 
                          bg="rgba(0, 212, 255, 0.1)"
                          borderColor="rgba(0, 212, 255, 0.3)"
                          border="1px solid"
                          borderRadius="xl"
                          backdropFilter="blur(10px)"
                        >
                          <Box>
                            <AlertTitle color="white">
                              You contributed to this fundraiser.
                            </AlertTitle>
                            <AlertDescription color="dark.400">
                              <Box>
                                STX:{" "}
                                {Number(
                                  ustxToStx(previousDonation?.stxAmount)
                                ).toFixed(2)}
                              </Box>
                              <Box>
                                sBTC:{" "}
                                {satsToSbtc(
                                  previousDonation?.sbtcAmount
                                ).toFixed(8)}
                              </Box>
                            </AlertDescription>
                            <Box mt="4">
                              {!campaignIsCancelled ? (
                                <Text color="dark.400">Thanks for your contribution!</Text>
                              ) : (
                                <Button
                                  colorScheme="green"
                                  onClick={handleRefund}
                                >
                                  Request a Refund
                                </Button>
                              )}
                            </Box>
                          </Box>
                        </Alert>
                      ) : null}
                    </Flex>
                  ) : (
                    <Flex direction="column" gap="4">
                      <Button
                        size="lg"
                        variant="ghost"
                        width="full"
                        onClick={() => {
                          setIsDonationModalOpen(true);
                        }}
                        bg="linear-gradient(135deg, rgba(0, 212, 255, 0.2) 0%, rgba(255, 107, 53, 0.2) 100%)"
                        color="white"
                        border="1px solid"
                        borderColor="rgba(0, 212, 255, 0.5)"
                        borderRadius="xl"
                        backdropFilter="blur(10px)"
                        _hover={{
                          bg: "linear-gradient(135deg, rgba(0, 212, 255, 0.4) 0%, rgba(255, 107, 53, 0.4) 100%)",
                          borderColor: "rgba(0, 212, 255, 0.8)",
                          transform: "translateY(-2px)",
                          boxShadow: "0 10px 25px rgba(0, 212, 255, 0.3)",
                        }}
                        transition="all 0.3s"
                        fontWeight="bold"
                      >
                        🎨 Contribute Now
                      </Button>
                      <Box fontSize="xs" color="dark.400">
                        <Box mb="2">
                          <strong>Flexible funding</strong>: Creator keeps
                          whatever money they raise, even if they don&apos;t hit
                          their target. No refunds to backers if the campaign
                          falls short.
                        </Box>
                        <Box>
                          The creator can always choose to cancel this
                          fundraiser and provide refunds.
                        </Box>
                      </Box>
                    </Flex>
                  )}
                </Flex>
              ) : campaignFetchError ? (
                <Box>
                  <Alert 
                    status="warning" 
                    bg="rgba(255, 107, 53, 0.1)"
                    borderColor="rgba(255, 107, 53, 0.3)"
                    border="1px solid"
                    borderRadius="xl"
                    backdropFilter="blur(10px)"
                  >
                    <Box>
                      <AlertTitle color="white">Campaign Data Unavailable</AlertTitle>
                      <AlertDescription color="dark.400">
                        Unable to retrieve campaign data from the blockchain.
                        This could be due to network issues or the campaign may
                        no longer exist.
                      </AlertDescription>
                    </Box>
                  </Alert>
                </Box>
              ) : !campaignIsUninitialized ? (
                <Box w="full" textAlign="center">
                  <Spinner size="lg" color="streetArt.primary" />
                </Box>
              ) : null}
            </Box>
          </Box>
        </SimpleGrid>



        {/* Campaign Overview Section with Glassmorphism */}
        <Box
          border="2px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          {/* Background Image */}
          <Image
            src="/images/geometric-mural-paint.jpg"
            alt="Geometric Mural Paint"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.03}
            zIndex={0}
          />
          
          {/* Glassmorphism decorative elements */}
          <Box
            position="absolute"
            top="-40px"
            right="-40px"
            w="150px"
            h="150px"
            bg="rgba(0, 212, 255, 0.08)"
            borderRadius="full"
            filter="blur(25px)"
            zIndex={1}
          />
          
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Box textAlign="center">
                          <Heading size="2xl" fontFamily="tech" color="streetArt.primary" mb={4}>
              🎨 Campaign Overview
            </Heading>
              <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)" maxW="4xl" mx="auto">
                Muralverse: Urban Canvas Community Street Art Revival is a transformative initiative that brings vibrant street art murals to downtown spaces, revitalizing urban environments and fostering community pride.
              </Text>
            </Box>

            {/* Mission Statement Card */}
            <Box
              p={6}
              bg="rgba(0, 212, 255, 0.1)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(0, 212, 255, 0.3)"
              backdropFilter="blur(15px)"
              textAlign="center"
            >
              <Text fontSize="xl" color="white" fontWeight="bold" mb={3}>
                🎯 Our Mission
              </Text>
              <Text color="rgba(255, 255, 255, 0.9)">
                Transform blank walls into storytelling canvases that celebrate local culture, history, and community spirit through collaborative art creation.
              </Text>
            </Box>

            {/* Key Benefits Grid */}
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
              <Box
                p={5}
                bg="rgba(255, 107, 53, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 107, 53, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(255, 107, 53, 0.2)",
                }}
              >
                <Text fontSize="4xl" mb={3}>🏙️</Text>
                <Heading size="md" color="streetArt.secondary" mb={2}>
                  Urban Beautification
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Transform 5-7 blank walls into vibrant artistic statements
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(57, 255, 20, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(57, 255, 20, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(57, 255, 20, 0.2)",
                }}
              >
                <Text fontSize="4xl" mb={3}>🤝</Text>
                <Heading size="md" color="streetArt.accent" mb={2}>
                  Community Engagement
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Bring together diverse community members through art
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(106, 13, 173, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(106, 13, 173, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(106, 13, 173, 0.2)",
                }}
              >
                <Text fontSize="4xl" mb={3}>💰</Text>
                <Heading size="md" color="streetArt.darkAccent" mb={2}>
                  Economic Benefits
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Attract tourists and support local businesses
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Team Section with Glassmorphism */}
        <Box
          border="2px solid"
          borderColor="rgba(255, 107, 53, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          {/* Background Image */}
          <Image
            src="/images/artist-at-work-2.jpg"
            alt="Artist at Work 2"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.03}
            zIndex={0}
          />
          
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.secondary" textAlign="center">
              🎭 Meet the Team
            </Heading>
            
            <Text fontSize="lg" color="rgba(255, 255, 255, 0.8)" textAlign="center" mb={6}>
              Downtown Arts Collective is a grassroots organization dedicated to bringing art to public spaces.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Box
                p={5}
                bg="rgba(255, 255, 255, 0.08)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(0, 212, 255, 0.5)",
                  boxShadow: "0 15px 35px rgba(0, 212, 255, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>👩‍💼</Text>
                <Heading size="md" color="streetArt.primary" mb={2}>
                  Sarah Chen
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Project Director & Community Organizer
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(255, 255, 255, 0.08)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(255, 107, 53, 0.5)",
                  boxShadow: "0 15px 35px rgba(255, 107, 53, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>🎨</Text>
                <Heading size="md" color="streetArt.secondary" mb={2}>
                  Marcus Rodriguez
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Lead Artist & Mural Specialist
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(255, 255, 255, 0.08)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(57, 255, 20, 0.5)",
                  boxShadow: "0 15px 35px rgba(57, 255, 20, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>🏗️</Text>
                <Heading size="md" color="streetArt.accent" mb={2}>
                  Dr. Emily Watson
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Urban Planning Consultant
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(255, 255, 255, 0.08)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(106, 13, 173, 0.5)",
                  boxShadow: "0 15px 35px rgba(106, 13, 173, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>🤝</Text>
                <Heading size="md" color="streetArt.darkAccent" mb={2}>
                  James Thompson
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.7)">
                  Business Development & Partnerships
                </Text>
              </Box>
            </SimpleGrid>

            <Box
              p={4}
              bg="rgba(0, 212, 255, 0.1)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(0, 212, 255, 0.3)"
              backdropFilter="blur(15px)"
              textAlign="center"
            >
              <Text fontSize="lg" color="white" fontWeight="bold">
                + Community Advisory Board
              </Text>
              <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                12 local residents representing diverse neighborhoods
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Why This Matters Section */}
        <Box
          border="2px solid"
          borderColor="rgba(57, 255, 20, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.accent" textAlign="center">
              🏗️ Why This Matters
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <VStack spacing={4} align="stretch">
                <Box
                  p={5}
                  bg="rgba(255, 255, 255, 0.08)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(15px)"
                >
                  <HStack spacing={3} mb={3}>
                    <Text fontSize="2xl">🏚️</Text>
                    <Heading size="md" color="streetArt.primary">
                      Addressing Urban Blight
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                    Transform neglected spaces into vibrant, engaging areas that invite people to connect with their surroundings.
                  </Text>
                </Box>

                <Box
                  p={5}
                  bg="rgba(255, 255, 255, 0.08)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(15px)"
                >
                  <HStack spacing={3} mb={3}>
                    <Text fontSize="2xl">🎨</Text>
                    <Heading size="md" color="streetArt.secondary">
                      Supporting Local Artists
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                    Provide platform for local artists to showcase talent and earn fair compensation while developing skills.
                  </Text>
                </Box>
              </VStack>

              <VStack spacing={4} align="stretch">
                <Box
                  p={5}
                  bg="rgba(255, 255, 255, 0.08)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(15px)"
                >
                  <HStack spacing={3} mb={3}>
                    <Text fontSize="2xl">🏆</Text>
                    <Heading size="md" color="streetArt.accent">
                      Fostering Community Pride
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                    Build stronger sense of ownership and pride leading to better maintenance and community bonds.
                  </Text>
                </Box>

                <Box
                  p={5}
                  bg="rgba(255, 255, 255, 0.08)"
                  borderRadius="xl"
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  backdropFilter="blur(15px)"
                >
                  <HStack spacing={3} mb={3}>
                    <Text fontSize="2xl">🏛️</Text>
                    <Heading size="md" color="streetArt.darkAccent">
                      Creating Cultural Legacy
                    </Heading>
                  </HStack>
                  <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                    Murals become part of city&apos;s cultural heritage, telling stories about community values and aspirations.
                  </Text>
                </Box>
              </VStack>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* How You Can Help Section */}
        <Box
          border="2px solid"
          borderColor="rgba(106, 13, 173, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.darkAccent" textAlign="center">
              🎯 How You Can Help
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              <Box
                p={5}
                bg="rgba(0, 212, 255, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(0, 212, 255, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(0, 212, 255, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>💸</Text>
                <Heading size="md" color="streetArt.primary" mb={2}>
                  Make a Donation
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Every dollar counts toward bringing art to our streets
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(255, 107, 53, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(255, 107, 53, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(255, 107, 53, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>🗳️</Text>
                <Heading size="md" color="streetArt.secondary" mb={2}>
                  Vote for Designs
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Participate in the community voting process
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(57, 255, 20, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(57, 255, 20, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(57, 255, 20, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>📢</Text>
                <Heading size="md" color="streetArt.accent" mb={2}>
                  Spread the Word
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Share our campaign with friends and on social media
                </Text>
              </Box>

              <Box
                p={5}
                bg="rgba(106, 13, 173, 0.1)"
                borderRadius="xl"
                border="1px solid"
                borderColor="rgba(106, 13, 173, 0.3)"
                backdropFilter="blur(15px)"
                textAlign="center"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  boxShadow: "0 15px 35px rgba(106, 13, 173, 0.2)",
                }}
              >
                <Text fontSize="3xl" mb={3}>🎉</Text>
                <Heading size="md" color="streetArt.darkAccent" mb={2}>
                  Attend Events
                </Heading>
                <Text fontSize="sm" color="rgba(255, 255, 255, 0.8)">
                  Join us for unveilings and community celebrations
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Future Vision Section */}
        <Box
          border="2px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          <VStack spacing={6} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.primary" textAlign="center">
              🌈 The Future of Downtown
            </Heading>
            
            <Box
              p={6}
              bg="rgba(0, 212, 255, 0.1)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(0, 212, 255, 0.3)"
              backdropFilter="blur(15px)"
              textAlign="center"
            >
              <Text fontSize="lg" color="white" mb={4}>
                This project is just the beginning. We envision a downtown where every blank wall tells a story, where art is integrated into the urban fabric, and where community members actively participate in shaping their environment.
              </Text>
              <Text fontSize="lg" color="streetArt.primary" fontWeight="bold">
                Together, we can paint a brighter future for our downtown – one mural at a time.
              </Text>
            </Box>

            <Box
              p={4}
              bg="rgba(255, 255, 255, 0.08)"
              borderRadius="xl"
              border="1px solid"
              borderColor="rgba(255, 255, 255, 0.1)"
              backdropFilter="blur(15px)"
              textAlign="center"
              fontStyle="italic"
            >
              <Text fontSize="lg" color="rgba(255, 255, 255, 0.9)">
                &ldquo;Art is not what you see, but what you make others see.&rdquo; - Edgar Degas
              </Text>
            </Box>
          </VStack>
        </Box>

        {/* Funding Breakdown Section with Glassmorphism */}
        <Box
          border="2px solid"
          borderColor="rgba(0, 212, 255, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          {/* Background Image */}
          <Image
            src="/images/artist-at-work.jpg"
            alt="Artist at Work"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.05}
            zIndex={0}
          />
          
          {/* Glassmorphism decorative elements */}
          <Box
            position="absolute"
            top="-30px"
            right="-30px"
            w="120px"
            h="120px"
            bg="rgba(0, 212, 255, 0.1)"
            borderRadius="full"
            filter="blur(20px)"
            zIndex={1}
          />
          <Box
            position="absolute"
            bottom="-20px"
            left="-20px"
            w="80px"
            h="80px"
            bg="rgba(255, 107, 53, 0.1)"
            borderRadius="full"
            filter="blur(15px)"
            zIndex={1}
          />
          
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.primary" textAlign="center">
              💰 How Your Money Will Be Used
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {FUNDING_BREAKDOWN.map((item, index) => (
                <Box
                  key={index}
                  p={6}
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="xl"
                  bg="rgba(255, 255, 255, 0.08)"
                  textAlign="center"
                  transition="all 0.3s"
                  backdropFilter="blur(15px)"
                  _hover={{
                    transform: "translateY(-8px)",
                    borderColor: "rgba(0, 212, 255, 0.5)",
                    boxShadow: "0 20px 40px rgba(0, 212, 255, 0.2)",
                    bg: "rgba(255, 255, 255, 0.12)",
                  }}
                  position="relative"
                  overflow="hidden"
                >
                  {/* Inner glow effect */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="linear-gradient(135deg, rgba(0, 212, 255, 0.05) 0%, rgba(255, 107, 53, 0.05) 100%)"
                    borderRadius="inherit"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    transition="opacity 0.3s"
                  />
                  
                  <VStack spacing={3} position="relative" zIndex={1}>
                    <Text fontSize="3xl" mb={2}>
                      {item.percentage === 40 ? "🎨" : 
                       item.percentage === 30 ? "🖌️" : 
                       item.percentage === 20 ? "🏗️" : "🎉"}
                    </Text>
                    <Text fontSize="lg" fontWeight="bold" color="streetArt.primary" mb={1}>
                      {item.category}
                    </Text>
                    <Text fontSize="2xl" fontWeight="bold" color="streetArt.secondary" mb={1}>
                      {item.percentage}%
                    </Text>
                    <Text fontSize="lg" color="streetArt.accent" fontWeight="bold">
                      ${item.amount.toLocaleString()}
                    </Text>
                  </VStack>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Campaign Timeline Section with Glassmorphism */}
        <Box
          border="2px solid"
          borderColor="rgba(255, 107, 53, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          {/* Background Image */}
          <Image
            src="/images/Before-After-Wall-Transformation.jpg"
            alt="Before After Wall Transformation"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.05}
            zIndex={0}
          />
          
          {/* Glassmorphism decorative elements */}
          <Box
            position="absolute"
            top="-25px"
            left="-25px"
            w="100px"
            h="100px"
            bg="rgba(57, 255, 20, 0.1)"
            borderRadius="full"
            filter="blur(18px)"
            zIndex={1}
          />
          
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.secondary" textAlign="center">
              ⏰ Project Timeline
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
              {CAMPAIGN_MILESTONES.map((milestone, index) => (
                <Box
                  key={index}
                  p={6}
                  border="1px solid"
                  borderColor="rgba(255, 255, 255, 0.1)"
                  borderRadius="xl"
                  bg="rgba(255, 255, 255, 0.08)"
                  position="relative"
                  transition="all 0.3s"
                  backdropFilter="blur(15px)"
                  _hover={{
                    transform: "translateY(-8px)",
                    borderColor: "rgba(255, 107, 53, 0.5)",
                    boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)",
                    bg: "rgba(255, 255, 255, 0.12)",
                  }}
                  overflow="hidden"
                >
                  {/* Inner glow effect */}
                  <Box
                    position="absolute"
                    top="0"
                    left="0"
                    right="0"
                    bottom="0"
                    bg="linear-gradient(135deg, rgba(255, 107, 53, 0.05) 0%, rgba(57, 255, 20, 0.05) 100%)"
                    borderRadius="inherit"
                    opacity={0}
                    _hover={{ opacity: 1 }}
                    transition="opacity 0.3s"
                  />
                  
                  <HStack spacing={4} mb={4} position="relative" zIndex={1}>
                    <Box
                      w="50px"
                      h="50px"
                      bg="linear-gradient(135deg, #FF6B35 0%, #39FF14 100%)"
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="white"
                      fontWeight="bold"
                      fontSize="lg"
                      boxShadow="0 5px 15px rgba(255, 107, 53, 0.4)"
                    >
                      {index + 1}
                    </Box>
                    <VStack align="start" spacing={1}>
                      <Text fontSize="lg" fontWeight="bold" color="streetArt.primary">
                        Week {milestone.week}
                      </Text>
                      <Text fontSize="md" fontWeight="bold" color="streetArt.secondary">
                        {milestone.phase}
                      </Text>
                    </VStack>
                  </HStack>
                  <Text fontSize="sm" color="dark.400" position="relative" zIndex={1}>
                    {milestone.description}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </VStack>
        </Box>

        {/* Community Engagement Section with Glassmorphism */}
        <Box
          border="2px solid"
          borderColor="rgba(57, 255, 20, 0.3)"
          borderRadius="2xl"
          p={8}
          bg="rgba(255, 255, 255, 0.05)"
          position="relative"
          overflow="hidden"
          backdropFilter="blur(20px)"
          boxShadow="0 20px 40px rgba(0, 0, 0, 0.3)"
        >
          {/* Background Image */}
          <Image
            src="/images/mural-community-holding-hands.jpg"
            alt="Mural Community Holding Hands"
            position="absolute"
            top={0}
            left={0}
            w="100%"
            h="100%"
            objectFit="cover"
            opacity={0.05}
            zIndex={0}
          />
          
          {/* Glassmorphism decorative elements */}
          <Box
            position="absolute"
            top="-20px"
            right="-20px"
            w="80px"
            h="80px"
            bg="rgba(0, 212, 255, 0.1)"
            borderRadius="full"
            filter="blur(15px)"
            zIndex={1}
          />
          
          <VStack spacing={8} align="stretch" position="relative" zIndex={2}>
            <Heading size="lg" fontFamily="tech" color="streetArt.accent" textAlign="center">
              🤝 Community Engagement
            </Heading>
            
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Box
                p={6}
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                bg="rgba(255, 255, 255, 0.08)"
                textAlign="center"
                backdropFilter="blur(15px)"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(0, 212, 255, 0.5)",
                  boxShadow: "0 15px 35px rgba(0, 212, 255, 0.2)",
                  bg: "rgba(255, 255, 255, 0.12)",
                }}
                overflow="hidden"
              >
                <Image
                  src="/images/sketches-with-marker-and-paint.jpg"
                  alt="Sketches with Marker and Paint"
                  borderRadius="lg"
                  mb={4}
                  w="100%"
                  h="220px"
                  objectFit="cover"
                />
                <Heading size="md" color="streetArt.primary" mb={3}>
                  Design Process
                </Heading>
                <Text color="dark.400">
                  Community members collaborate with artists to create unique mural designs that reflect local culture and values.
                </Text>
              </Box>
              
              <Box
                p={6}
                border="1px solid"
                borderColor="rgba(255, 255, 255, 0.1)"
                borderRadius="xl"
                bg="rgba(255, 255, 255, 0.08)"
                textAlign="center"
                backdropFilter="blur(15px)"
                transition="all 0.3s"
                _hover={{
                  transform: "translateY(-5px)",
                  borderColor: "rgba(255, 107, 53, 0.5)",
                  boxShadow: "0 15px 35px rgba(255, 107, 53, 0.2)",
                  bg: "rgba(255, 255, 255, 0.12)",
                }}
                overflow="hidden"
              >
                <Image
                  src="/images/geometric-mural-paint.jpg"
                  alt="Geometric Mural Paint"
                  borderRadius="lg"
                  mb={4}
                  w="100%"
                  h="220px"
                  objectFit="cover"
                />
                <Heading size="md" color="streetArt.secondary" mb={3}>
                  Artistic Expression
                </Heading>
                <Text color="dark.400">
                  Diverse artistic styles come together to transform blank walls into vibrant storytelling canvases.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Box>
      </Flex>
      <DonationModal
        isOpen={isDonationModalOpen}
        onClose={() => {
          setIsDonationModalOpen(false);
        }}
      />
    </Container>
  );
}
