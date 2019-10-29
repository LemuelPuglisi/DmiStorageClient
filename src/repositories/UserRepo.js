import Repository from "@/repositories/Repository"

const resource = "api/user"

export default {

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
