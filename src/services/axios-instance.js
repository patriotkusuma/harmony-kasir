import axios from "axios";

const instance = axios.create({
    // baseURL: "https://harmony.test/api/",
    // baseURL: "https://admin.harmonylaundry.my.id/api/",
    baseURL: "https://api.harmonylaundry.my.id/",
    // baseURL: "https://dashboard.harmonylaundry.my.id/api/",
    // baseURL: "https://admin.jutra.my.id/api/",
    // baseURL: "https://silaundry.my.id/api/",
    // timeout: 1000,
})

export default instance;