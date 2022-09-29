import fs from "fs"

export function readCSV(file){
    const contents = fs.readFileSync(file, {encoding: "utf8", flag: "r"})
    var data = []

    contents.split("\n").forEach((l) => {
        if (l !== ""){
            data.push(l.split(","))
        }
    })

    return data.splice(1)
}

export default readCSV