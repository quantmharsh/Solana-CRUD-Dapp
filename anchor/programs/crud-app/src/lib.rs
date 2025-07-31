#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("HRLZVy1BHytKGkvAgzxA5GMq295xWMgTsrcTMZSnmp3f");

//NOTE: Smart contract on solana are Stateless .so All of the states are stored inside
//the Program Account
#[program]
pub mod counter {
    use super::*;
    
    pub fn create_journal_entry (ctx:Context<CreateEntry> , title:String , message:String ,) -> Result<()>
    {

          msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);
        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.title = title ;
        journal_entry.message=message;
        journal_entry.owner= ctx.accounts.owner.key();
       
        Ok(())
    }

    pub fn update_journal_entry (ctx:Context<UpdateEntry> , _title:String , message:String)-> Result<()>{
        let journal_entry=&mut ctx.accounts.journal_entry;

        
        journal_entry.message=message;
        Ok(())
    }

    pub fn delete_journal_entry(_ctx:Context<DeleteEntry> , title:String ) -> Result<()>{
        msg!("Journal entry titled {} deleted", title);
        Ok(())
    }

    
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct CreateEntry<'info>{
    #[account(
        init , 
        seeds=[title.as_bytes() , owner.key().as_ref()],
        bump,
        space=8+JournalEntryState::INIT_SPACE ,
        payer=owner,
    )]
    pub journal_entry: Account<'info , JournalEntryState>,

    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info , System>,

}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct UpdateEntry<'info>{

    #[account(mut,
    seeds=[title.as_bytes() , owner.key().as_ref()],
    bump,
    // "Hey, resize the account journal_entry to this new size."
    realloc=8+JournalEntryState::INIT_SPACE,
    // Solana requires someone to pay for the increased space (in lamports).
    realloc::payer=owner,
//     //This tells Anchor to zero out the reallocated bytes (clear old data beyond original size).
// It’s a security best practice to avoid leaking data.
    realloc::zero=true,
    )]
    pub journal_entry:Account<'info , JournalEntryState>,
    #[account(mut)]
    pub owner:Signer<'info>,
    pub system_program:Program<'info , System>,
}

#[derive(Accounts)]
#[instruction(title:String)]
pub struct DeleteEntry<'info>{
    #[account(
        mut , 
        seeds=[title.as_bytes() , owner.key().as_ref()],
        bump,
        //this account with particular seed will be closed(or deleted) just by pub key of owner who created it .
        close=owner,

    )] 
    pub journal_entry:Account<'info,JournalEntryState> ,
    #[account(mut)]
    pub owner:Signer<'info> ,
    pub system_program:Program<'info, System>,

}

#[account]
#[derive(InitSpace)]
pub struct JournalEntryState{
    pub owner: Pubkey  ,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String ,
}
