import { Account, lookupAccount } from "./accounts.js"
import log4js from "log4js"

const logger = log4js.getLogger("transactions.js")

export const transactionHistory = []

class InvalidTransaction extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}

class Transaction {
    constructor(date, from, to, amount, reference) {
        this.date = date
        if (typeof(from) === String){
            this.from = lookupAccount(from)
        } else {
            this.from = from
        }
        if (typeof(to) === String){
            this.to = lookupAccount(to)
        } else {
            this.to = to
        }
        this.amount = parseFloat(amount)
        this.reference = reference

        this.validate()
    }

    validate(){
        let err_message = ""
        if (! this.from instanceof Account){
            err_message += "invalid sender account"
        } else if (! this.to instanceof Account){
            err_message += "invalid recipient account"
        } else if (isNaN(this.amount)){
            err_message += `invalid transaction amount - "${this.amount}" is NaN`
        }

        if (err_message !== ""){
            throw new InvalidTransaction(err_message)
        }
    }

    apply(){
        this.from.balance = +((this.from.balance - this.amount).toFixed(2))
        this.to.balance = +((this.to.balance + this.amount).toFixed(2))
    }

    toString(){
        return `${this.date} || ${this.amount} = ${this.from.name} -> ${this.to.name}: ${this.reference}`
    }
}

export function newTransaction(date, from, to, amount, reference){
    let trans = new Transaction(date, from, to, amount, reference)
    trans.apply()
    transactionHistory.push(trans)
    logger.debug(`new transaction: ${trans.toString()}`)
    return trans
}
