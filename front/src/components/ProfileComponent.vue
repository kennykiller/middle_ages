<script setup lang="ts">
import { axiosInstance as axios } from '../utils/axios';
import { authModule } from '../store/auth/auth-actions';
import { ExpandedUser } from '@/interfaces/models';
import { ref } from '@vue/reactivity';
import { AxiosResponse } from 'axios';

const getUser = async () => {
    try {
       const response: AxiosResponse<ExpandedUser>= await axios.get(`users/detailed/${authModule.userId}`);
       if (response.status === 200) {
        return response.data;
       } 
       return {};
    } catch (e) {
        console.log(e);
        return {};
    }
}

const user = getUser().then(res => res);
</script>

<template>
    <div class="card__wrapper">
        <div class="card">
            <div class="avatar"></div>
            <div class="cover"></div>
            <div class="userinfomain">
                <h1>Jane Smith Doe</h1>
                <h2>Creative Director</h2>
            </div>
            <div class="divider"></div>
            <div class="socialinfo">
                <div class="socialone">
                    <span class="socialtext">323</span><br />
                    <span class="socialheading">followers</span>
                </div>
                <div class="socialtwo">
                    <span class="socialtext">2826</span><br />
                    <span class="socialheading">following</span>
                </div>
                <div class="socialthree">
                    <span class="socialtext">323</span><br />
                    <span class="socialheading">Stories</span>
                </div>
            </div>
        </div>
    </div> 
</template>

<style lang="scss" scoped>
.card__wrapper {
  width: 50%;
  height: 100%;
  position: absolute;
  top: 0;
  z-index: 1;
}

.card {
  width: 320px;
  height: 0px;
  background: #FFF;
  position: absolute;
  z-index: 2;
  top: 50%;
  margin-top: 0px;
  left: 50%;
  margin-left: -160px;
  box-shadow: 5px 5px 10px 2px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border-radius: 5px;
  cursor: pointer;
  opacity: 1;
  filter: alpha(opacity=100);
  -webkit-animation: card 2s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 0s;
  -webkit-animation: card 2s forwards;
  animation: card 2s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 0s;
  animation-delay: 0s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  border-left: 0px solid red;
}

@-webkit-keyframes card {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 0px solid #FFF;
    background: #444a59;
  }
  60% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 320px solid #FFF;
    background: #444a59;
  }
  61% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 0px solid #FFF;
    background: #FFF;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 420px;
    margin-top: -210px;
  }
}

@keyframes card {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 0px solid #FFF;
    background: #444a59;
  }
  60% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 320px solid #FFF;
    background: #444a59;
  }
  61% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 1px;
    margin-top: 0px;
    border-left: 0px solid #FFF;
    background: #FFF;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    height: 420px;
    margin-top: -210px;
  }
}

.avatar {
  width: 110px;
  height: 110px;
  background: url('https://joeschmoe.io/api/v1/random') no-repeat center center #FFF;
  border-radius: 100%;
  border: 5px solid rgba(255, 255, 255, 1);
  position: absolute;
  z-index: 5;
  top: 100px;
  left: 50%;
  margin-left: -55px;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-animation: avatar 1.5s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 1s;
  -webkit-animation: avatar 1.5s forwards;
  animation: avatar 1.5s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

.avatar2 { border: 5px solid #2b303b; }

@-webkit-keyframes avatar {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 1000px;
  }
  50% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 125px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 125px;
  }
}

@keyframes avatar {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 1000px;
  }
  50% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 125px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 125px;
  }
}

.cover {
  width: 0px;
  height: 0px;
  background: url(https://api.lorem.space/image/movie?w=320&h=200) no-repeat;
  background-size: contain;
  position: absolute;
  top: 50%;
  left: 50%;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-animation: cover 1s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 1.5s;
  -webkit-animation: cover 1s forwards;
  animation: cover 1s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 1.5s;
  animation-delay: 1.5s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
  border-radius: 100%;
}

@-webkit-keyframes cover {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 40%;
    left: 50%;
    width: 0px;
    height: 0px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 20%;
    margin-top: -150px;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 500px;
  }
}

