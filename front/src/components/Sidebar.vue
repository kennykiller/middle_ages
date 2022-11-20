<script setup lang="ts">
const navigationList = [
    { label: 'Сейчас на экранах', class: 'now', link: '/'},
    { label: 'Расписание', class: '', link: '/schedule' },
    { label: 'Анонсы', class: 'upcoming', link: 'upcoming' },
    { class: 'news', label: 'Новости кино', link: 'news' },
    { label:'Контакты', class: 'contacts', link: 'contacts' }
]
</script>

<template>
    <div class="sidebar__wrapper">
        <nav class="menu">
            <div class="menu__burger burger">
                <div class="burger__content"></div>
            </div>
            <ul class="menu__list list">
                <li v-for="(item, idx) of navigationList" :key="idx" class="list__item">
                    <router-link :to="item.link"><span :class="item.class">{{ item.label }}</span></router-link>
                    <div></div>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style lang="scss" scoped>
@import '../assets/styles/vars.scss';
.sidebar__wrapper {
    position: relative;
    min-height: 100vh;
    min-width: 7rem;
    max-width: 7rem;
}
.menu {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: $black-color;
    height: 100%;
    width: 100%;
}
.burger {
    width: 100%;
    height: 5rem;
    background-color: $yellow-color;
    position: relative;
    &__content, &__content::before, &__content::after {
        width: 2rem;
        height: 5px;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        content: '';
        background-color: $gray-color;
        border-radius: 4px;
    }
    &__content::before {
        top: -8px;
    }
    &__content::after {
        top: 12px;
    }
}
.list {
    margin: 0;
    padding: 0;
    display: grid;
    height: 100%;
    &__item {
        display: grid;
        position: relative;
        grid-template-columns: 1fr 1fr;
        width: 100%;
        min-height: 13rem;
        div, a {
            span {
                position: absolute;
                top: 50%;
                left: 25%;
                transform: translate(-75%, -50%) rotate(270deg);
                z-index: 5;
                color: $gray-color;
                font-size: 1.25rem;
                text-align: center;
                width: max-content;
            }
            &.router-link-exact-active {
                span {
                    color: $yellow-color;
                }
                &::after {
                    position: absolute;
                    z-index: 10;
                    left: -2px;
                    top: 50%;
                    content: '';
                    height: 5px;
                    width: 5px;
                    border-radius: 50%;
                    color: $yellow-color;
                    background: $yellow-color;
                    box-shadow: 0 0 5px 3px;
                }
            }
            .now {
                transform: translate(-65%, -50%) rotate(270deg);
            }
            .upcoming {
                transform: translate(-88%, -50%) rotate(270deg);
            }
            .news {
                transform: translate(-70%, -50%) rotate(270deg)
            }
            .contacts {
                transform: translate(-80%, -50%) rotate(270deg)
            }
            &:first-child {
                border-right: 1px solid $gray-color;
            }
        }
    }
}
</style>