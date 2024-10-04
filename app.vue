<template>
  <div>
    <NuxtPage />
  </div>
</template>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  overflow: hidden;
}

@supports (padding-top: env(safe-area-inset-top)) {
  body {
    padding-top: env(safe-area-inset-top);
    padding-bottom: env(safe-area-inset-bottom);
    padding-left: env(safe-area-inset-left);
    padding-right: env(safe-area-inset-right);
  }
}

/* For devices with notches */
@supports (padding-top: constant(safe-area-inset-top)) {
  body {
    padding-top: constant(safe-area-inset-top);
    padding-bottom: constant(safe-area-inset-bottom);
    padding-left: constant(safe-area-inset-left);
    padding-right: constant(safe-area-inset-right);
  }
}

/* Ensure content is not hidden behind the dynamic island */
.content {
  padding-top: max(env(safe-area-inset-top), 20px);
}
</style>
