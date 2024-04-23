import { exe, contractInt } from "./interfaces.js"
import { nativeToScVal } from "@stellar/stellar-sdk"

let contractAddress = 'CCCFRNUGELJS7ESWCL2O3T2LC6MH477WGZDIIUGIXCOBQCAN6RQQXZ3O'

const stringToSymbol = (value) => {
    return nativeToScVal(value, {type: "symbol"})
}

const numberToU64 = (value) => {
    return nativeToScVal(value, {type: "u64"})
}


async function readContractA() {
    try {
        let output = await exe(`soroban contract invoke --id ${contractAddress} --source-account john --network testnet -- hello --to net2dev`)
        console.log(output)
    }
    catch (e) {
        console.log('Error', e)
    }
}

//readContractA()

async function readContractB() {
    let to = stringToSymbol('net2dev');
    let values = [to]
    let result = await contractInt('hello', values);
    console.log((result._value[0]._value).toString());
    console.log((result._value[1]._value).toString());
}

readContractB()