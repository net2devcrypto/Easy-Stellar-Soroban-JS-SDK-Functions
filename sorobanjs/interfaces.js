import { promisify } from "util";
import { exec } from "child_process";
import 'dotenv/config';
import { Contract, SorobanRpc, TransactionBuilder, Networks,
    BASE_FEE, 
    Keypair } from "@stellar/stellar-sdk";
const execute = promisify(exec);

async function exe(command) {
    let { stdout } = await execute(command, { stdio: "inherit" });
    return stdout;
};

let rpcUrl = "https://soroban-testnet.stellar.org"

let contractAddress = 'CCCFRNUGELJS7ESWCL2O3T2LC6MH477WGZDIIUGIXCOBQCAN6RQQXZ3O'
//let contractAddress = 'CCYZ6YOAPTK4LDC45TXAGPJTFKHY6M6RKY4AXK3NHNTQB7W6FNNVKPHZ'

let params = {
    fee: BASE_FEE,
    networkPassphrase: Networks.TESTNET
}

async function contractInt(functName, values) {
    const kp = Keypair.fromSecret(process.env.SECRET);
    const caller = kp.publicKey();
    const provider = new SorobanRpc.Server(rpcUrl, { allowHttp: true });
    const sourceAccount = await provider.getAccount(caller);
    const contract = new Contract(contractAddress);
    let buildTx = new TransactionBuilder(sourceAccount, params)
        .addOperation(contract.call(functName, ...values))
        .setTimeout(30)
        .build();
    let prepareTx = await provider.prepareTransaction(buildTx);
    prepareTx.sign(kp);
    try {
        let sendTx = await provider.sendTransaction(prepareTx).catch(function (err) {
            return err;
        });
        if (sendTx.errorResult) {
            throw new Error("Unable to submit transaction");
        }
        if (sendTx.status === "PENDING") {
            let txResponse = await provider.getTransaction(sendTx.hash);
            while (txResponse.status === "NOT_FOUND") {
                txResponse = await provider.getTransaction(sendTx.hash);
                await new Promise((resolve) => setTimeout(resolve, 100));
            }
            if (txResponse.status === "SUCCESS") {
                let result = txResponse.returnValue;
                return result;
            }
        }
    } catch (err) {
        return err;
    }
}


export { exe, contractInt };