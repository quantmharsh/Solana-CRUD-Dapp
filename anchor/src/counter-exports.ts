// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import CrudIDL from '../target/idl/crud.json'
import type { Crud } from 'anchor/target/types/crud' 

// Re-export the generated IDL and type
export { Crud, CrudIDL }

// The programId is imported from the program IDL.
export const COUNTER_PROGRAM_ID = new PublicKey(CrudIDL.address)

// This is a helper function to get the Counter Anchor program.
export function getCrudProgram(provider: AnchorProvider, address?: PublicKey): Program<Crud> {
  return new Program({ ...CrudIDL, address: address ? address.toBase58() : CrudIDL.address } as Crud, provider)
}

// This is a helper function to get the program ID for the Counter program depending on the cluster.
export function getCrudProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Counter program on devnet and testnet.
      //Program id gets updatd when we build and deploy smart contract 
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return COUNTER_PROGRAM_ID
  }
}
