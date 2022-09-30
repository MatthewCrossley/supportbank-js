import { readCSV } from "./csv.js"
import { createAccount, accounts, lookupAccount } from "./accounts.js"
import { newTransaction } from "./transactions.js"
import log4js from "log4js"

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
    let data = readCSV(file)

    for (var entry of data){
        let date = entry[0]
        let from = createAccount(entry[1])
        let to = createAccount(entry[2])
        let reference = entry[3]
        let amount = entry[4]

        try {
            newTransaction(date, from, to, amount, reference)
        } catch (err) {
            logger.error("error thrown when applying transaction")
            logger.error(err)
        }
    }
}

function main(){
    const files = ["Transactions2014.csv", "DodgyTransactions2015.csv"]
    for (let file of files){
        loadFromFile(`transactions/${file}`)
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