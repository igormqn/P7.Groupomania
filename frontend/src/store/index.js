import Vue from 'vue'
import Vuex from 'vuex'
const axios = require('axios')

const instance = axios.create({
    baseURL: 'http://localhost:3000/api/'
})

Vue.use(Vuex)

// Utilisateur par défaut
const defaultUser = {
    userId: -1,
    token: ''
}

let user = localStorage.getItem('user');

// Si l'utilisateur n'est pas dans le local storage, l'utilisateur est par défaut
    // Sinon récupérer l'utilisateur du local storage
if (!user) {
    user = defaultUser;
    console.log(user, "if !user = defaultUser");
} else {
    try {
        user = JSON.parse(user);
        instance.defaults.headers.common["Authorization"] = `Bearer ${user.token}`;
    } catch (exception) {
        user = defaultUser;
        console.log(user, "catch user=defaultUser");
    }
}

export default new Vuex.Store({
    state: {
        status: '',
        user: user,
        userInfos: {},
        userInfosByAdmin: {},
        users: [],
        posts: [],
        post: {},
        comments: [],
        comment: {},
        like: []
    },

    getters: {
        userName: state => {
            return state.userInfos.name;
        },

        hasPostRole: state => {
            if (state.userInfos.id === state.post.userId) {
                return true;
            } else {
                return false;
            }
        },

        hasCommentRole: (state) => (index) => {
            if (state.userInfos.id === state.comments[index].userId) {
                return true;
            } else {
                return false;
            }
        },

        isAdmin: state => {
            if (state.userInfos.isAdmin) {
                return true;
            } else {
                return false
            }
        },

        // Retourne l'extrait du contenu de la publication (150 premières lettres)
        contentExcerpt: (state) => (index) => {
            const content = state.posts[index].content;
            if (content.length > 150) {
                return content.substring(0, 150) + '...';
            } else {
                return content;
            }
        },

        getUserRole: (state) => (index) => {
            if (state.users[index].isAdmin) {
                return 'Admin';
            } else {
                return 'Utilisateur';
            }
        },
    },

    mutations: {
        SET_STATUS: function(state, status) {
            state.status = status;
        },

        LOG_USER: function(state, user) {
            instance.defaults.headers.common['Authorization'] = `Bearer ${user.token}`;
            // Ajouter l'utilisateur dans le local storage
            console.log(user, 'user 105')
            localStorage.setItem('user', JSON.stringify(user));
            console.log(localStorage.setItem('user', JSON.stringify(user)), 'setItem user LOG_USER');
            state.user = user;
        },

        LOG_OUT: function(state) {
            state.user = defaultUser;
            state.userInfos = {}
        },

        USER_INFOS: function(state, userInfos) {
            state.userInfos = userInfos;
        },

        SET_USER_NAME: function(state, modifiedName) {
            state.userInfos.name = modifiedName;
        },

        POSTS_LIST: function(state, posts) {
            state.posts = posts;
        },

        SINGLE_POST: function(state, post) {
            state.post = post;
        },

        CREATE_POST: function(state, newPost) {
            state.posts.unshift(newPost);
        },

        SET_POST_TITLE: function(state, modifiedTitle) {
            state.post.title = modifiedTitle;
        },

        SET_POST_CONTENT: function(state, modifiedPostContent) {
            state.post.content = modifiedPostContent;
        },
        LIKE_LIST: function(state, like) {
            state.like = like;
        },
        CREATE_LIKE: function(state, newLike) {
            state.comment = newLike
        },
        COMMENTS_LIST: function(state, comments) {
            state.comments = comments;
        },

        SINGLE_COMMENT: function(state, comment) {
            state.comment = comment;
        },

        CREATE_COMMENT: function(state, newComment) {
            state.comment = newComment
        },

        SET_COMMENT: function(state, modifiedCommentContent) {
            state.comment.content = modifiedCommentContent;
        },

        USERS_LIST: function(state, users) {
            state.users = users;
        },

        USER_INFOS_BY_ADMIN: function(state, userInfosByAdmin) {
            state.userInfosByAdmin = userInfosByAdmin;
        },

        SET_USER_ROLE: function(state, modifiedUserRole) {
            state.userInfosByAdmin.isAdmin = modifiedUserRole;
        }
    },

    actions: {
        // S'inscrire
        createAccount({ commit }, userInfos) {
            commit('SET_STATUS', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('auth/signup', userInfos)
                    .then(function(response) {
                        commit('SET_STATUS', 'created');
                        resolve(response);
                    })
                    .catch(function(error) {
                        commit('SET_STATUS', 'error_create');
                        reject(error);
                    })
            });
        },

        // Se connecter
        login({ commit }, userInfos) {
            commit('SET_STATUS', 'loading');
            return new Promise((resolve, reject) => {
                instance.post('auth/login', userInfos)
                    .then(function(response) {
                        console.log(response.data, 'response.data')
                        commit('SET_STATUS', 'login');
                        commit('LOG_USER', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        commit('SET_STATUS', 'error_login');
                        reject(error);
                    })
            });
        },

        // Logout
        logout({ commit }) {
            commit('LOG_OUT');
            commit('SET_STATUS', '');
            // Delete user from localStrorage
            localStorage.removeItem('user');
        },

        // Display informations from user
        getUserInfos({ commit, state }) {
            return new Promise((resolve, reject) => {
                instance.get(`auth/user/${state.user.userId}`)
                    .then(function(response) {
                        commit('USER_INFOS', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Change username
        editUserName({ state }, newUserName) {
            return new Promise((resolve, reject) => {
                instance.put(`auth/user/${state.userInfos.id}`, newUserName)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Delete user
        deleteUser({ state }) {
            return new Promise((resolve, reject) => {
                instance.delete(`auth/user/${state.userInfos.id}`)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Create a post
        createPost({ commit }, newPost) {
            return new Promise((resolve, reject) => {
                instance.post('posts', newPost, {'Content-Type': 'application/form-data'})
                    .then(function(response) {
                        commit('CREATE_POST', newPost);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Display all posts
        getAllPosts({ commit }) {
            return new Promise((resolve, reject) => {
                instance.get('posts')
                    .then(function(response) {
                        commit('POSTS_LIST', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Display posts
        getOnePost({ commit }, id) {
            return new Promise((resolve, reject) => {
                instance.get(`posts/${id}`)
                    .then(function(response) {
                        commit('SINGLE_POST', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Upgrade a post
        modifyPost({ state }, modifiedPost) {
            if (state.userInfos.isAdmin) {
                return new Promise((resolve, reject) => {
                    instance.put(`posts/${state.post.id}`, { data: { userId: state.post.User.id } })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                });
            } else {
            return new Promise((resolve, reject) => {
                instance.put(`posts/${state.post.id}`, modifiedPost, {'Content-Type': 'application/form-data'})
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        }},

        // Delete Post
        deletePost({ state }) {
            // If he is admin he can delete any post
                // Sinon l'utilisateur ne peut supprimer que son propre post
            if (state.userInfos.isAdmin) {
                return new Promise((resolve, reject) => {
                    instance.delete(`posts/admin/${state.post.id}`)
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                });
            } else {
                return new Promise((resolve, reject) => {
                    instance.delete(`posts/${state.post.id}`, { data: { userId: state.post.User.id } })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                });
            }
        },
        
        likePost({ commit }, { postId, userId, like }) {
            return new Promise((resolve, reject) => {
                // instance.get(`posts/${postId}/like/${id}`)
                instance.post(`posts/${postId}/like`, { like, userId, postId })
                    .then(function(response) {
                        commit('SINGLE_LIKE', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        unlikePost({ commit }, { postId, userId }) {
            console.log("unlikePost", postId, userId);
            return new Promise((resolve, reject) => {
                // instance.get(`posts/${postId}/like/${id}`)
                instance.post(`posts/${postId}/unlike`, {  userId })
                    .then(function(response) {
                        commit('SINGLE_LIKE', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        getAllLike({ commit }, id) {
            return new Promise((resolve, reject) => {
                instance.get(`posts/${id}/like`)
                    .then(function(response) {
                        commit('LIKE_LIST', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Display all comment
        getAllComments({ commit }, id) {
            return new Promise((resolve, reject) => {
                instance.get(`posts/${id}/comments`)
                    .then(function(response) {
                        commit('COMMENTS_LIST', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Display one comment
        getOneComment({ commit }, { postId, id }) {
            return new Promise((resolve, reject) => {
                instance.get(`posts/${postId}/comments/${id}`)
                    .then(function(response) {
                        commit('SINGLE_COMMENT', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Create a comment
        createComment({ commit }, { id, newComment }) {
            return new Promise((resolve, reject) => {
                instance.post(`posts/${id}/comments`, newComment)
                    .then(function(response) {
                        commit('CREATE_COMMENT', newComment);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Change a comment
        editComment({ state }, modifiedComment) {
            return new Promise((resolve, reject) => {
                instance.put(`posts/${state.comment.postId}/comments/${state.comment.id}`, modifiedComment)
                console.log(state.comment.id, 'comment.id')
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Delete comment
        deleteComment({ state }, { postId, id }) {
            // If he is admin he can delete any comment
                // Furthermore he can not delete his own comments
            if (state.userInfos.isAdmin) {
                return new Promise((resolve, reject) => {
                    instance.delete(`posts/admin/${postId}/comments/${id}`)
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                });
            } else {
                return new Promise((resolve, reject) => {
                    instance.delete(`posts/${postId}/comments/${id}`, { data: { userId: state.userInfos.id } })
                        .then(function(response) {
                            resolve(response);
                        })
                        .catch(function(error) {
                            reject(error);
                        })
                });
            }
        },

        // Display all user for admin
        getAllUsersByAdmin({ commit, state }) {
            return new Promise((resolve, reject) => {
                instance.get(`auth/admin/users/${state.userInfos.id}`)
                    .then(function(response) {
                        commit('USERS_LIST', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Display user info by admin
        getUserInfosByAdmin({ commit }, id) {
            return new Promise((resolve, reject) => {
                instance.get(`auth/user/${id}`)
                    .then(function(response) {
                        commit('USER_INFOS_BY_ADMIN', response.data);
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    });
            });
        },

        // Change user roles
        editUserRole({ state }, newUserRole) {
            return new Promise((resolve, reject) => {
                instance.put(`auth/admin/users/${state.userInfosByAdmin.id}`, newUserRole)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },

        // Delete user for admin
        deleteUserByAdmin({ state }) {
            return new Promise((resolve, reject) => {
                instance.delete(`auth/user/${state.userInfosByAdmin.id}`)
                    .then(function(response) {
                        resolve(response);
                    })
                    .catch(function(error) {
                        reject(error);
                    })
            });
        },
    }
})
