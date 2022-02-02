const fs = require("fs-extra")
module.exports = class PackageHandler{
    filepath=null 
    _data = {}
    constructor(filepath){
        this.filepath = filepath
    }
    async checkpath(){
        try{
            await fs.access(this.filepath)
        } catch {
            console.error(`${this.filepath} is not correct or does not have access rights`)
        }
    }
    async data(){
        try{
            await this.checkpath()
            const rawData =  await fs.readFile(this.filepath)
            this._data = JSON.parse(rawData)
        } catch {
            await this.new(this._filepath)
        } finally {
            return this._data 
        }
    }
    async new(filepath){
        
        this.filepath = filepath ? filepath : this._filepath 
        if(!this.filepath) return 
        
        const data = JSON.stringify(this._data, null, 2)
        console.log(filepath)
        await fs.writeFile(filepath, data)
        return this 
    }
    async deleteFile(){
        if(!this.filepath) return
        try{
            await fs.rm(this.filepath, {recursive: true, force: true})
        } finally {
            this._data = {}
        }
    }
    async save(){
        await this.checkpath()
        const data = JSON.stringify(this._data, null, 2)
        await fs.writeFile(this.filepath, data)
    }
}