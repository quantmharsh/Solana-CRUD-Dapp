#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

//NOTE: Smart contract on solana are Stateless .so All of the states are stored inside
//the Program Account
#[program]
pub mod counter {
    use super::*;
    
    pub fn create_journal_entry (ctx:Context<CreateEntry> , title:String) -> Result(<>)
    {

    }

    
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEntry<'info>{
    #[account(
        init , 
        seeds=[title.as_bytes() , owner.key().as_ref()],
        bump,
        space:8+JournalEntryState::INIT_SPACE,
        payer:owner,
    )]
    pub journal_entry: Account<'info , JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>
    pub system_program: Program<'info , System>,

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
