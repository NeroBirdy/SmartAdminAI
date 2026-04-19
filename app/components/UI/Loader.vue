<template>
  <div class="preloader-wrapper">
    <svg
      class="preloader"
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 128 128"
    >
      <g>
        <path
          d="M75.4 126.63a11.43 11.43 0 0 1-2.1-22.65 40.9 40.9 0 0 0 30.5-30.6 11.4 11.4 0 1 1 22.27 4.87h.02a63.77 63.77 0 0 1-47.8 48.05v-.02a11.38 11.38 0 0 1-2.93.37z"
          fill="currentColor"
        />
      </g>
    </svg>
  </div>
</template>

<style scoped>
.preloader-wrapper {
  display: flex;
  justify-content: center;
}
.preloader {
  width: 48px;
  height: 48px;
  top: 10px;
  color: #5ea3f8;
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
