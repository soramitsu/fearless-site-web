import type { NetworkInfo } from './constants/types'

export type FeaturedNetwork = Required<NetworkInfo> & {
  availability: 'live' | 'testnet' | 'gated'
  testnetGuide?: { href: string; title: string }
}

const networks: Record<string, FeaturedNetwork> = {
  bitcoin: {
    availability: 'live',
    fullName: 'Bitcoin',
    shortName: 'BTC',
    icon: '/networks/bitcoin.svg',
    description: [
      'Fearless Wallet supports Bitcoin in all three apps: iOS, Android and the Chrome extension.',
      'You can view your Bitcoin address, check your balance and transaction history, and send BTC.',
    ],
  },
  solana: {
    availability: 'live',
    fullName: 'Solana',
    shortName: 'SOL',
    icon: '/networks/solana.svg',
    description: [
      'Fearless Wallet supports Solana in all three apps: iOS, Android and the Chrome extension. SOL pays transaction fees on Solana.',
      'The extension uses public RPC nodes with automatic failover to check balances and send transactions. Open the linked block explorer to view your history.',
    ],
  },
  ethereum: {
    availability: 'live',
    fullName: 'Ethereum',
    shortName: 'ETH',
    icon: '/networks/Ethereum.svg',
    description: [
      'Ethereum is a decentralized global software platform built on blockchain technology. While investors recognize it for its native cryptocurrency, Ether (ETH), developers value it for enabling blockchain and decentralized finance (DeFi) application development.',
      'Open to anyone, Ethereum is designed to be scalable, programmable, secure, and decentralized, allowing users to create secure digital technologies. Its native token, Ether, is primarily used to compensate for work supporting the blockchain, but it can also be used to purchase goods and services where accepted.',
    ],
  },
  ton: {
    availability: 'live',
    fullName: 'The Open Network',
    shortName: 'TON',
    icon: '/networks/ton.svg',
    description: [
      'A decentralized and open internet designed to onboard 500M people on-chain, built by the community using technology developed by Telegram.',
      'Toncoin is TON`s native cryptocurrency. It is used for network operations, transactions, games or collectibles built on TON.',
    ],
  },
  polygon: {
    availability: 'live',
    fullName: 'Polygon',
    shortName: 'POL',
    icon: '/networks/Polygon.svg',
    description: [
      'Polygon PoS is an Ethereum scaling network. Its native token, POL, pays transaction fees and is used for staking.',
    ],
  },
  kusama: {
    availability: 'live',
    fullName: 'Kusama',
    shortName: 'KSM',
    icon: '/networks/Kusama.svg',
    description: [
      'Kusama is a scalable, multichain network designed as a “canary network” for Polkadot, allowing developers to test and deploy early-stage features and projects in a live environment.',
      'With faster governance and lower barriers to entry, Kusama is ideal for experimental blockchain projects. Its native token, KSM, is used for staking, governance, and to secure parachains within its ecosystem.',
    ],
  },
  polkadot: {
    availability: 'live',
    fullName: 'Polkadot',
    shortName: 'DOT',
    icon: '/networks/Polkadot.svg',
    description: [
      'Polkadot is a scalable, interoperable blockchain platform designed to enable different blockchains to transfer messages, value, and data in a secure and trust-free environment.',
      'DOT is used for staking, voting on network changes, and buying coretime for parachains.',
    ],
  },
  bnb: {
    availability: 'live',
    fullName: 'BNB Chain',
    shortName: 'BNB',
    icon: '/networks/bnbchain.svg',
    description: [
      'BNB Chain, formerly Binance Smart Chain (BSC), is a high-performance blockchain supporting smart contracts and decentralized applications. It is compatible with Ethereum and known for low transaction fees and fast execution.',
      'BNB is the native token of BNB Chain, used for transaction fees, staking, and other network services, making it a crucial part of the Binance ecosystem.',
    ],
  },
  arbitrum: {
    availability: 'live',
    fullName: 'Arbitrum One',
    shortName: 'ETH',
    icon: '/networks/Arbitrum.svg',
    description: [
      'Arbitrum One is an Ethereum layer 2 network. You pay transaction fees in ETH. ARB holders can vote on governance proposals.',
    ],
  },
  sora: {
    availability: 'live',
    fullName: 'SORA',
    shortName: 'XOR',
    icon: '/networks/SORA.svg',
    description: [
      'SORA is a decentralized economic system and a blockchain network that enables parachain functionality within the Polkadot ecosystem. It focuses on decentralized finance (DeFi) and applications that use digital assets.',
      'XOR, SORA’s native token, is used for transaction fees, staking, and governance. The network also supports the decentralized exchange Polkaswap.',
    ],
  },
  nexus: {
    availability: 'gated',
    fullName: 'SORA Nexus',
    shortName: 'Nexus',
    testnetGuide: { href: '/taira-wallet', title: 'Explore Taira testnet' },
    icon: '/networks/SORA.svg',
    description: [
      'SORA Nexus is a network built on Hyperledger Iroha.',
    ],
  },
  taira: {
    availability: 'testnet',
    fullName: 'Taira Testnet',
    shortName: 'testnet XOR',
    icon: '/networks/SORA.svg',
    description: [
      'Taira is the public testnet for SORA Nexus. The Chrome extension shows your Taira balance and transaction history.',
    ],
  },
  avalanche: {
    availability: 'live',
    fullName: 'Avalanche',
    shortName: 'AVAX',
    icon: '/networks/Avalanche.svg',
    description: [
      'Avalanche is a high-performance blockchain platform that aims to offer scalable solutions with low transaction costs, supporting a wide array of decentralized applications (dApps) and financial primitives.',
      'AVAX, the native token of Avalanche, is used for securing the network via staking, paying for transaction fees, and governance, ensuring the network remains decentralized and adaptable.',
    ],
  },
  xlayer: {
    availability: 'live',
    fullName: 'X Layer',
    shortName: 'OKB',
    icon: '/networks/xlayerchain.svg',
    description: [
      'X Layer is a public blockchain launched by OKX. Its native token, OKB, pays transaction fees.',
    ],
  },
  kaia: {
    availability: 'live',
    fullName: 'Kaia',
    shortName: 'KAIA',
    icon: '/networks/kaia.svg',
    description: [
      'Kaia is a smart contract network formed by the merger of Klaytn and Finschia. Its native token, KAIA, pays transaction fees.',
    ],
  },
}

export default networks
