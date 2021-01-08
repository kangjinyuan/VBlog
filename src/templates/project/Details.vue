<template>
    <div style="min-height: 600px" v-loading="loading">
        <el-card shadow="never" style="min-height: 400px">
            <div slot="header">
                <el-row>
                    <el-col :span="12">
                        <span>{{project.name}}</span>
                    </el-col>
                    <el-col :span="12">
                        <div style="text-align: right;">
                            <el-button @click="$share()" style="padding: 3px 0" type="text" icon="el-icon-share">分享</el-button>
                            <el-button @click="goGithub(project.url)" style="padding: 3px 0" type="text" icon="el-icon-back">前往GitHub</el-button>
                            <el-button @click="more" style="padding: 3px 0" type="text" icon="el-icon-more-outline">更多项目</el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                发布 {{project.createTime}}
                <br> 更新 {{project.updateTime}}
            </div>
            <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 20px 0px 0px 0px">
                {{project.description}}
            </div>
            <div style="font-size: 1.1rem;color: #303133;padding: 15px 0px 15px 0px;border-bottom: 1px solid #E4E7ED;">
                <el-row>
                    <el-col :span="16"  style="padding-top: 5px">
                        <el-tooltip effect="dark" :content="'star '+project.stargazersCount" placement="bottom">
                            <i class="el-icon-star-off" style="margin: 0px 5px 0px 0px"></i>
                        </el-tooltip>
                        {{project.stargazersCount}}
                        <el-tooltip effect="dark" :content="'watch '+project.watchersCount" placement="bottom">
                            <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
                        </el-tooltip>
                        {{project.watchersCount}}
                        <el-tooltip effect="dark" :content="'fork '+project.forksCount" placement="bottom">
                            <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
                        </el-tooltip>
                        {{project.forksCount}}
                    </el-col>
                    <el-col :span="8" style="text-align: right">
                        
                        <el-tag size="small" type="danger" v-if="project.license">{{project.license}}</el-tag>
                        <el-tag size="small" type="success">{{project.language}}</el-tag>
                    </el-col>

                </el-row>


            </div>
            <div v-html="project.content" v-if="project.content" class="markdown-body" style="padding-top: 20px"></div>
            <div v-if="!project.content" style="padding: 20px 0px 20px 0px;text-align: center">
                <font style="font-size: 30px;color:#dddddd ">
                    <b>还没有介绍 (╯°Д°)╯︵ ┻━┻</b>
                </font>
            </div>
        </el-card>
    </div>
</template>

<page-query>
query ($id: ID) {
  project: strapiProject (id: $id) {
    id
    name
		content
    htmlUrl
    description
    stargazersCount
    watchersCount
    forksCount
    language {
        name
    }
    license {
        name
    }
    created_at
    updated_at
  }
}
</page-query>

<script>
    export default {
        data() {
            return {
                project: {
										id: '',
										name: '',
										content: '',
										description: '',
										stargazersCount: 0,
										watchersCount: 0,
										forksCount: 0,
										language: '',
										license: '',
										createTime: '',
										updateTime: ''
                },
                loading: false,
            }
        },
        mounted() {
					
					this.loading = true
          const project = this.$page.project
          
          if (project) {
            this.project.id = project.id
            this.project.name = project.name
            this.project.content = this.$markdown(project.content)
            this.project.url = project.htmlUrl
            this.project.description = project.description
            this.project.stargazersCount = project.stargazersCount
            this.project.watchersCount = project.watchersCount
            this.project.forksCount = project.forksCount
            this.project.language = project.language.name
            this.project.license = project.license.name
            this.project.createTime = this.$util.utcToLocal(project.created_at)
            this.project.updateTime = this.$util.utcToLocal(project.updated_at)
          }
          this.loading = false

        },
        methods: {
            goGithub(url) {
                window.open(url)
            },
            more() {
                this.$router.push('/project')
            }
        }
    }
</script>