<template>
  <Layout>
    <div style="min-height: 600px">
        <el-card shadow="never" style="margin-bottom: 20px">
            <el-input placeholder="请输入关键字" v-model="searchKey" clearable style="width: 300px"></el-input>
            <el-button @click="search" icon="el-icon-search" style="margin-left: 10px" circle plain></el-button>
            <el-button @click="$share()" style="margin-left: 10px" icon="el-icon-share" type="warning" plain circle></el-button>
            <el-button type="primary" icon="el-icon-edit" round plain style="float: right;" @click="goAdd">写博文</el-button>
        </el-card>

        <div v-if="blogs&&blogs.length>0">
            <el-card shadow="hover" v-for="(item,index) in blogs" :key="'p'+index" style="margin-bottom: 20px">
              <template  v-if="!item.hide">
                <div slot="header">
                    <el-row>
                        <el-col :span="16">
                            <span>
                                <a style="text-decoration:none;cursor:pointer" @click="goDetails(item.id)">
                                    <i class="el-icon-edit-outline"></i>&nbsp;&nbsp; {{item.title}}
                                </a>
                            </span>
                        </el-col>
                        <el-col :span="8">
                            <div style="text-align: right;">
                                <el-button @click="$share('/user/blog/details/'+item.id)" style="padding: 3px 0" type="text" icon="el-icon-share"></el-button>
                                <el-button @click="editBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-edit"></el-button>
                                <el-button @click="deleteBlog(index)" style="padding: 3px 0" type="text" icon="el-icon-delete"></el-button>
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
              </template>
            </el-card>
            <div style="text-align: center">
                <el-pagination @current-change="pageChange" background layout="prev, pager, next" :current-page.sync="query.page" :page-size="query.pageSize"
                    :total="query.pageNumber*query.pageSize">
                </el-pagination>
            </div>

        </div>

        <el-card shadow="never" style="margin-bottom: 20px;padding: 20px 0px 20px 0px;text-align: center" v-if="!blogs||blogs.length==0">
            <font style="font-size: 30px;color:#dddddd ">
                <b>还没有博客 (╯°Д°)╯︵ ┻━┻</b>
            </font>
        </el-card>
    </div>
  </Layout>
</template>

<page-query>
query ($page: Int) {
  blogs: allStrapiBlog (perPage: 5, page: $page) @paginate {
    pageInfo {
      perPage
      currentPage
      totalPages
    }
    edges {
      node {
        id
        title
        description
        created_at
        updated_at
      }
    }
  }
}
</page-query>

<script>
import { deleteBlog } from '@/api/blog'
    export default {
			name: 'Blog',
			data() {
					return {
							query: {
									page: 1,
									pageSize: 5,
									pageNumber: 1
							},
							loading: false,
							searchKey: "",
							blogs: []
					}
			},
			mounted() {
					this.list()
			},
			methods: {
				list() {
					this.blogs = []
					this.loading = true
					const {edges, pageInfo} = this.$page.blogs
					for (let i = 0; i < edges.length; i++) {
						const edge = edges[i].node
						this.blogs.push({
							id: edge.id,
							title: edge.title,
							description: edge.description,
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
					this.$router.push('/blog' + (currentPage === 1 ? '' : `/${currentPage}`))
				},
				search() {
					for (let i = 0; i < this.blogs.length; i++) {
							this.blogs[i].hide = this.blogs[i].title.indexOf(this.searchKey) < 0
					}
				},
				editBlog(index) {
						this.$router.push('/blog/edit/' + this.blogs[index].id)
				},
				deleteBlog(index) {
						this.$confirm('是否永久删除该博客?', '提示', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning'
						}).then(() => {
								let blog = this.blogs[index]
								deleteBlog(blog.id).then((result) => {
										this.$message({
												message: '删除成功',
												type: 'success'
										})
										this.blogs.splice(index, 1)
								})
						})
				},
				goAdd() {
						this.$router.push('/blog/add')
				},
				goDetails(id) {
						this.$router.push("/blog/details/" + id)
				}
			},
			watch: {
				$route() {
					this.list()
				}
			}
    }
</script>