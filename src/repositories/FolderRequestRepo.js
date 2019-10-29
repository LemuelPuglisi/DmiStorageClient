import Repository from "@/repositories/Repository"

const resource = "api/folders/requests"

export default {

    store: (token, data) => {
        let form = {
            folder_id: data.folderId, 
            permissions: data.permissions, 
            notes: data.notes, 
            lifespan: data.lifespan
        }
        let headers = {
            headers: {'Authorization': `Bearer ${token}`},
        }
        return Repository.post(resource, form, headers)
    }

}

