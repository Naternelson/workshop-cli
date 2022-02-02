import PackageHandler from "./package-handler"
import path from "path"

describe("package-handler", ()=>{
    const pkg = new PackageHandler(path.resolve(import.meta.url, "./package.json"))
    it("should create or return an object given a filepath to a json file", async ()=>{
        const data = await pkg.data()
        expect(data.hello).toBe("world")
    })
})