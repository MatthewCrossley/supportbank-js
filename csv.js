import fs from "fs"
import log4js from "log4js"

const logger = log4js.getLogger('csv.js')

export function readCSV(file){
    logger.debug(`readFileSync on file "${file}"`)
    const contents = fs.readFileSync(file, {encoding: "utf8", flag: "r"})
    var data = []

    contents.split("\n").forEach((l) => {
        if (l !== ""){
            data.push(l.split(","))
        }
    })

    logger.debug(`read ${data.length} non-blank lines from "${file}"`)

    return data.splice(1)
}

export default readCSV