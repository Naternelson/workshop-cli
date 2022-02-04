// const fs = require("fs-extra")
import fs from "fs-extra"
import path from "path"

export default class PackageHandler{
    filepath=null 
    data = {}
    constructor(filepath){
        this.filepath = filepath
    }
    async getData(){
        try{
            await fs.access(this.filepath)
            const rawData =  await fs.readFile(this.filepath)
            this.data = JSON.parse(rawData)
        } catch {
            await this.new(this.filepath)
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
        try{
            await fs.access(this.filepath)
            const data = JSON.stringify(this.data, null, 2)
            await fs.writeFile(this.filepath, data)
        } catch {
            await this.new(this.filepath)
        }
        
        
    }
}
