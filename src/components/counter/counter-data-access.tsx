'use client'

import { getCrudProgram, getCrudProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../use-transaction-toast'
import { toast } from 'sonner'

interface CreateEntryArgs{
  title:string ;
  message:string;
  owner:PublicKey;
}

// using this function to write all  apis where we need to create accounts 
export function useCounterProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getCrudProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getCrudProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['counter', 'all', { cluster }],
    queryFn: () => program.account.journalEntryState.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  // const initialize = useMutation({
  //   mutationKey: ['counter', 'initialize', { cluster }],
  //   mutationFn: (keypair: Keypair) =>
  //     program.methods.initialize().accounts({ counter: keypair.publicKey }).signers([keypair]).rpc(),
  //   onSuccess: async (signature) => {
  //     transactionToast(signature)
  //     await accounts.refetch()
  //   },
  //   onError: () => {
  //     toast.error('Failed to initialize account')
  //   },
  // })
//Mutation fn to create  journal entry
  const  createEntry = useMutation<string , Error , CreateEntryArgs>({
    mutationKey:["journalEntry" , "create" , {
      cluster
    }] ,
    mutationFn:async({title , message , owner})=>{
      // just verifying the PDA client-side matches what the program expects — it ensures correctness.
      const[journalEntryAddress] =await PublicKey.findProgramAddressSync([Buffer.from(title) , owner.toBuffer()] ,
    programId)
      return  program.methods.createJournalEntry(title , message).rpc();
    },
    onSuccess:(signature)=>{
      transactionToast(signature);
      accounts.refetch();
    },
    onError:(error)=>{
      toast.error(`Failed to create journal Entry`)
    }
  })

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    createEntry
    // initialize,
  }
}
//used for manipulating the existing accounts on solana  blockchain 
export function useCounterProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useCounterProgram()

  const accountQuery = useQuery({
    queryKey: ['counter', 'fetch', { cluster, account }],
    queryFn: () => program.account.journalEntryState.fetch(account),
  })


  
  return {
    accountQuery,
    
  }
}
