<template>
    <main class="relative isolate h-full min-h-screen">
        <img src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75" alt="" class="absolute inset-0 -z-10 h-full w-full object-cover object-center" />
        <div class="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
            <p class="text-base font-semibold leading-8 text-white">404</p>
            <h1 class="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">{{ $t('notFound') }}</h1>
            <p class="mt-4 text-base text-white/70 sm:mt-6">{{ $t('sorry') }}</p>
            <div class="mt-10 flex justify-center">
                <router-link to="/" class="text-sm font-semibold leading-7 text-white"><span aria-hidden="true">&larr;</span> {{ $t('return') }}</router-link>
            </div>
        </div>
    </main>
</template>

<script setup>

</script>

<style scoped>

</style>