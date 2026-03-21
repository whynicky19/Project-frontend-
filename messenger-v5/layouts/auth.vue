<template>
  <div class="auth-shell">
    <div class="auth-brand">
      <div class="auth-logo">M</div>
      <span class="auth-brand-name">Messenger</span>
    </div>
    <slot />
    <ToastContainer />
  </div>
</template>
<style scoped>
.auth-shell{min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#f9fafb;padding:24px;gap:32px}
.auth-brand{display:flex;align-items:center;gap:10px}
.auth-logo{width:36px;height:36px;background:var(--blue);border-radius:var(--r-lg);display:flex;align-items:center;justify-content:center;color:#fff;font-weight:700;font-size:16px}
.auth-brand-name{font-size:18px;font-weight:700;color:var(--text1)}
</style>