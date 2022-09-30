import fs from "fs"
import log4js from "log4js"

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

export function readTransactionFile(file){
    if (file.endsWith(".csv")){
        return readCSV(file)
    }
    if (file.endsWith(".json")){
        return readJson(file)
    }
}

export default readTransactionFile