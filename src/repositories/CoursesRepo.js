import Repository from "@/repositories/Repository"

const resource = "api/courses"

export default {

    get: () => {
        return Repository.get(resource)
    },

    show: (id) => {
        return Repository.get(resource + "/" +  id) 
    },  

    getFolders: (id) => {
        return Repository.get(resource + "/" + id + "/folders")
    }
}