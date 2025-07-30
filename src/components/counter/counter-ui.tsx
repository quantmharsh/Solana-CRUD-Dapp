'use client'

import { Keypair, PublicKey } from '@solana/web3.js'
import { useMemo, useState } from 'react'
import { ExplorerLink } from '../cluster/cluster-ui'
import { useCounterProgram, useCounterProgramAccount } from './counter-data-access'
import { ellipsify } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'
import { useWallet } from '@solana/wallet-adapter-react'


 const{publicKey}=useWallet();

//Card to create journal entry
export function CounterCreate() {
 const {createEntry}=useCounterProgram();

 const [title , setTitle]=useState("");
 const[message , setMessage]=useState("");

 const isFormValid = title.trim()!=="" && message.trim()!=="";

 const handleSubmit=()=>{
  if(isFormValid && publicKey) {
    createEntry.mutateAsync({title , message , owner:publicKey}) ;
  }

 };
 if(!publicKey)
 {
  return<p>
    Connect Your wallet
  </p>
 }

 return (
  <div>
    <input
    placeholder='Title '
    value={title}
    onChange={(e)=>setTitle(e.target.value)}
    className='input input-bordered w-full max-w-xs'
    />
    <textarea
    placeholder='Message'
    value={message}
    onChange={(e)=>setMessage(e.target.value)}
    className='textarea textarea-bordered w-full max-w-xs'
    />
    <br/>
    <button
    onClick={ handleSubmit}
    disabled={createEntry.isPending || !isFormValid}
    className='btn btn-xs lg:btn-md btn-primary'
     
    >
      {createEntry.isPending  ? "Creating..." :"Create Journal "
       } 
      </button>

  </div>
 )


}

export function CounterList() {
  const { accounts, getProgramAccount } = useCounterProgram()

  if (getProgramAccount.isLoading) {
    return <span className="loading loading-spinner loading-lg"></span>
  }
  if (!getProgramAccount.data?.value) {
    return (
      <div className="alert alert-info flex justify-center">
        <span>Program account not found. Make sure you have deployed the program and are on the correct cluster.</span>
      </div>
    )
  }
  return (
    <div className={'space-y-6'}>
      {accounts.isLoading ? (
        <span className="loading loading-spinner loading-lg"></span>
      ) : accounts.data?.length ? (
        <div className="grid md:grid-cols-2 gap-4">
          {accounts.data?.map((account) => (
            <CounterCard key={account.publicKey.toString()} account={account.publicKey} />
          ))}
        </div>
      ) : (
        <div className="text-center">
          <h2 className={'text-2xl'}>No accounts</h2>
          No accounts found. Create one above to get started.
        </div>
      )}
    </div>
  )
}

function CounterCard({ account }: { account: PublicKey }) {
  const { accountQuery , updateEntry , deleteEntry} = useCounterProgramAccount({
    account,
  });
 
   const[message , setMessage]=useState("");
   const title = accountQuery.data?.title;
   const isFormValid= message.trim()!=="";

   const handleSubmit=()=>{
    if(publicKey && isFormValid && title)
    {
    updateEntry.mutateAsync({ title , message , owner:publicKey});
    }
   };
   if(!publicKey)
   {
    return <p>
      Connect your wallet 
    </p>
   }

   return accountQuery.isLoading?(
    <span className='loading loading-spinner loading-lg'/>
   ) :(
    <div className='card card-bordered border-base-300 border-4 text-neutral-content'>
      <div className='card-body items-center text-center'>
        <div className='space-y-6'>
<h2 className='card-title justify-center text-3xl cursor-pointer'
onClick={()=>accountQuery.refetch()}
>
{accountQuery.data?.title}
</h2>
<p>
  {accountQuery.data?.message}
</p>
<div className='card-actions justify-around'>
<textarea
 placeholder='update message here'
 value={message}
 onChange={(e)=>setMessage(e.target.value)}
 className='textarea textarea-bordered w-full max-w-xs'
/>

<button
className='btn btn-xs lg:btn-md btn-primary'
onClick={handleSubmit}
disabled={updateEntry.isPending || !isFormValid}
>
{updateEntry.isPending  ?"Updating...":"Update Journal Entry"}
</button>
</div>
        </div>

      </div>
      
    </div>
   )

 


 
}
