import fs from "fs"
import log4js from "log4js"
import { xml2json } from "xml-js"

const logger = log4js.getLogger('io.js')

function readFile(file){
    logger.debug(`readFileSync on file "${file}"`)
    const contents = fs.readFileSync(file, {encoding: "utf8", flag: "r"})
    return contents
}

function readCSV(file){
    const contents = readFile(file)
    var data = []

    contents.split("\n").forEach((l) => {
        if (l !== ""){
            data.push(l.split(","))
        }
    })

    logger.debug(`read ${data.length} non-blank lines from "${file}"`)

    return data.splice(1)
}

function readJson(file){
    const contents = JSON.parse(readFile(file))
    const data = []
    contents.forEach((item) => {
        data.push([
            item["Date"],
            item["FromAccount"],
            item["ToAccount"],
            item["Narrative"],
            item["Amount"]
        ])
    })
    return data
}

function readXML(file){
    const contents = readFile(file)
    let json = JSON.parse(xml2json(contents, {compact: true}))
    let data = []

    for (let element of json["TransactionList"]["SupportTransaction"]){
        let date = new Date((element["_attributes"]["Date"] - (25567 + 2))*86400*1000)
        data.push([
            date,
            element["Parties"]["From"]["_text"],
            element["Parties"]["To"]["_text"],
            element["Value"]["_text"],
            element["Description"]["_text"]
        ])

    }

    return data
}

export function readTransactionFile(file){
    if (file.endsWith(".csv")){
        return readCSV(file)
    }
    if (file.endsWith(".json")){
        return readJson(file)
    }
    if (file.endsWith(".xml")){
        return readXML(file)
    }
}

export default readTransactionFile