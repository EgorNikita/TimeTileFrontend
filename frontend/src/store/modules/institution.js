import { defineStore } from 'pinia'
import { success, failure } from '@/utils/resultPattern'
import { fetchInstitutionById } from '@/services/institutionService.js'

const initialInstitution = () => ({
    id: null,
    title: null,
    address: null,
    phoneNumber: null,
    email: null,
    domain: null,
})

export const useInstitutionStore = defineStore('institution', {
    state: () => ({
        institution: initialInstitution(),
        loading: false,
        error: null,
    }),

    getters: {
        isLoaded: (state) => !!state.institution?.id,

        institutionAvatar: (state) => {
            // const guid = state.student?.avatarUrl; // this is just a GUID
            // if (!guid || guid.includes('undefined')) return null;
            // return `http://localhost:5282/files/${guid}`;
        }
    },

    actions: {
        async fetchInstitutionById(institutionId) {
            this.loading = true;
            this.error = null;

            const response = await fetchInstitutionById(institutionId);
            console.log('Institution fetch response:', response);

            if (response.isFailure) {
                this.institution = initialInstitution();
                this.error = response.error;
                this.loading = false;
                return failure(this.error);
            }

            this.institution = response.data;
            this.loading = false;
            return success(response.data);
        },

        clearInstitution() {
            this.student = initialInstitution()
            this.error = null
            this.loading = false
        },
    },
})