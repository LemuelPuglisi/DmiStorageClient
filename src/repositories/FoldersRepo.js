import Repository from "@/repositories/Repository"

const resource = "api/folders"

export default {

    get: () => {
        return Repository.get(resource)
    }, 

    show: (id) => {
        return Repository.get(resource + "/" +  id) 
    },  

    user: (id) => {
        return Repository.get(resource + "/" + id + "/user")
    }, 

    files: (id) => {
        return Repository.get(resource + "/" + id + "/files")
    }, 

    subFolders: (id) => {
        return Repository.get(resource + "/" + id + "/subfolders")
    }

}