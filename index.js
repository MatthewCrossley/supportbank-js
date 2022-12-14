import { readTransactionFile } from "./io.js"
import { createAccount, accounts, lookupAccount } from "./accounts.js"
import { applyTransactions, newTransaction } from "./transactions.js"
import log4js from "log4js"
import fs from "fs"

log4js.configure({
    appenders: {
        file: { type: 'fileSync', filename: 'logs/debug.log' }
    },
    categories: {
        default: { appenders: ['file'], level: 'debug'}
    }
});

const logger = log4js.getLogger("index.js")

function loadFromFile(file){
    let data = readTransactionFile(file)

    for (var entry of data){
        let date = entry[0]
        let from = createAccount(entry[1])
        let to = createAccount(entry[2])
        let reference = entry[3]
        let amount = entry[4]

        try {
            newTransaction(date, from, to, amount, reference)
        } catch (err) {
            logger.error("error thrown when creating transaction")
            logger.error(err)
        }
    }

    applyTransactions()
}

function main(){
    for (let file of fs.readdirSync("transactions")){
        loadFromFile("transactions/" + file)
    }

    let args = process.argv.splice(2)

    if (args[0] === "list"){
        if (args.length === 1){
            for (let acc of Object.values(accounts)){
                console.log(acc.toString())
            }
        } else {
            let account = lookupAccount(args.splice(1).join(" "))
            if (account !== false){
                console.log(account.toString({history: true}))
            } else {
                console.log("Account does not exist")
            }
        }
    }
}

main()