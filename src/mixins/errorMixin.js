export default {
    data: function() {
            return {
                currentError: {}, 
            }
    },
    methods : {

        isObject(val) {
            if (val === null) { return false;}
            return ( (typeof val === 'function') || (typeof val === 'object') );
        }, 

        handleError(error) 
        {
            let networkError = (error.response.data.message || 0) == '';
            if (error.response == null || networkError) {
                if (error == this.currentError) return 
                this.generateToast(error)
                this.currentError = error
            }
            else if (error.response.data.error != null && !this.isObject(error.response.data.error)) {
                if (error.response.data.error == this.currentError) return 
                this.generateToastWithCode(error.response.status, error.response.data.error)
                this.currentError = error.response.data.error
            }
            else if (error.response.data.error != null) {
                this.handleAnArrayofErrors(error)
            }
            else if (error.response.data.message != null) {
                if (error.response.data.message == this.currentError) return 
                this.generateToastWithCode(error.response.status, error.response.data.message)
                this.currentError = error.response.data.message
            }
        }, 

        showError(error)
        {
            if (!error.response) {
                this.generateToast(error)
            }
            else if (error.response.data.error && !this.isObject(error.response.data.error)) {
                this.generateToastWithCode(error.response.status, error.response.data.error)
            }
            else if (error.response.data.error || error.response.data.errors) {
                this.handleAnArrayofErrors(error)
            }
            else if (error.response.data.message) {
                this.generateToastWithCode(error.response.status, error.response.data.message)
            }
        }, 


        generateToast(message) {
            M.toast({
                html: message, 
                completeCallback:() => { 
                    this.toastEnabled = false; 
                }, 
                classes: "red"
            });   
        },

        generateToastWithCode(code, message) {
            M.toast({
                html: code + " code: " + message, 
                completeCallback: () => {
                    this.toastEnabled = false;
                }, 
                classes: "red"
            })
        },

        handleAnArrayofErrors(error) 
        {
            let text = ""
            let errors = null 
            if (error.response.data.error) {
                errors = Object.entries(error.response.data.error)
            }
            else {
                errors = Object.entries(error.response.data.errors)
            }          
            errors.forEach(element => {
                element[1].forEach(message => {
                    text += message + " <br/>"
                })
            });
            M.toast({
                html: error.response.status + " code, errors: <br/>" + text, 
                completeCallback: () => {
                    this.toastEnabled = false;
                }, 
                classes: "red"
            })   
        }
        
    }
}
