import { toast } from "react-toastify"

export const notifySucces = (text) => toast.success(text, {
        position: "top-right",
        autoClose: 2000,
        pauseOnHover: false,
        theme: "colored"
})

export const notifyError = (text) => toast.error(text, {
    position: "top-right",
    autoClose: 2000,
    pauseOnHover: false,
    theme: "colored"
})