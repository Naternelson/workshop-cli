import fs from "fs-extra"
export default class PackageHandler{
    filepath=null 
    _data = {}
    constructor(filepath){
        this.filepath = filepath
    }
    async checkpath(){
        try{
            await fs.access(this.filepath)
        } catch {
            console.error(`${filepath} is not correct or does not have access rights`)
        }
    }
    async data(){
        await this.checkpath()
        const rawData =  await fs.readFile(filepath)
        this._data = JSON.parse(rawData)
        return this._data
    }
    async save(){
        await this.checkpath()
        const data = JSON.stringify(this._data, null, 2)
        await fs.writeFile(this.filepath, data)
    }
}