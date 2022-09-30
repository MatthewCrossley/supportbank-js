import { transactionHistory } from "./transactions.js"
import log4js from "log4js"

const logger = log4js.getLogger('accounts.js')

export var accounts = {}

export class Account {
    constructor(name) {
        this.name = name
        this.balance = 0.0
    }

    getHistory(){
        let history = []
        for (let trans of transactionHistory){
            if (trans.from === this){
                history.push(trans)
            } else if (trans.to === this){
                history.push(trans)
            }
        }
        return history
    }

    toString(history=false){
        let base = `Name: ${this.name}\t\tBalance: £${this.balance}`
        if (history === false){
            return base
        }
        for (let trans of this.getHistory()){
            base += "\n\t" + trans.toString()
        }
        return base
    }
}

export function lookupAccount(name){
    if (! (name in accounts)){
        logger.debug(`account of name "${name}" not found in accounts`)
        return false
    }
    logger.debug(`lookup account of name "${name}" successful`)
    return accounts[name]
}

export function createAccount(name){
    if (lookupAccount(name) !== false){
        logger.debug(`account name "${name}" already exists`)
        return lookupAccount(name)
    }

    let acc = new Account(name)
    accounts[name] = acc
    logger.debug(`created account under name "${name}"`)
    return acc
}

export default accounts;