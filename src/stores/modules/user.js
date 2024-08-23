import { defineStore } from 'pinia'
import axios from '/src/services/axios.js'
import { computed, reactive } from 'vue'

export const useUserStore = defineStore('userStore', () => {
    const state = reactive({
        accessToken: localStorage.getItem('accessToken'),
        refreshToken: localStorage.getItem('refreshToken'),

        user: {
            id: null,
            email: null,
            roles: []
        },

        isUniqueEmail: null,
        password: localStorage.getItem('password'),
        isAvailableResetToken: null
    })

    const fetchToken = (data) =>
        axios.post('/users/auth', data).then((res) => {
            state.accessToken = res.data.accessToken
            state.refreshToken = res.data.refreshToken
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
        })

    function clearToken() {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')

        state.accessToken = localStorage.getItem('accessToken')
        state.refreshToken = localStorage.getItem('refreshToken')
    }

    const refreshToken = (data) =>
        axios.post('/users/auth/refreshToken', { refreshToken: data }).then((res) => {
            state.accessToken = res.data.accessToken
            state.refreshToken = res.data.refreshToken
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
        })

    const fetchAboutMe = () => axios.post('/users/about_me', {}).then((res) => (state.user = res.data))
    const pushUser = async (data) => await axios.post('/users/new_password', data)
    const fetchIsUniqueEmail = (data) =>
        axios.post('/users/is_unique_email', data).then((res) => (state.isUniqueEmail = res.data.isUnique))
    const changeUser = (data) => axios.put('/users/' + data.id, data)

    const changePassword = (data) => axios.put('/users/' + data.id + '/password', data)

    const savePassword = (password) => {
        localStorage.setItem('password', password)
        state.password = password
    }

    const requestToResetPassword = async (data) => await axios.post('/users/request_to_reset_password', data)

    const checkResetToken = async (data) =>
        await axios.post('/users/check_resetToken', data)
            .then((res) => state.isAvailableResetToken = res.data.isAvailable)

    const resetPassword = async (data) => await axios.post('/users/reset_password', data)

    return {
        fetchToken,
        clearToken,
        refreshToken,
        fetchAboutMe,
        pushUser,
        fetchIsUniqueEmail,
        changeUser,
        changePassword,
        savePassword,
        requestToResetPassword,
        checkResetToken,
        resetPassword,
        getAccessToken: computed(() => state.accessToken),
        getRefreshToken: computed(() => state.refreshToken),
        isAuthorized: computed(() => state.accessToken !== null),
        getUser: computed(() => state.user),
        getIsUniqueEmail: computed(() => state.isUniqueEmail),
        getPassword: computed(() => state.password),
        isAdmin: computed(() => state.user.roles.includes('ROLE_ADMIN')),
        isAvailableResetToken: computed(() => state.isAvailableResetToken)
    }
})
