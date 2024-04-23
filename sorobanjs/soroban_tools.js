import { Keypair } from "@stellar/stellar-sdk";
import 'dotenv/config';
import { exe } from "./interfaces.js";

async function generateAccount() {
    const kp = Keypair.random();
    const secret = kp.secret();
    const pubKey = kp.publicKey();
    console.log('Secret: ', secret);
    console.log('Account: ', pubKey);
}

//generateAccount();

async function fundAccount() {
    try {
        const response = await fetch(`https://friendbot.stellar.org?addr=${encodeURIComponent(process.env.PUBLIC_KEY)}`);
        await response.json();
        console.log('Account Funded!');
    }
    catch (e) {
        console.log('ERROR: ', e);
    }
}

//fundAccount()

async function storeAccount(){
    try {
        exe(`export SOROBAN_SECRET_KEY=${process.env.SECRET}`);
        exe(`soroban keys add john --secret-key`);
        console.log('Keys Stored!!')
    }
    catch (e){
        console.log('error', e)
    }
}
//storeAccount()