@keyframes cover {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 40%;
    left: 50%;
    width: 0px;
    height: 0px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 20%;
    margin-top: -150px;
    left: 50%;
    margin-left: -250px;
    width: 500px;
    height: 500px;
  }
}

.userinfomain {
  width: 320px;
  height: 240px;
  background: #FFF;
  position: absolute;
  top: 180px;
  left: 0;
  z-index: 2;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
}

h1 {
  text-align: center;
  font-size: 1.7em;
  letter-spacing: -0.02em;
  font-weight: 700;
  color: #2b303b;
  opacity: 0;
  filter: alpha(opacity=0);
  z-index: 2;
  position: absolute;
  top: 60px;
  left: 50%;
  margin-left: -96px;
  -webkit-animation: heading1 0.6s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 1.8s;
  -webkit-animation: heading1 1s forwards;
  animation: heading1 1s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 1.8s;
  animation-delay: 1.8s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

@-webkit-keyframes heading1 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 120px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 65px;
  }
}

@keyframes heading1 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 120px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 65px;
  }
}

h2 {
  text-align: center;
  font-size: 1em;
  font-weight: 300;
  color: #999;
  opacity: 0;
  filter: alpha(opacity=0);
  z-index: 2;
  position: absolute;
  top: 60px;
  left: 50%;
  margin-left: -62px;
  -webkit-animation: heading2 0.6s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 2.2s;
  -webkit-animation: heading2 0.6s forwards;
  animation: heading2 0.6s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 2.2s;
  animation-delay: 2.2s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

@-webkit-keyframes heading2 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 160px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 98px;
  }
}

@keyframes heading2 {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    top: 160px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    top: 98px;
  }
}

.divider {
  width: 0px;
  height: 1px;
  background: #EAEAEA;
  position: relative;
  top: 320px;
  left: 50%;
  z-index: 4;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-animation: divider 1s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 2.4s;
  -webkit-animation: divider 1s forwards;
  animation: divider 1s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 2.4s;
  animation-delay: 2.4s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

@-webkit-keyframes divider {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 0px;
    left: 50%;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    left: 50%;
    margin-left: -160px;
  }
}

@keyframes divider {
  0% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 0px;
    left: 50%;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    width: 320px;
    left: 50%;
    margin-left: -160px;
  }
}

.socialinfo {
  width: 240px;
  height: 60px;
  position: absolute;
  bottom: -20px;
  left: 40px;
  z-index: 3;
  opacity: 0;
  filter: alpha(opacity=0);
  -webkit-animation: socialinfo 0.6s forwards;
  -webkit-animation-iteration-count: 1;
  -webkit-animation-delay: 1s;
  -webkit-animation: socialinfo 0.6s forwards;
  animation: socialinfo 0.6s forwards;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
  -webkit-animation-delay: 1s;
  animation-delay: 1s;
  -webkit-transition-timing-function: ease-in-out;
  transition-timing-function: ease-in-out;
}

@-webkit-keyframes socialinfo {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    bottom: -20px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    bottom: 17px;
  }
}

@keyframes socialinfo {
  0% {
    opacity: 0;
    filter: alpha(opacity=0);
    bottom: -20px;
  }
  100% {
    opacity: 1;
    filter: alpha(opacity=100);
    bottom: 17px;
  }
}

.socialone,
.socialtwo,
.socialthree {
  opacity: 0;
  filter: alpha(opacity=0);
  width: 60px;
  position: absolute;
  bottom: -20px;
  text-align: center;
  -webkit-animation: socialinfo 0.6s forwards;
  animation: socialinfo 0.6s forwards;
}

.socialone {
  left: 0;
  -webkit-animation-delay: 2.4s;
  animation-delay: 2.4s;
}

.socialtwo {
  left: 93px;
  -webkit-animation-delay: 2.6s;
  animation-delay: 2.6s;
}

.socialthree {
  left: 180px;
  -webkit-animation-delay: 2.8s;
  animation-delay: 2.8s;
}

.socialtext,
.socialheading {
  font-family: 'Roboto', sans-serif;
}

.socialtext {
  font-family: 'Roboto', sans-serif;
  font-weight: 700;
  font-size: 1.5em;
  color: #798191;
}

.socialheading {
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 0.8em;
  color: #999;
}
</style>