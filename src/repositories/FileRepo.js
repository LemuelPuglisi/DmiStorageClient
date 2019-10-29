import Repository from "@/repositories/Repository"

const resource = "api/files"

export default {

    show: (id) => {
        return Repository.get(resource + "/" + id)
    }, 

    download: (id) => {
        let url = resource + "/" +  id + "/download"
        return Repository.get(url, {responseType: 'blob'}) 
    },  

    stream: (id) => {
        let url = resource + "/" +  id + "/stream"
        return Repository.get(url, {responseType: 'blob'}) 
    },  

}