<template>
  <Layout>
    <div>
        <el-card shadow="never" style="min-height: 400px;margin-bottom: 20px;padding: 0px 0px 20px 0px">
            <el-tabs v-model="activeTab" type="card" @tab-click="onSelect">
                <el-tab-pane :label="'粉丝 '+followersTotal" name="followers" style="padding: 5px">
                    <div v-loading="followers.loading">
                        <div v-if="followers.list.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="(item,index) in followers.list" :key="'followers'+index" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <a @click="$router.push(`/social/details/${item.id}`)" style=" text-decoration:none;cursor:pointer">{{item.name}}</a>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="item.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="item.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination @current-change="pageChange" background layout="prev, pager, next" :current-page.sync="followers.query.page"
                                    :page-size="followers.query.pageSize" :total="followers.query.pageNumber*followers.query.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 没有一个粉丝</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
                <el-tab-pane :label="'关注 '+followingTotal" name="following" style="padding: 5px">
                    <div v-loading="following.loading">
                        <div v-if="following.list.length">
                            <el-row style="min-height: 200px; ">
                                <el-col :span="8" v-for="(item,index) in following.list" :key="'following'+index" style="padding: 10px">
                                    <el-card shadow="hover" style="font-size: 13px;color: #606266;line-height: 20px">
                                        <i class="el-icon-star-off"></i>&emsp;
                                        <a @click="$router.push(`/social/details/${item.name}`)" style=" text-decoration:none;cursor:pointer">{{item.name}}</a>
                                        <br>
                                        <i class="el-icon-message"></i>&emsp;
                                        <a :href="item.htmlUrl" target="_blank" style=" text-decoration:none;cursor:pointer">TA的主页</a>
                                        <br>
                                        <img :src="item.avatarUrl" style="width: 100%;border-radius:5px;margin-top: 5px">
                                    </el-card>
                                </el-col>
                            </el-row>
                            <div style="text-align: center;margin-top: 10px">
                                <el-pagination @current-change="pageChange" background layout="prev, pager, next" :current-page.sync="following.query.page"
                                    :page-size="following.query.pageSize" :total="following.query.pageNumber*following.query.pageSize">
                                </el-pagination>
                            </div>
                        </div>
                        <div style="min-height: 300px;margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-else>
                            <font style="font-size: 30px;color:#dddddd ">
                                <b>(￢_￢) 还没有关注一个人</b>
                            </font>
                        </div>
                    </div>
                </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  followers: allStrapiSocial (perPage: 5, page: $page, filter: { type: { eq: 0 } }) @paginate {
		totalCount
		pageInfo {
      perPage
      currentPage
      totalPages
    }
    edges {
      node {
        id
        name
        avatarUrl
        htmlUrl
      }
    }
  }
	following: allStrapiSocial (perPage: 5, page: $page, filter: { type: { eq: 1 } }) @paginate {
		totalCount
		pageInfo {
      perPage
      currentPage
      totalPages
    }
    edges {
      node {
        id
        name
        avatarUrl
        htmlUrl
      }
    }
  }
}
</page-query>

<script>
    export default {
        data() {
            return {
                activeTab: 'followers',
                followers: {
                    query: {
                        page: 1,
                        pageSize: 9,
                        pageNumber: 1
                    },
                    loading: false,
                    list: []
                },
                following: {
                    query: {
                        page: 1,
                        pageSize: 9,
                        pageNumber: 1
                    },
                    loading: false,
                    list: []
                },
                followersTotal: 0,
                followingTotal: 0
            }
        },
        mounted() {
						this.followersTotal = this.$page.followers.totalCount
						this.followingTotal = this.$page.following.totalCount
            this.onSelect()
        },
        methods: {
            onSelect() {
                switch (this.activeTab) {
                    case 'followers':
                        this.listFollowers()
                        break
                    case 'following':
                        this.listFollowing()
                        break
                    default:
                        break
                }
            },
            listFollowers() {
							this.followers.list = []
							this.followers.loading = true
							const {edges, pageInfo, totalCount} = this.$page.followers
							for (let i = 0; i < edges.length; i++) {
								const edge = edges[i].node
								this.followers.list.push({
									id: edge.id,
									name: edge.name,
									avatarUrl: edge.avatarUrl,
									htmlUrl: edge.htmlUrl
								})
							}
							this.followers.query.page = pageInfo.currentPage
							this.followers.query.pageSize = pageInfo.perPage
							this.followers.query.pageNumber = pageInfo.totalPages
							this.followers.loading = false
            },
            listFollowing() {
							this.following.list = []
              this.following.loading = true
							const {edges, pageInfo, totalCount} = this.$page.following
							for (let i = 0; i < edges.length; i++) {
								const edge = edges[i].node
								this.following.list.push({
									id: edge.id,
									name: edge.name,
									avatarUrl: edge.avatarUrl,
									htmlUrl: edge.htmlUrl
								})
							}
							this.following.query.page = pageInfo.currentPage
							this.following.query.pageSize = pageInfo.perPage
							this.following.query.pageNumber = pageInfo.totalPages
							this.following.loading = false
            },
						pageChange (currentPage) {
							this.$router.push('/social' + (currentPage === 1 ? '' : `/${currentPage}`))
						}
        },
				watch: {
					$route() {
						this.onSelect()
					}
				}
    }
</script>