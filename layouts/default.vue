<template>
    <div>
      <Suspense>
        <template #default>
          <slot />
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </div>
</template>