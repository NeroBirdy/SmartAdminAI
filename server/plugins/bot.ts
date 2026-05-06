export default defineNitroPlugin(() => {
    import('../bot/index').then(m => m.startBot());
});