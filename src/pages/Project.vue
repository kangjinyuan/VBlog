<template>
  <Layout>
    <div style="min-height: 600px" v-loading="loading">
        <el-card shadow="never" style="margin-bottom: 20px">
            <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
            <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
            <el-button @click="$share()" icon="el-icon-share" type="warning" style="margin-left: 10px" plain circle></el-button>
        </el-card>

        <div v-if="projects&&projects.length>0">
            <el-card shadow="hover" v-for="(item,index) in projects" :key="'pro'+index" style="margin-bottom: 20px">
              <template  v-if="!item.hide">  
								<div slot="header">
                    <el-row>
                        <el-col :span="16">
                            <span>
                                <a style="text-decoration:none;cursor:pointer" @click="goDetails(item.id)">
                                    <i class="el-icon-service"></i>&nbsp;&nbsp; {{item.name}}
                                </a>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: right;">
                                <el-button @click="goGithub(item.url)" style="padding: 3px 0" type="text" icon="el-icon-back">前往GitHub</el-button>
                                <el-button @click="$share('/project/details/'+item.id)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
                            </div>
                        </el-col>
                    </el-row>
                </div>
                <div style="font-size: 0.9rem;line-height: 1.5;color: #606c71;">
                    最近更新 {{item.updateTime}}
                </div>
                <div style="font-size: 1.1rem;line-height: 1.5;color: #303133;padding: 10px 0px 0px 0px">
                    {{item.description}}
                </div>
                <div style="font-size: 1.1rem;color: #303133;padding: 10px 0px 0px 0px">
                    <el-row>
                        <el-col :span="16" style="padding-top: 5px">
                            <el-tooltip effect="dark" :content="'star '+item.stargazersCount" placement="bottom">
                                <i class="el-icon-star-off" style="margin: 0px 5px 0px 0px"></i>
                            </el-tooltip>
                            {{item.stargazersCount}}
                            <el-tooltip effect="dark" :content="'watch '+item.watchersCount" placement="bottom">
                                <i class="el-icon-view" style="margin: 0px 5px 0px 15px"></i>
                            </el-tooltip>
                            {{item.watchersCount}}
                            <el-tooltip effect="dark" :content="'fork '+item.forksCount" placement="bottom">
                                <i class="el-icon-bell" style="margin: 0px 5px 0px 15px"></i>
                            </el-tooltip>
                            {{item.forksCount}}
                        </el-col>
                        <el-col :span="8" style="text-align: right;">
                            <el-tag size="small" type="danger" v-if="item.license">{{item.license}}</el-tag>
                            <el-tag size="small" type="success">{{item.language}}</el-tag>
                        </el-col>
                    </el-row>
                </div>
							</template>
            </el-card>
            <div style="text-align: center">
                <el-pagination @current-change="list" background layout="prev, pager, next" :current-page.sync="query.page" :page-size="query.pageSize"
                    :total="query.pageNumber*query.pageSize">
                </el-pagination>
            </div>
        </div>

        <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!projects||projects.length==0">
            <font style="font-size: 30px;color:#dddddd ">
                <b>还没有开源项目 (╯°Д°)╯︵ ┻━┻</b>
            </font>
        </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  projects: allStrapiProject (perPage: 5, page: $page) @paginate {
		pageInfo {
      perPage
      currentPage
      totalPages
    }
    edges {
      node {
        id
        name
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
  }
}
</page-query>

<script>
    export default {
        data() {
            return {
                query: {
                    page: 1,
                    pageSize: 5,
                    pageNumber: 1
                },
                loading: false,
                searchKey: "",
                projects: []
            }
        },
        mounted() {
					this.list()
        },
        methods: {
            list() {
							this.projects = []
							this.loading = true
							const {edges, pageInfo} = this.$page.projects
							for (let i = 0; i < edges.length; i++) {
								const edge = edges[i].node
								this.projects.push({
									id: edge.id,
                                    name: edge.name,
                                    url: edge.htmlUrl,
									description: edge.description,
									stargazersCount: edge.stargazersCount,
									watchersCount: edge.watchersCount,
									forksCount: edge.forksCount,
									language: edge.language.name,
									license: edge.license.name,
									createTime: this.$util.utcToLocal(edge.created_at),
									updateTime: this.$util.utcToLocal(edge.updated_at),
									hide: false
								})
							}
							this.query.page = pageInfo.currentPage
							this.query.pageSize = pageInfo.perPage
							this.query.pageNumber = pageInfo.totalPages
							this.loading = false
						},
						pageChange (currentPage) {
							this.$router.push('/project' + (currentPage === 1 ? '' : `/${currentPage}`))
						},
            search() {
                for (let i = 0; i < this.projects.length; i++) {
                    this.projects[i].hide = this.projects[i].name.indexOf(this.searchKey) < 0
                }
            },
            goDetails(id) {
                this.$router.push("/project/details/" + id)
            },
            goGithub(url) {
                window.open(url)
            }
        },
				watch: {
					$route() {
						this.list()
					}
				}
    }
</script>