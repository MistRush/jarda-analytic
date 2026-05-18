<script setup>

</script>

<template>
    <div class="table-wrapper jolanda-table">
        <table>
            <slot></slot>
        </table>
    </div>
</template>

<style scoped>
    .table-wrapper{
        position: relative;
        overflow-x: auto;
        border-radius: 10px;
        box-shadow: 0px 4px 44px 0px rgba(9, 19, 37, 0.10);
    }

    table{
        width: 100%;
        border-collapse: collapse;
        text-align: left;
    }
</style>

<style>
  .dark-theme{
    thead{
      tr{
        background: var(--color-dark);
      }
    }

    tbody{
      tr{
        &:nth-child(odd){
          background: var(--color-nav) !important;
        }
      }

      td{
        border-color: color-mix(in srgb, var(--color-light) 30%, transparent);
      }
    }
  }
</style>