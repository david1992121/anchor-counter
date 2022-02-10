import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { P0001 } from '../target/types/p0001';
import assert from 'assert';
const { SystemProgram } = anchor.web3;

describe('p0001', () => {

  // Configure the client to use the local cluster.
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.P0001 as Program<P0001>;
  let _baseAccount;

  it('Creates a counter', async () => {
    const baseAccount = anchor.web3.Keypair.generate();
    await program.rpc.create({
      accounts: {
        baseAccount: baseAccount.publicKey,
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [baseAccount],
    });
  
    // The account should have been created.
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.dir(account.count);

    console.log('Initial count: ', account.count.toString());
    assert.ok(account.count.toString() === "0");
    _baseAccount = baseAccount;
  });

  it('Increments a counter', async () => {
    const baseAccount = _baseAccount;
    await program.rpc.increment({
      accounts: {
        baseAccount: baseAccount.publicKey,
      },
    });
  
    const account = await program.account.baseAccount.fetch(
      baseAccount.publicKey
    );
    console.log('After increment: ', account.count.toString());
    assert.ok(account.count.toString() === "1");
  });
});
