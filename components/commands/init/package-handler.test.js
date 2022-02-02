// import PackageHandler from "./package-handler"
// import path from "path"

const PackageHandler = require("./package-handler")
const path = require("path")

describe("package-handler", ()=>{
    const pkg = new PackageHandler(path.resolve(__dirname, "./package.json"))
    beforeEach(async ()=>{
        await pkg.new()
    })
    afterEach(async ()=>{
        await pkg.deleteFile()
    })

    it("should have an undefined default setting", async ()=>{
        const data = await pkg.data()
        expect(data.hello).toBeUndefined()

    })
})