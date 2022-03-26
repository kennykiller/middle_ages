import FilmsPage from '@/views/FilmsPage.vue';
import HomePage from '@/views/HomePage.vue';
import TicketsPage from '@/views/TicketsPage.vue';
import BlogPage from '@/views/BlogPage.vue';
import LoginPage from '@/views/LoginPage.vue';
import AdminPage from '@/views/AdminPage.vue';
import NotFound from '@/views/NotFound.vue';

export const routes = [
    { path: '/', component: HomePage, meta: { title: 'Home' } },
    { path: '/films', component: FilmsPage, meta: { title: 'Films' } },
    { path: '/tickets', component: TicketsPage, meta: { title: 'Tickets' } },
    { path: '/blog', component: BlogPage, meta: { title: 'Blog' } },
    { path: '/auth', component: LoginPage, meta: { title: 'Login' } },
    { path: '/admin', component: AdminPage, meta: { title: 'Add film' } },
    { path: '/:pathMatch(.*)*', component: NotFound, meta: { title: 'Page not found' }}
]