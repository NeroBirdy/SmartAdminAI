<template>
  <div class="main">
    <NuxtLayout name="header"> </NuxtLayout>
    <div class="content">
      <NuxtLayout name="side-bar"> </NuxtLayout>
      <div class="center">
        <div class="title">
          <div class="title-left">
            <h1 class="header-lg title-text">Управление расписанием</h1>
          </div>
        </div>
        <Shredule />
      </div>
    </div>
  </div>
</template>
