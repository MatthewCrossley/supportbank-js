import { transactionHistory } from "./transactions.js"

export var accounts = {}

class Account {
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
            let str = "\n\t"
            if (trans.from === this){
                str += `Sent £${trans.amount} to ${trans.to.name}`
            } else {
                str += `Received £${trans.amount} from ${trans.from.name}`
            }
            str += `, reference: ${trans.reference}`
            base += str
        }
        return base
    }
}

export function lookupAccount(name){
    if (! (name in accounts)){
        return false
    }
    return accounts[name]
}

export function createAccount(name){
    if (lookupAccount(name) !== false){
        return lookupAccount(name)
    }

    let acc = new Account(name)
    accounts[name] = acc
    return acc
}

export default accounts;