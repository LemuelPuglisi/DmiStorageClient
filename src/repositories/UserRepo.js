import Repository from "@/repositories/Repository"

const resource = "api/user"
const _resource = "api/users"

export default {

    get: (token) => {
        return Repository.get(_resource, {
            headers: {'Authorization': `Bearer ${token}`}
        })
    }, 

    getCoursesRequests: (id, token) => {
        return Repository.get(resource + "/" + id + "/courses/requests", {
            headers: {'Authorization': `Bearer ${token}`}
        })
    }, 

    getCoursesRequestsByStatus: (id, token, status) => {
        return Repository.get(resource + "/" + id + "/courses/requests?status=" + status, {
            headers: {'Authorization': `Bearer ${token}`}
        })
    }

}
