<template>
    <div>
        <el-card shadow="never">
            <el-menu :default-active="active" @select="onSelect">
                <el-menu-item v-for="item in menuList"
                    :key="item.path" :index="item.path">
                    <i :class="item.meta.icon"></i>
                    <span slot="title">{{item.meta.title}}</span>
                </el-menu-item>
            </el-menu>
        </el-card>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                active: "",
                parentUrl: "",
								menuList: [
									{
										path: '/',
										meta: {
												type: "user",
												icon: 'el-icon-star-off',
												title: '最新动态'
										}
									},
									{
											path: '/social',
											meta: {
													type: "user",
													icon: 'el-icon-mobile-phone',
													title: '社交圈'
											}
									},
									{
											path: '/blog',
											meta: {
													type: "user",
													icon: 'el-icon-edit-outline',
													title: '博客列表'
											}
									},
									{
											path: '/project',
											meta: {
													type: "user",
													icon: 'el-icon-service',
													title: '开源项目'
											}
									}
                ]
            }
        },
        mounted() {
					const arr = this.$route.path.split("/")
          this.active = "/" + arr[1]
        },
        methods: {
            onSelect(index) {
                this.$router.push(index)
            },
            cancellation() {
                this.$store.dispatch("Cancellation")
            }
        }
    }
</script>