import { FUNDRAISING_CONTRACT, SBTC_CONTRACT } from "@/constants/contracts";
import { ContractCallRegularOptions } from "@stacks/connect";
import { Network } from "./contract-utils";
import {
  AnchorMode,
  FungiblePostCondition,
  Pc,
  PostConditionMode,
  uintCV,
} from "@stacks/transactions";

interface ContributeParams {
  address: string;
  amount: number;
}

export const getContributeStxTx = (
  network: Network,
  params: ContributeParams // Send amount in microstacks
): ContractCallRegularOptions => {
  const { address, amount } = params;

  // Ensure amount is an integer for uintCV
  const integerAmount = Math.floor(amount);

  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "donate-stx",
    functionArgs: [uintCV(integerAmount)],
    postConditions: [Pc.principal(address).willSendEq(integerAmount).ustx()],
  };
};

export const getContributeSbtcTx = (
  network: Network,
  params: ContributeParams // Send amount in sats
): ContractCallRegularOptions => {
  const { address, amount } = params;

  // Ensure amount is an integer for uintCV
  const integerAmount = Math.floor(amount);

  const postCondition: FungiblePostCondition = {
    type: "ft-postcondition",
    address,
    condition: "eq",
    asset: `${SBTC_CONTRACT.address}.${SBTC_CONTRACT.name}::sbtc-token`,
    amount: integerAmount,
  };

  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "donate-sbtc",
    functionArgs: [uintCV(integerAmount)],
    postConditions: [postCondition],
  };
};

export const getInitializeTx = (
  network: Network,
  address: string,
  goalInUSD: number
): ContractCallRegularOptions => {
  // Ensure goalInUSD is an integer for uintCV
  const integerGoal = Math.floor(goalInUSD);

  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "initialize-campaign",
    functionArgs: [uintCV(integerGoal), uintCV(0)],
    postConditions: [Pc.principal(address).willSendEq(0).ustx()],
  };
};

export const getCancelTx = (
  network: Network,
  address: string
): ContractCallRegularOptions => {
  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "cancel-campaign",
    functionArgs: [],
    postConditions: [Pc.principal(address).willSendEq(0).ustx()],
  };
};

export const getRefundTx = (
  network: Network,
  address: string
): ContractCallRegularOptions => {
  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "refund",
    functionArgs: [],
    postConditions: [Pc.principal(address).willSendEq(0).ustx()],
  };
};

export const getWithdrawTx = (
  network: Network,
  address: string
): ContractCallRegularOptions => {
  return {
    anchorMode: AnchorMode.Any,
    postConditionMode: PostConditionMode.Deny,
    contractAddress: FUNDRAISING_CONTRACT.address || "",
    contractName: FUNDRAISING_CONTRACT.name,
    network,
    functionName: "withdraw",
    functionArgs: [],
    postConditions: [Pc.principal(address).willSendEq(0).ustx()],
  };
};
