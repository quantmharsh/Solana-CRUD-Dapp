#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

//NOTE: Smart contract on solana are Stateless .so All of the states are stored inside
//the Program Account
#[program]
pub mod counter {
    use super::*;

    
}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
    pub owner: PubKey  ,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String ,
}
