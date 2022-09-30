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


function loadFromFile(file){
    let data = readCSV(file)

    for (var entry of data){
        let date = entry[0]
        let from = createAccount(entry[1])
        let to = createAccount(entry[2])
        let reference = entry[3]
        let amount = entry[4]

        newTransaction(date, from, to, amount, reference)
    }
}

function main(){
    loadFromFile("Transactions2014.csv")

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