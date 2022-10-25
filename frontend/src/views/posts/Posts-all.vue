<template>
    <div class="users-posts">
        <div class="user-post" v-for="(post, index) in posts" :key="post.id">
            <div class="user" v-if="post.User">
                <div class="user-info">
                    <b-avatar></b-avatar>
                    <h2>{{ post.User.name }}</h2>
                </div>
            </div>
            <div class="post">
                <router-link 
                v-if="post.id" 
                :to="{ name: 'singlePost', 
                params: { id: post.id }}" 
                class="post-link"
                >
                    <h3 class="post-title">{{ post.title }}</h3>
                </router-link>
                <p v-if="post.content" class="post-content">{{ contentExcerpt(index) }}</p>
                <router-link 
                v-if="post.id && post.imageUrl"
                :to="{ name: 'singlePost',
                params: { id: post.id }}"
                >
                    <img :src="post.imageUrl" :alt="post.title" class="post-image">
                </router-link>
            </div>
            <div class="comment">
                <router-link v-if="post.id" :to="{ name: 'singlePost', params: { id: post.id }}">
                    <b-button variant="secondary"><b-icon-eye-fill></b-icon-eye-fill> Lire plus</b-button>
                </router-link>
                <router-link v-if="post.id" :to="{ name: 'singlePost', params: { id: post.id }}">
                    <b-button variant="primary"><b-icon-chat-dots-fill></b-icon-chat-dots-fill> Commenter</b-button>
                </router-link>
            </div>
            <div id="likebtn">
    <h1>{{message}}</h1>
    <button v-if="!liked"  @click="likePost(postId)">Like(s) {{ count }}</button>
    <button v-else @click="unlikePost(postId)">Like(s) {{ count }}</button>
  </div>
</div>
</div> 
</template>

<script>

import { mapState } from 'vuex';
    import { mapGetters } from 'vuex'
  
    export default {
        name: 'Posts-all', 
        props: {
            postId: Number,
            userId: Number
        },

        mounted: function() {
            this.$store.dispatch('getAllPosts');
        },

        computed: {
            ...mapState({
                posts: 'posts'
            }),

            ...mapGetters({
                contentExcerpt: 'contentExcerpt'
            }),

        },
       
        data() {
    return {
      message: 'Likes',
      likes:[],
      liked: null,
      count: 0
    };
  },
  methods: {
   // updateLike() { 
     //   axios.get(`http://localhost:3000/api/posts/like`)
   //   if (this.count === 0) this.count = 1;
   //   else this.count = 0;
   // },
   // likePost() { 
        //axios.get(`http://localhost:3000/api/posts/like`)
        //.then(res => {
         //   console.log(res);
       //     this.posts = res.data;
     //   })
    //    .catch (function(err) { console.log(err)});
   // }  
  },
  async fetch(postId) {
    const fetchLikes = await fetch(`http://localhost:3000/api/posts/${JSON.stringify(postId)}/likes`)
    const data = await fetchLikes.json()
    data.forEach(like => {
        like.userId == this.userId ? this.liked = true : this.like = false
    })
    return data
  },
  likePost(postId) {
    const likeData = {
        like: true,
        userId: this.userId,
        postId: postId
    }
    fetch(`http://localhost:3000/api/posts/${JSON.stringify(postId)}/like`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(likeData)
            })
            .then(res => res.json())
            .then(likeData => this.likes.push(likeData))
            .catch(error => console.log(error))
            this.liked = true
  },
  unlikePost(postId) {
    const unlikeData = {
        userId: this.userId
    }
    fetch(`http://localhost:3000/api/posts/${JSON.stringify(postId)}/unlike`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(unlikeData)
            })
            this.likes = this.likes.filter((like) => like.userId != this.userId) // <- pour unliker le post côté front
            this.liked = false
  },
  async created() {
        this.likes = await this.fetchLikes(this.postId)
    }
};


</script>

<style>
    .user-post {
        background: #FFF;
        border: 1px solid #CED4DA;
        padding: 25px !important;
        margin-bottom: 25px;
    }

    .user-post:last-child {
        margin-bottom: 0;
    }

    .user {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
    }

    .user-info {
        display: flex;
        align-items: center;
    }

    .user-info .b-avatar {
        color: #989CA1;
        background-color: #DAE0E6;
        margin-right: 8px;
        width: 32px;
        height: 32px;
    }

    .user-info h2 {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 0;
    }

    .btn-circle {
        width: 32px;
        height: 32px;
        border-radius: 50% !important;
        line-height: 1 !important;
        text-align: center;
        margin-left: 10px;
    }

    .btn-circle .b-icon {
        width: 16px;
        vertical-align: baseline;
        margin-left: -5px;
    }

    .post {
        margin-bottom: 20px;
    }

    .post a {
        cursor: pointer;
    }

    .post-link {
        text-decoration: none;
        color: #FD2D01;
        transition: all .3s ease-in-out;
    }

    .post-link:hover {
        text-decoration: underline;
        color: #FD2D01;
    }

    .post-title {
        font-size: 20px;
        font-weight: bold;
        color: #FD2D01;
        margin-bottom: 15px;
    }

    .post-content {
        font-size: 15px;
        font-weight: 300;
    }

    .post-image {
        width: 100%;
        height: 350px;
        object-fit: cover;
    }

    .comment {
        display: flex;
        justify-content: space-between;
    }
    #likebtn {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

a,
button {
  color: #4fc08d;
}

button {
  background: none;
  border: solid 1px;
  border-radius: 2em;
  font: inherit;
  padding: 0.75em 2em;
}

#like_button {
  height: 29px;
  width: 39px;
}

</style>
