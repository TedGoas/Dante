<template>
    <div class="theme-toggle">
        <p v-if="mode === 'dark'" @click="toggle('sepia')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-moon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg></p>
        <p v-if="mode === 'sepia'" @click="toggle('light')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-coffee"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg></p>
        <p v-if="mode === 'light'" @click="toggle('dark')"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-sun"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg></p>
    </div>
</template>

<script>
export default {
    data: () => {
        return {
            mode: 'light'
        }
    },
    created() {
        const htmlElement = document.documentElement;
        const mode = localStorage.getItem("theme");
        if (mode) {
            this.mode = mode;
            htmlElement.setAttribute("theme", mode);
        }
    },
    methods: {
        toggle(mode) {
            this.mode = mode;
            const htmlElement = document.documentElement;
            htmlElement.setAttribute("theme", mode);
            localStorage.setItem("theme", mode);
        }
    }
    
}
</script>

<style lang="scss">
    .theme-toggle {
        margin-top:12px;
        svg {
            &:hover {
                color:rgb(32, 201, 151);
                cursor: pointer;
                transition: .4s ease all;
            }
        }
    }
</style>