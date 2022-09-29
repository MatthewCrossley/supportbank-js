import { lookupAccount } from "./accounts.js"

export const transactionHistory = []

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
    }

    apply(){
        this.from.balance = +((this.from.balance - this.amount).toFixed(2))
        this.to.balance = +((this.to.balance + this.amount).toFixed(2))
    }
}

export function newTransaction(date, from, to, amount, reference){
    let trans = new Transaction(date, from, to, amount, reference)
    trans.apply()
    transactionHistory.push(trans)
    return trans
}