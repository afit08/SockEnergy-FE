<script>
  import { createEventDispatcher } from "svelte";
  import { page } from "$app/stores";
  export let currentPage;
  export let totalPages;

  const dispatch = createEventDispatcher();

  const handleClick = (page) => {
    currentPage = page;
    dispatch("currentPageChange", currentPage);
  };
</script>

{#if $page.url.pathname.includes("/user")}
  <div class="pagination flex justify-center">
    <button
      class="pagination__button pagination__prev"
      disabled={currentPage === 1}
      on:click={() => handleClick(currentPage - 1)}
    >
      Previous
    </button>

    <button
      class="pagination__button {currentPage === 1
        ? 'pagination__button--active'
        : ''} {totalPages === 1 || totalPages === 0 ? 'd-none' : ''}"
      disabled={currentPage === 1}
      on:click={() => handleClick(1)}
    >
      1
    </button>

    {#if currentPage > 3}
      <button class="pagination__button">
        <span class="pagination__ellipsis">...</span>
      </button>
    {/if}

    {#each Array.from({ length: totalPages - 2 }, (_, i) => i + 2) as page}
      {#if currentPage === page}
        <button
          class="pagination__button pagination__button--active"
          on:click={() => handleClick(page)}
        >
          {page}
        </button>
      {:else if Math.abs(currentPage - page) < 2}
        <button class="pagination__button" on:click={() => handleClick(page)}>
          {page}
        </button>
      {/if}
    {/each}

    {#if currentPage < totalPages - 2}
      <div />
      <button class="pagination__button">
        <span class="pagination__ellipsis">...</span>
      </button>
    {/if}

    <button
      class="pagination__button {currentPage === totalPages
        ? 'pagination__button--active'
        : ''}"
      disabled={currentPage === totalPages}
      on:click={() => handleClick(totalPages)}
    >
      {totalPages}
    </button>

    <button
      class="pagination__next pagination__button"
      disabled={currentPage === totalPages}
      on:click={() => handleClick(currentPage + 1)}
    >
      Next
    </button>
  </div>
{:else}
  <div class="pagination flex justify-end">
    <button
      class="pagination__button pagination__prev"
      disabled={currentPage === 1}
      on:click={() => handleClick(currentPage - 1)}
    >
      Previous
    </button>

    <button
      class="pagination__button {currentPage === 1
        ? 'pagination__button--active'
        : ''} {totalPages === 1 || totalPages === 0 ? 'd-none' : ''}"
      disabled={currentPage === 1}
      on:click={() => handleClick(1)}
    >
      1
    </button>

    {#if currentPage > 3}
      <button class="pagination__button">
        <span class="pagination__ellipsis">...</span>
      </button>
    {/if}

    {#each Array.from({ length: totalPages - 2 }, (_, i) => i + 2) as page}
      {#if currentPage === page}
        <button
          class="pagination__button pagination__button--active"
          on:click={() => handleClick(page)}
        >
          {page}
        </button>
      {:else if Math.abs(currentPage - page) < 2}
        <button class="pagination__button" on:click={() => handleClick(page)}>
          {page}
        </button>
      {/if}
    {/each}

    {#if currentPage < totalPages - 2}
      <div />
      <button class="pagination__button">
        <span class="pagination__ellipsis">...</span>
      </button>
    {/if}

    <button
      class="pagination__button {currentPage === totalPages
        ? 'pagination__button--active'
        : ''}"
      disabled={currentPage === totalPages}
      on:click={() => handleClick(totalPages)}
    >
      {totalPages}
    </button>

    <button
      class="pagination__next pagination__button"
      disabled={currentPage === totalPages}
      on:click={() => handleClick(currentPage + 1)}
    >
      Next
    </button>
  </div>
{/if}

<style>
  /* .pagination {
		display: flex;
		justify-content: end;
		margin: 0.2rem 0;
	} */

  .pagination__button {
    border: 1px solid #000;
    color: #000;
    cursor: pointer;
    font-size: 0.85rem;
    padding: 0.4rem 0.5rem;
    background: #fff;
  }

  .pagination__next {
    font-size: 0.77rem !important;
    background: #fff;
    border: solid 1px #000;
    border-radius: 0px 2px 2px 0px;
  }

  .pagination__prev {
    /* background: #000;
		border-radius: 2px 0px 0px 2px;
		color: #fff; */
    font-size: 0.77rem !important;
    background: #fff;
    border: solid 1px #000;
    border-radius: 2px 0px 0px 2px;
  }

  :is(.pagination__prev, .pagination__next):disabled {
    cursor: default;
  }

  .pagination__button--active {
    background-color: #000;
    color: #fff;
    padding: 0.3rem 0.7rem;
  }

  .pagination__ellipsis {
    color: #000;
  }
</style>
