<template>
    <div style="min-height: 600px" v-loading="loading">
        <el-card shadow="never" style="min-height: 400px">
            <div slot="header">
                <el-row>
                    <el-col :span="12">
                        <span>{{blog.title}}</span>
                    </el-col>
                    <el-col :span="12">
                        <div style="text-align: right;">
                            <el-button @click="$share()" style="padding: 3px 0" type="text" icon="el-icon-share">分享</el-button>
                            <el-button @click="edit" style="padding: 3px 0" type="text" icon="el-icon-edit">编辑</el-button>
                            <el-button style=" padding: 3px 0" type="text" icon="el-icon-more-outline" @click="more">更多博客</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                发布 {{blog.createTime}}
                <br> 更新 {{blog.updateTime}}
            </div>
            <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;border-bottom: 1px solid #E4E7ED;padding: 5px 0px 5px 0px">
                <pre style="font-family: '微软雅黑'">{{blog.description}}</pre>
            </div>
            <div v-html="blog.content" class="markdown-body" style="padding-top: 20px"></div>
        </el-card>
    </div>
</template>

<page-query>
query ($id: ID) {
  blog: strapiBlog (id: $id) {
    id
    title
    content
    description
    created_at
    updated_at
  }
}
</page-query>

<script>
    export default {
      name: 'BlogDetails',
        data() {
            return {
                blog: {
                    id: "",
                    title: "",
                    content: "",
                    description: "",
                    createTime: "",
                    updateTime: ""
                },
                loading: false,
            }
        },
        mounted() {

          this.loading = true
          const blog = this.$page.blog
          
          if (blog) {
            this.blog.id = blog.id
            this.blog.title = blog.title
            console.log(blog.content)
            this.blog.content = this.$markdown(blog.content)
            this.blog.description = blog.description
            this.blog.createTime = this.$util.utcToLocal(blog.created_at)
            this.blog.updateTime = this.$util.utcToLocal(blog.updated_at)
          }
          this.loading = false

        },
        methods: {
            edit() {
                this.$router.push('/blog/edit/' + this.blog.id)
            },
            more() {
                this.$router.push('/blog')
            }
        }
    }
</script>