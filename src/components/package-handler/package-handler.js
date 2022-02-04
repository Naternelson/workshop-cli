// const fs = require("fs-extra")
import fs from "fs-extra"
import path from "path"

export default class PackageHandler{
    filepath=null 
    data = {}
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
    async getData(){
        try{
            await this.checkpath()
            const rawData =  await fs.readFile(this.filepath)
            this.data = JSON.parse(rawData)
        } catch {
            await this.new(this._filepath)
        } finally {
            return this.data 
        }
    }
    async new(filepath){
        this.filepath = filepath ? filepath : this.filepath 
        if(!this.filepath) return 
        const data = JSON.stringify(this.data, null, 2)
        await fs.writeFile(filepath, data)
        return this 
    }
    async deleteFile(){
        if(!this.filepath) return
        try{
            await fs.rm(this.filepath, {recursive: true, force: true})
        } finally {
            this.data = {}
        }
    }
    async save(){
        await this.checkpath()
        const data = JSON.stringify(this.data, null, 2)
        await fs.writeFile(this.filepath, data)
    }
}
