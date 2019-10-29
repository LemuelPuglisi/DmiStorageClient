import Repository from "@/repositories/Repository"

const resource = "api/auth"

export default {

    create: (data) => {
        return Repository.post(resource + "/signup", {
            name: data.name, 
            email: data.email, 
            password: data.password
        }) 
    }, 

    forgot: (email) => {
        return Repository.post(resource + "/forgot", {
            email: email
        })
    }, 

    reset: (data) => {
        return Repository.post(resource + "/reset", {
            email: data.email, 
            token: data.token, 
            password: data.password, 
            password_confirmation: data.confirm
        })
    }, 

    logout: (id, token) => {

        return Repository.delete("api/user/" + id + "/revoke", {
            headers: {'Authorization': `Bearer ${token}`}
        })
    }

}

