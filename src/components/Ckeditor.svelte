<script>
    import { onMount } from 'svelte';

    let editor;
    export let notes = '';

    onMount(async () => {
        const { default: Quill } = await import('quill');
    
        let quill = new Quill(editor, {
            modules: {
                toolbar: true,
            },
            theme: 'snow',
            placeholder: 'Tulis keterangan...'
        });
    });
</script>

<style>
    @import 'https://cdn.quilljs.com/1.3.6/quill.snow.css';

    #editor {
        height: 200px;
    }
</style>

<div class="editor-wrapper mt-2 bg-white">
    <div
        bind:this={editor}
        id="editor"
        class="text-black"
        on:input={(e) => {
            notes = e.target.innerHTML;
        }}
    />
</div>